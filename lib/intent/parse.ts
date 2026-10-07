import type { MomentKind, NeedType } from "@/lib/types";
import { weekRange, zonedParts } from "@/lib/week";

export interface IntentSuggestion {
  title: string;
  type: NeedType;
  selectedByDefault: boolean;
}

export interface ParsedIntent {
  title: string;
  kind: MomentKind;
  day: string | null;
  suggestions: IntentSuggestion[];
}

const DAY_NAMES = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

const DEVICES = [
  "charger",
  "cable",
  "earphones",
  "earphone",
  "headphones",
  "headphone",
  "adapter",
  "laptop",
  "phone",
  "mouse",
  "keyboard",
  "usb",
] as const;

function includesWord(text: string, word: string): boolean {
  return new RegExp(`\\b${word}\\b`, "i").test(text);
}

function capitalise(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function deviceIn(text: string): string | null {
  return DEVICES.find((word) => includesWord(text, word)) ?? null;
}

export function dayFromSentence(text: string, now = new Date()): string | null {
  const range = weekRange(now);
  const todayIndex = (zonedParts(now).weekday + 6) % 7;
  const lower = text.toLowerCase();
  let target: number | null = null;
  for (let index = 0; index < DAY_NAMES.length; index += 1) {
    const name = DAY_NAMES[index];
    if (name && includesWord(lower, name)) {
      target = index;
      break;
    }
  }
  if (target === null && includesWord(lower, "weekend")) target = 4;
  if (target === null || target < todayIndex) return null;
  return range.days[target] ?? null;
}

export function selectionFor(
  kind: MomentKind,
  items: readonly { title: string; type: NeedType }[],
): IntentSuggestion[] {
  const capped = items.slice(0, 4);
  return capped.map((item) => {
    const type: NeedType = kind === "exam" ? "remember" : item.type;
    const single = capped.length === 1;
    const vague = /\bsomething\b/i.test(item.title);
    const obvious = kind === "fix" || kind === "birthday" || (kind === "buy" && !vague);
    return {
      title: item.title,
      type,
      selectedByDefault: single && obvious,
    };
  });
}

function fixLines(text: string): { title: string; suggestions: { title: string; type: NeedType }[] } {
  const device = deviceIn(text);
  if (device === "charger") {
    return { title: "Charger", suggestions: [{ title: "Replace charger", type: "replace" }] };
  }
  if (device) {
    const name = capitalise(device);
    return { title: name, suggestions: [{ title: `Replace ${device}`, type: "replace" }] };
  }
  return { title: "Fix", suggestions: [{ title: "Fix it", type: "replace" }] };
}

function purchaseName(text: string): string | null {
  const cleaned = text
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\b(i|need|to|buy|a|an|some|something|the|please|want|get|for)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned || /^(something|stuff|thing|things)$/i.test(cleaned)) return null;
  return cleaned.slice(0, 80);
}

export function parseIntent(text: string, now = new Date()): ParsedIntent {
  const sentence = text.trim().replace(/\s+/g, " ");
  const day = sentence ? dayFromSentence(sentence, now) : null;
  const lower = sentence.toLowerCase();

  if (!sentence) {
    return { title: "Something else", kind: "other", day: null, suggestions: [] };
  }

  if (/\bexams?\b/i.test(lower)) {
    return {
      title: "Exams",
      kind: "exam",
      day,
      suggestions: selectionFor("exam", [
        { title: "Study", type: "remember" },
        { title: "A reminder", type: "remember" },
      ]),
    };
  }

  if (/\bfriends?\b/i.test(lower)) {
    return {
      title: "Friends coming",
      kind: "friends",
      day,
      suggestions: selectionFor("friends", [
        { title: "Groceries", type: "buy" },
        { title: "A plan", type: "plan" },
      ]),
    };
  }

  if (/\bbirthday\b/i.test(lower)) {
    return {
      title: "Birthday",
      kind: "birthday",
      day,
      suggestions: selectionFor("birthday", [{ title: "Buy a gift", type: "buy" }]),
    };
  }

  if (/\b(charger|stopped working|broken|broke|repair|fix|replace)\b/i.test(lower)) {
    const fix = fixLines(lower);
    return {
      title: fix.title,
      kind: "fix",
      day,
      suggestions: selectionFor("fix", fix.suggestions),
    };
  }

  if (/\b(going|trip|flight|travel)\b/i.test(lower)) {
    const home = /\bhome\b/i.test(lower);
    return {
      title: home ? "Going home" : "Going somewhere",
      kind: "going",
      day,
      suggestions: selectionFor(
        "going",
        home
          ? [
              { title: "Travel home", type: "book" },
              { title: "Pack", type: "prepare" },
              { title: "A gift", type: "buy" },
            ]
          : [
              { title: "Travel", type: "book" },
              { title: "Pack", type: "prepare" },
            ],
      ),
    };
  }

  if (/\bweekend\b/i.test(lower)) {
    return {
      title: "Weekend",
      kind: "weekend",
      day,
      suggestions: selectionFor("weekend", [{ title: "A plan", type: "plan" }]),
    };
  }

  if (/\bgrocer(?:y|ies)\b/i.test(lower)) {
    return {
      title: "Groceries",
      kind: "buy",
      day,
      suggestions: selectionFor("buy", [{ title: "Groceries", type: "buy" }]),
    };
  }

  if (/\b(buy|shop|purchase)\b/i.test(lower)) {
    const named = purchaseName(sentence);
    if (!named) {
      return {
        title: "Something to buy",
        kind: "buy",
        day,
        suggestions: selectionFor("buy", [{ title: "Buy something", type: "buy" }]),
      };
    }
    const device = deviceIn(named);
    return {
      title: capitalise(named),
      kind: "buy",
      day,
      suggestions: selectionFor("buy", [
        { title: capitalise(named), type: device ? "replace" : "buy" },
      ]),
    };
  }

  return {
    title: capitalise(sentence).slice(0, 80),
    kind: "other",
    day,
    suggestions: selectionFor("other", [{ title: capitalise(sentence).slice(0, 80), type: "remember" }]),
  };
}
