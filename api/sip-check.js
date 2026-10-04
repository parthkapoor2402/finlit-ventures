// src/domain/assessment-reasons.ts
var ASSESSMENT_REASON_LABELS = {
  cash_need: "My expenses or priorities have changed.",
  market_worry: "I\u2019m unsure about market movements.",
  goal_changed: "My plans or timeline have changed.",
  fund_reconsider: "I want to understand my investment better.",
  income_changed: "My income or expenses have changed.",
  not_sure: "I\u2019m still figuring things out.",
  something_else: "Something else."
};

// src/server/sip-check-bot.ts
var SIP_CHECK_SYSTEM_PROMPT = `You are SIP Check, the educational assistant inside FinLit Ventures.

Your purpose is to explain SIP mechanics, planned contribution differences, scenario assumptions, and general financial-literacy concepts in plain language.

The user retains full control over their decisions.

You may:
- Explain how a systematic investment plan works.
- Explain the difference between future contributions and existing mutual fund units.
- Explain the contribution arithmetic supplied by the application.
- Help users compare scenarios they explicitly enter.
- Ask neutral clarifying questions.
- Explain general concepts such as liquidity, volatility, diversification, compounding, and time horizon.
- Help users identify information they may wish to discuss with a qualified financial professional.
- Summarise the user's own stated considerations without deciding for them.

You must not:
- Recommend that the user Keep, Reduce, Pause, buy, sell, hold, switch, redeem, or restart a specific investment.
- Recommend a particular mutual fund or security.
- Provide personalised portfolio allocation or security-selection recommendations.
- Predict returns, market movements, future NAV, or the date a financial goal will be achieved.
- Claim that continuing a SIP is always better than pausing.
- Claim that pausing a SIP is always harmful.
- Use fear, shame, guilt, urgency, or pressure to influence the user.
- Make a decision on the user's behalf.
- Claim to have changed or accessed the user's SIP.
- Invent financial data, calculations, or account information.
- Treat a disclaimer as permission to provide otherwise restricted advice.

For any numerical statement about the user's scenario, use the validated values supplied by the application. If information is missing, ask a clarifying question or explain the limitation.

When discussing a cash-flow problem, acknowledge that immediate expenses and essential obligations may take priority for the user. Do not pressure them to maintain contributions.

When the user asks "What should I do?", respond with a neutral framework:
1. Clarify what the user is trying to address.
2. Explain the factual differences between their stated scenarios.
3. Identify relevant considerations without ranking the options.
4. Invite the user to make their own decision or seek qualified advice if needed.

If the user asks for a fund-specific recommendation, market prediction, or personalised investment advice, explain that the assistant is not designed to provide it. Offer a relevant educational explanation instead.

Use concise, warm, non-judgmental language. Avoid jargon unless the user requests it.

Write every reply so it can be read on a phone:
- Use two or three short paragraphs. Separate paragraphs with a blank line.
- Put only the direct answer, the rupee figures, and a short label in **bold**. Example: The difference is **\u20B936,000** less in planned contributions.
- Do not bold a whole sentence.
- When you list distinct points, put each one on its own line, starting with 1. 2. 3.
- Do not use headings, tables, or code blocks.
- Do not use a single asterisk. Bold must be a pair, written as **like this**.

Never imply that the app executes, pauses, cancels, or restarts SIPs.

Always distinguish a planned contribution difference from an investment loss or a future portfolio-value estimate.`;
var MISSING_KEY_MESSAGE = "SIP Check Bot needs an API key in the server environment variable XAI_API_KEY. A key starting with gsk_ is sent to Groq. A key starting with xai- is sent to xAI Grok. The assessment still works without it. FinLit is not registered with SEBI or AMFI, and this assistant is not investment advice.";
var GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
var XAI_RESPONSES_URL = "https://api.x.ai/v1/responses";
var GROQ_DEFAULT_MODEL = "qwen/qwen3.8-27b";
function usesGroq(apiKey) {
  return apiKey.startsWith("gsk_");
}
function modelForKey(apiKey, requested) {
  if (usesGroq(apiKey)) {
    if (requested && !requested.startsWith("grok")) return requested;
    return GROQ_DEFAULT_MODEL;
  }
  return requested && requested.length > 0 ? requested : "grok-4.7";
}
var MAX_MESSAGES = 12;
var MAX_CHARS = 2e3;
var MAX_OUTPUT_TOKENS = 900;
var hits = /* @__PURE__ */ new Map();
function allowRequest(ip, now = Date.now()) {
  const windowStart = now - 6e4;
  const recent = (hits.get(ip) ?? []).filter((stamp) => stamp > windowStart);
  if (recent.length >= 8) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}
