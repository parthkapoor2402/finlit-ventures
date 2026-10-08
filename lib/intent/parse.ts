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
  clarify?: boolean;
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
  const zoned = zonedParts(now);
  const todayIndex = (zoned.weekday + 6) % 7;
  const lower = text.toLowerCase();
  if (includesWord(lower, "today")) {
    const month = String(zoned.month).padStart(2, "0");
    const day = String(zoned.day).padStart(2, "0");
    const iso = `${zoned.year}-${month}-${day}`;
    return range.days.includes(iso) ? iso : null;
  }
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

const NAMED_LINES: readonly { test: RegExp; title: string; type: NeedType }[] = [
  { test: /\bflights?\b/i, title: "Flight", type: "book" },
  { test: /\bhotels?\b/i, title: "Hotel", type: "book" },
  { test: /\bchargers?\b/i, title: "Charger", type: "replace" },
  { test: /\b(clothes|clothing|outfit|outfits)\b/i, title: "Clothes", type: "buy" },
  { test: /\bdresses?\b/i, title: "Dress", type: "buy" },
  { test: /\bwatch(?:es)?\b/i, title: "Watch", type: "buy" },
  { test: /\b(necklace|jewellery|jewelry)\b|\bgold\b/i, title: "Gold necklace", type: "buy" },
  { test: /\bring\b/i, title: "Ring", type: "buy" },
  { test: /\bcake\b/i, title: "Cake", type: "buy" },
  { test: /\bgroceries\b/i, title: "Groceries", type: "buy" },
  { test: /\bmedicines?\b/i, title: "Medicine", type: "buy" },
  { test: /\btravel essentials\b/i, title: "Travel essentials", type: "buy" },
  { test: /\bgift\b/i, title: "Gift", type: "buy" },
];

function namedLines(text: string): { title: string; type: NeedType }[] {
  const found: { title: string; type: NeedType; at: number }[] = [];
  for (const item of NAMED_LINES) {
    const match = item.test.exec(text);
    if (!match || match.index === undefined) continue;
    if (found.some((line) => line.title === item.title)) continue;
    found.push({ title: item.title, type: item.type, at: match.index });
  }
  return found
    .sort((left, right) => left.at - right.at)
    .slice(0, 6)
    .map(({ title, type }) => ({ title, type }));
}

function parentTitle(text: string): string {
  if (/\bbirthday\b/i.test(text)) {
    if (/\bsister\b/i.test(text)) return "Sister's birthday";
    if (/\bmother\b/i.test(text)) return "Mother's birthday";
    return "Birthday";
  }
  if (/\banniversary\b/i.test(text)) return "Anniversary";
  if (/\bvacation\b/i.test(text)) return "Vacation";
  const place = text.match(/\bto\s+([A-Za-z]+)/i);
  const skip = new Set(["a", "an", "the", "my", "this", "buy", "get", "some", "me"]);
  if (place?.[1] && !skip.has(place[1].toLowerCase())) {
    return `Trip to ${capitalise(place[1].toLowerCase())}`;
  }
  if (/\b(travell?ing|trip|flight)\b/i.test(text)) return "Trip";
  return "What you need";
}

function parentKind(text: string): MomentKind {
  if (/\bbirthday\b/i.test(text)) return "birthday";
  if (/\b(flight|hotel|travel|travell?ing|trip|vacation)\b/i.test(text)) return "going";
  return "buy";
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

  const named = namedLines(sentence);
  if (named.length >= 2) {
    return {
      title: parentTitle(sentence),
      kind: parentKind(sentence),
      day,
      suggestions: named.map((line) => ({ ...line, selectedByDefault: true })),
    };
  }

  if (/\bsomething nice\b/i.test(lower) && named.length === 0) {
    return {
      title: "Something for them",
      kind: "other",
      day,
      suggestions: [],
      clarify: true,
    };
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

  if (/\b(necklace|jewellery|jewelry|gold|ring)\b/i.test(lower)) {
    const title = /\bring\b/i.test(lower) && !/\b(necklace|gold)\b/i.test(lower) ? "Ring" : "Gold necklace";
    return {
      title: /\banniversary\b/i.test(lower) ? "Anniversary" : title,
      kind: "buy",
      day,
      suggestions: [{ title, type: "buy", selectedByDefault: true }],
    };
  }

  if (/\bwatch(?:es)?\b/i.test(lower)) {
    return {
      title: "Watch",
      kind: "buy",
      day,
      suggestions: [{ title: "Watch", type: "buy", selectedByDefault: true }],
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

  if (named.length === 1 && named[0]?.title === "Flight") {
    return {
      title: "Flight",
      kind: "going",
      day,
      suggestions: [{ title: "Flight", type: "book", selectedByDefault: true }],
    };
  }

  if (named.length === 1 && named[0]?.title === "Hotel") {
    return {
      title: "Hotel",
      kind: "going",
      day,
      suggestions: [{ title: "Hotel", type: "book", selectedByDefault: true }],
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
