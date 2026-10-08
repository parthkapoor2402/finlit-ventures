import { describe, expect, it } from "vitest";
import { parseIntent, selectionFor } from "@/lib/intent/parse";
import { resolveNeed } from "@/lib/tata/resolutionEngine";

const WEDNESDAY = new Date("2026-10-07T12:00:00+05:30");
const SATURDAY = new Date("2026-10-10T12:00:00+05:30");

describe("parseIntent", () => {
  it("pre-checks a single charger line", () => {
    const intent = parseIntent("My charger stopped working", WEDNESDAY);
    expect(intent.kind).toBe("fix");
    expect(intent.title).toBe("Charger");
    expect(intent.day).toBeNull();
    expect(intent.suggestions).toEqual([
      { title: "Replace charger", type: "replace", selectedByDefault: true },
    ]);
    expect(resolveNeed("replace", "Replace charger")?.destination).toBe("croma");
  });

  it("leaves a going-home moment unchecked and dates the weekend as Friday", () => {
    const intent = parseIntent("Going home this weekend", WEDNESDAY);
    expect(intent).toMatchObject({ title: "Going home", kind: "going", day: "2026-10-09" });
    expect(intent.suggestions.map((line) => line.selectedByDefault)).toEqual([false, false, false]);
    expect(intent.suggestions.map((line) => [line.title, line.type])).toEqual([
      ["Travel home", "book"],
      ["Pack", "prepare"],
      ["A gift", "buy"],
    ]);
    expect(resolveNeed("prepare", "Pack")).toBeNull();
    expect(resolveNeed("book", "Travel home")?.label).toBe("Air India");
  });

  it("offers groceries and a plan for friends, on Saturday when that day is named", () => {
    const intent = parseIntent("Friends are coming Saturday", WEDNESDAY);
    expect(intent).toMatchObject({ title: "Friends coming", kind: "friends", day: "2026-10-10" });
    expect(intent.suggestions).toEqual([
      { title: "Groceries", type: "buy", selectedByDefault: false },
      { title: "A plan", type: "plan", selectedByDefault: false },
    ]);
    expect(resolveNeed("plan", "A plan")).toBeNull();
    expect(resolveNeed("buy", "Groceries")?.destination).toBe("bigbasket");
  });

  it("keeps exams as reminders and does not invent next Monday", () => {
    const intent = parseIntent("My exams start Monday", WEDNESDAY);
    expect(intent).toMatchObject({ title: "Exams", kind: "exam", day: null });
    expect(intent.suggestions).toEqual([
      { title: "Study", type: "remember", selectedByDefault: false },
      { title: "A reminder", type: "remember", selectedByDefault: false },
    ]);
    expect(resolveNeed("remember", "Study")).toBeNull();
    expect(resolveNeed("remember", "A reminder")).toBeNull();
  });

  it("turns a birthday gift into one buy line", () => {
    const intent = parseIntent("I need a birthday gift", WEDNESDAY);
    expect(intent.kind).toBe("birthday");
    expect(intent.suggestions).toEqual([{ title: "Buy a gift", type: "buy", selectedByDefault: true }]);
    expect(resolveNeed("buy", "Buy a gift")?.destination).toBe("westside");
  });

  it("keeps groceries as a BigBasket line only after the line exists", () => {
    const intent = parseIntent("I need groceries", WEDNESDAY);
    expect(intent.suggestions).toEqual([{ title: "Groceries", type: "buy", selectedByDefault: true }]);
    expect(JSON.stringify(intent)).not.toContain("bigbasket");
    expect(resolveNeed(intent.suggestions[0]!.type, intent.suggestions[0]!.title)?.destination).toBe("bigbasket");
  });

  it("does not name a brand for a vague buy", () => {
    const intent = parseIntent("I need to buy something", WEDNESDAY);
    expect(intent.kind).toBe("buy");
    expect(intent.suggestions).toEqual([{ title: "Buy something", type: "buy", selectedByDefault: false }]);
    expect(resolveNeed("buy", "Buy something")).toBeNull();
    expect(JSON.stringify(intent)).not.toMatch(/croma|westside|bigbasket/i);
  });

  it("drops a named day that has already passed this week", () => {
    expect(parseIntent("Going home this weekend", SATURDAY).day).toBeNull();
    expect(parseIntent("Friends are coming Saturday", SATURDAY).day).toBe("2026-10-10");
  });

  it("splits a Mumbai weekend into separate needs instead of one shop", () => {
    const intent = parseIntent(
      "I'm travelling to Mumbai this weekend. I need a flight, a charger, some clothes and a hotel.",
      WEDNESDAY,
    );
    expect(intent.title).toBe("Trip to Mumbai");
    expect(intent.kind).toBe("going");
    expect(intent.suggestions.map((line) => [line.title, line.type, line.selectedByDefault])).toEqual([
      ["Flight", "book", true],
      ["Charger", "buy", true],
      ["Clothes", "buy", true],
      ["Hotel", "book", true],
    ]);
    expect(resolveNeed("book", "Flight")?.label).toBe("Air India");
    expect(resolveNeed("replace", "Charger")?.destination).toBe("croma");
    expect(resolveNeed("buy", "Clothes")?.label).toBe("Westside");
    expect(resolveNeed("book", "Hotel")?.label).toBe("Taj");
    expect(JSON.stringify(intent)).not.toMatch(/croma|westside/i);
  });

  it("keeps a gold necklace on Tanishq", () => {
    const intent = parseIntent("I need to buy my mother a gold necklace for her anniversary", WEDNESDAY);
    expect(intent.suggestions[0]?.title).toBe("Gold necklace");
    expect(resolveNeed("buy", "Gold necklace")?.destination).toBe("tanishq");
  });

  it("asks for clarification when the gift is unnamed", () => {
    const intent = parseIntent("I need something nice for my sister", WEDNESDAY);
    expect(intent.clarify).toBe(true);
    expect(intent.suggestions).toEqual([]);
  });

  it("keeps one bought charger as a single buy", () => {
    const intent = parseIntent("I need to buy a charger today.", WEDNESDAY);
    expect(intent.suggestions).toEqual([{ title: "Charger", type: "buy", selectedByDefault: true }]);
    expect(intent.day).toBe("2026-10-07");
    expect(resolveNeed("buy", "Charger")?.label).toBe("Croma");
  });

  it("keeps one replaced charger as a single replace", () => {
    const intent = parseIntent("I need to replace my old charger.", WEDNESDAY);
    expect(intent.suggestions).toEqual([
      { title: "Replace charger", type: "replace", selectedByDefault: true },
    ]);
    expect(resolveNeed("replace", "Replace charger")?.label).toBe("Croma");
  });

  it("splits a flight and a hotel into two bookings", () => {
    const intent = parseIntent("I need a flight and a hotel for Mumbai.", WEDNESDAY);
    expect(intent.title).toBe("Trip to Mumbai");
    expect(intent.suggestions.map((line) => [line.title, line.type])).toEqual([
      ["Flight", "book"],
      ["Hotel", "book"],
    ]);
    expect(resolveNeed("book", "Flight")?.label).toBe("Air India");
    expect(resolveNeed("book", "Hotel")?.label).toBe("Taj");
  });

  it("splits a birthday into a dress, a watch, and a gift", () => {
    const intent = parseIntent("My sister's birthday is next week. I need a dress, a watch and a gift.", WEDNESDAY);
    expect(intent.title).toBe("Sister's birthday");
    expect(intent.suggestions.map((line) => [line.title, line.type])).toEqual([
      ["Dress", "buy"],
      ["Watch", "buy"],
      ["Gift", "buy"],
    ]);
    expect(resolveNeed("buy", "Dress")?.label).toBe("Westside");
    expect(resolveNeed("buy", "Watch")?.label).toBe("Titan");
    expect(resolveNeed("buy", "Gift")?.label).toBe("Westside");
  });

  it("does not let the word charger decide the other needs", () => {
    const intent = parseIntent(
      "I'm travelling to Mumbai this weekend. I need a flight, a charger, some clothes",
      WEDNESDAY,
    );
    expect(intent.suggestions.map((line) => [line.title, line.type])).toEqual([
      ["Flight", "book"],
      ["Charger", "buy"],
      ["Clothes", "buy"],
    ]);
    expect(intent.suggestions.some((line) => line.type === "replace")).toBe(false);
  });

  it("caps suggestions at four", () => {
    const lines = selectionFor("other", [
      { title: "One", type: "remember" },
      { title: "Two", type: "remember" },
      { title: "Three", type: "remember" },
      { title: "Four", type: "remember" },
      { title: "Five", type: "remember" },
    ]);
    expect(lines).toHaveLength(4);
    expect(lines.every((line) => line.selectedByDefault === false)).toBe(true);
  });
});
