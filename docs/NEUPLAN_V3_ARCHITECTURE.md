# NeuPlan V3 architecture

Same app. Not a second product.

```
Tata Neu shell
  → NeuPlan screens
    → intent parser (fallback always, Gemini optional)
    → moment + kept needs
    → resolution engine
    → existing demo catalogue
    → analytics events
```

## What stays

Next.js App Router, TypeScript strict, CSS modules, the JSON store, route handlers, the five-tab shell, demo flags, and the Gemini client that reads `GEMINI_MODEL` and `GEMINI_API_KEY` only on the server.

## What changes

- The gate no longer sends a new visitor through week setup.
- A moment is stored. Kept lines are needs with `momentId`.
- `lib/intent/parse.ts` turns a sentence into suggestions. It does not save them.
- `lib/tata/resolutionEngine.ts` is the only place a need becomes a Tata stop. Screens call it. They do not pick a brand.
- `POST /api/ai/intent` validates a structured reply. Failure uses the parser.
- `POST /api/moments` saves a moment and only the lines the client sends.
- This week reads dates already on those lines. It is not the first screen.
- The youth WAU sentence is not rendered.

## Gemini boundary

Intent extraction may send the student’s sentence, because the sentence is the input they just typed. The reply must be JSON with a title, a kind, and suggestion titles and types. It is rejected if it contains a rupee amount, a percent, a price word, more than four suggestions, or a kind or type outside the lists. The reply cannot name a Tata destination. The engine decides that after the student keeps a line.

The weekly summary path is unchanged: counts only, no titles.

## Store

Version 2 files gain `moments: []` and `momentId: null` on older needs when read. No new database.

## Not in this version

Live inventory, checkout, pushes, Cult booking, Qmin as a meal app, college identity, and a social graph.