function validateChatRequest(body) {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Send the scenario and a short question." };
  }
  const record = body;
  if (!Array.isArray(record.messages) || record.messages.length === 0 || record.messages.length > MAX_MESSAGES) {
    return { ok: false, message: "Send between 1 and 12 messages." };
  }
  const messages = [];
  for (const item of record.messages) {
    if (!item || typeof item !== "object") return { ok: false, message: "A message was not readable." };
    const message = item;
    if (message.role !== "user" && message.role !== "assistant") {
      return { ok: false, message: "Only user and assistant messages are accepted." };
    }
    if (typeof message.content !== "string" || message.content.trim() === "" || message.content.length > MAX_CHARS) {
      return { ok: false, message: "Each message must be a short piece of text." };
    }
    messages.push({ role: message.role, content: message.content.trim() });
  }
  if (messages[messages.length - 1]?.role !== "user") {
    return { ok: false, message: "The latest message must be from you." };
  }
  const context = normaliseContext(record.context);
  return { ok: true, value: { messages, context } };
}
function contextAppendix(context) {
  const reason = context.reason ? ASSESSMENT_REASON_LABELS[context.reason] : "Not provided";
  const lines = [
    "Validated values from the application. Use these figures. Do not invent or recompute a different contribution difference.",
    `Reason: ${reason}`,
    `Current monthly SIP: \u20B9${context.current || "not provided"}`,
    `Proposed monthly SIP: \u20B9${context.proposed || "not provided"}`,
    `Months: ${context.months || "not provided"}`,
    `Contribution difference: \u20B9${context.contributionDifference || "not provided"} less in planned contributions over that period.`,
    `Scenario currently explored: ${context.scenario ?? "not chosen"}`,
    "This contribution difference is not an investment loss, a return forecast, or a portfolio value.",
    "Skip Check has not changed the SIP."
  ];
  if (context.misconceptions.length > 0) {
    lines.push(`The person missed these knowledge-check ideas and asked for an explanation: ${context.misconceptions.join(" ")}`);
  }
  return lines.join("\n");
}
function extractReply(payload) {
  if (!payload || typeof payload !== "object") return null;
  const data = payload;
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  if (Array.isArray(data.output)) {
    const parts = [];
    for (const item of data.output) {
      if (!item || typeof item !== "object") continue;
      const content = item.content;
      if (typeof content === "string") parts.push(content);
      if (Array.isArray(content)) {
        for (const block of content) {
          if (block && typeof block === "object" && typeof block.text === "string") {
            parts.push(block.text);
          }
        }
      }
    }
    const joined = parts.join("\n").trim();
    if (joined) return joined.slice(0, 4e3);
  }
  if (Array.isArray(data.choices)) {
    const first = data.choices[0];
    if (typeof first?.message?.content === "string" && first.message.content.trim()) {
      return first.message.content.trim().slice(0, 4e3);
    }
  }
  return null;
}
async function handleChatRequest(body, ip, deps) {
  if (!deps.apiKey) {
    return { status: 503, body: { message: MISSING_KEY_MESSAGE } };
  }
  const now = deps.now ? deps.now() : Date.now();
  if (!allowRequest(ip, now)) {
    return { status: 429, body: { message: "SIP Check is pausing briefly. You can try again in a minute. The assessment is still available." } };
  }
  const parsed = validateChatRequest(body);
  if (!parsed.ok) return { status: 400, body: { message: parsed.message } };
  const model = modelForKey(deps.apiKey, deps.model);
  const input = [
    { role: "system", content: `${SIP_CHECK_SYSTEM_PROMPT}

${contextAppendix(parsed.value.context)}` },
    ...parsed.value.messages
  ];
  const fetchImpl = deps.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25e3);
  try {
    const response = await postOnce(fetchImpl, deps.apiKey, model, input, controller.signal);
    if (response.status === 429 || response.status === 503) {
      const retry = await postOnce(fetchImpl, deps.apiKey, model, input, controller.signal);
      return await readModel(retry);
    }
    return await readModel(response);
  } catch {
    return { status: 504, body: { message: "SIP Check did not reply in time. The assessment is still available, and your SIP has not been changed." } };
  } finally {
    clearTimeout(timer);
  }
}
async function postOnce(fetchImpl, apiKey, model, input, signal) {
  if (usesGroq(apiKey)) {
    return fetchImpl(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelForKey(apiKey, model),
        messages: input,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.2
      }),
      signal
    });
  }
  return fetchImpl(XAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: modelForKey(apiKey, model),
      input,
      max_output_tokens: MAX_OUTPUT_TOKENS,
      store: false
    }),
    signal
  });
}
async function readModel(response) {
  if (response.status === 401) {
    return {
      status: 502,
      body: {
        message: "The API key was rejected. A key that starts with gsk_ is sent to Groq. A key that starts with xai- is sent to xAI. The assessment is still available, and your SIP has not been changed."
      }
    };
  }
  if (!response.ok) {
    return { status: 502, body: { message: "SIP Check could not reply just now. The assessment is still available, and your SIP has not been changed." } };
  }
  const payload = await response.json();
  const reply = extractReply(payload);
  if (!reply) {
    return { status: 502, body: { message: "SIP Check returned an empty reply. The assessment is still available." } };
  }
  return { status: 200, body: { reply } };
}
function normaliseContext(value) {
  const empty = {
    reason: null,
    current: "",
    proposed: "",
    months: "",
    contributionDifference: "",
    scenario: null,
    misconceptions: []
  };
  if (!value || typeof value !== "object") return empty;
  const context = value;
  const reason = isReason(context.reason) ? context.reason : null;
  const scenario = context.scenario === "keep" || context.scenario === "reduce" || context.scenario === "pause" ? context.scenario : null;
  return {
    reason,
    current: digits(context.current),
    proposed: digits(context.proposed),
    months: digits(context.months),
    contributionDifference: digits(context.contributionDifference),
    scenario,
    misconceptions: Array.isArray(context.misconceptions) ? context.misconceptions.filter((item) => typeof item === "string").slice(0, 3).map((item) => item.slice(0, 240)) : []
  };
}
function digits(value) {
  return typeof value === "string" && /^\d+$/.test(value) ? value : "";
}
function isReason(value) {
  return value === "cash_need" || value === "market_worry" || value === "goal_changed" || value === "fund_reconsider" || value === "income_changed" || value === "not_sure" || value === "something_else";
}

// server/vercel-sip-check.ts
async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Use POST for SIP Check." });
    return;
  }
  const forwarded = req.headers["x-forwarded-for"];
  const headerIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const ip = headerIp?.split(",")[0]?.trim() || "vercel";
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ message: "Send the question as JSON." });
      return;
    }
  }
  const apiKey = firstSet(process.env.GROQ_API_KEY, process.env.XAI_API_KEY);
  const model = firstSet(process.env.GROQ_MODEL, process.env.XAI_MODEL);
  const result = await handleChatRequest(body, ip, { apiKey, model });
  res.status(result.status).json(result.body);
}
function firstSet(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") return value.trim();
  }
  return void 0;
}
export {
  handler as default
};
