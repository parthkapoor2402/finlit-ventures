# Product decisions

NeuPlan V3 is a hypothesis for qualitative testing. It is intent to action, constrained. It is not a validated habit, not product-market fit, and not a weekly-active-user result.

The case target of youth WAU +15% stays in `HYPOTHESIS_LINE` for the research note and the label test. It is not rendered on any screen. It is not claimed as achieved. Baseline youth WAU is `TBD — REQUIRES TATA INTERNAL DATA`.

## What shipped

The first screen is "What are you up to?" when there are no moments and no needs. Home still has one NeuPlan entry: "Tell us what's happening. We'll line up what you need." It keeps the dark border, the New badge, and Open NeuPlan. NeuPlan is not in the bottom nav. The nav stays Home, Categories, Scan & Pay, Offers, NeuCard.

Chips fill an editable sentence. "See how it works" is three lines: Tell us, Build your plan, Get it done. It does not install a sample week. A single obvious line, such as a charger, starts checked. Several lines start unchecked. Nothing is saved until the student confirms at least one line. Classes, Assignment due, and a fake week are not seeded on this path.

Each confirmed line is a need on a moment. The week is a secondary list of days that already have a date. An empty return says "Nothing is waiting on you." "What changed" lists only added lines, a stop being explored, and a line marked done.

## Tata stops

The resolution engine in `lib/tata/resolutionEngine.ts` is the only mapping from a kept line to a stop. It wraps the existing keyword rules. Screens do not pick a brand. Destinations stay Croma, Westside, BigBasket, Tata 1mg, Air India (`travel`), IHCL, and Neu UPI. Cult, Qmin, and unverified fitness are not used.

Exam, study, remember, and pack do not become a shop. A vague buy has no brand until the student names the thing. Demo pages stay `isLive: false` and `demoOnly: true`. The price is ₹—. Nothing is sold.

## Gemini boundary

Intent extraction may send the sentence the student just typed. The reply must be JSON with a title, a kind, and suggestion titles and types. It is rejected if it names a destination, a rupee amount, a percent, a price, inventory, an offer, more than four suggestions, or a kind or type outside the lists. The deterministic parser supplies the date. A missing key, a bad reply, or any model failure uses that same parser. The app still works.

The weekly summary path is unchanged: counts only, no titles.

## What was rejected

- Routing a new student through the week intro or seeding a timetable.
- Auto-creating every suggested line.
- Manufactured return copy such as "your trip is tomorrow" or "still open on Wednesday".
- Streaks, coins for opening, and fake urgency.
- Showing youth WAU +15% on the screen, or claiming it was achieved.
- A NeuPlan tab.
- Live prices, stock, and checkout.
- TypeScript 7. TypeScript 6.0.3 stays.

The onboarding route can still be opened directly. It is not the product path.

## What this prototype can record

Intent started, intent submitted, moment created, moment viewed, plan created, moment updated, moment resolved, commerce action, and whether intent parsing used the model or the fallback. Opening the screen is not a meaningful session. No rate is computed.
