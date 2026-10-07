# NeuPlan V2 audit

NeuPlan stays a hypothesis prototype. This audit is the reason for the redesign. It is not a claim that the new flow creates two or three weekly Tata Neu opens, and it is not a weekly-active-user result.

## A. Existing architecture

Next.js App Router, TypeScript strict, CSS modules. No Tailwind, Redux, or Zustand. A JSON file under `.data/` (or `NEUPLAN_DATA_DIR`) holds one demo user, week items, needs, one cached summary, and analytics events. Route handlers sit in front of `lib/repository.ts`. Gemini runs only on the server, sees counts, and falls back to text the app writes. The shell keeps Home, Categories, Scan & Pay, Offers, and NeuCard. NeuPlan is a link, not a tab.

## B. Existing user flow

Home shows a small row: “NeuPlan / Your week. Planned around what matters. / Open”. The first visit goes straight into three setup questions, then “Your week is clear.” and seven days. Adding something uses native selects, including a field labelled “Demo Tata stop”. A buy need offers Croma, Westside, and BigBasket no matter what the title says. A summary is a separate tab.

## C. Existing UX problems

- The Home entry does not say what NeuPlan does, why it is inside Tata Neu, or what the person gets.
- The first screen after setup is an empty week. That reads as a calendar.
- Setup asks the person to define the week before showing an example.
- “Needs / Hold something until you deal with it” does not say what to do.
- “Add something” and “Demo Tata stop” are builder language.
- Time uses a native control that does not match the rest of the screen.
- Commerce is a list of brands, not a consequence of the need. A notebook can be sent to Croma. Food can be pointed at the wrong stop.
- An assignment and a charger are treated as the same kind of object.
- There is no “what changed” state, so a second visit has nothing new to show unless the person hunts.
- The +15% line is present, which is correct, but the product around it does not explain itself.

## D. Existing technical problems

- Tata destination is chosen in the form, not by a mapping function. The rule lives in the component.
- Need state is only open or resolved, so “looking at Croma” cannot be told apart from “done”.
- Needs have no day, so they cannot sit on the week.
- Store version 1 has no notices and no free-text note.
- Analytics names cover opens and completions, not discovery, intro, commerce intent, or a return.

## E. Existing design problems

- The NeuPlan row uses the same weight as a text link. It does not separate from Top Offers.
- Hierarchy inside NeuPlan is a repeated title, a purple demo banner, and a form.
- Native selects and a native time field break the Tata Neu surface.
- Seven empty day rows create a dead column of “Clear”.
- Section nav (Week, Needs, Summary, Activity) is the product. The job is not.

## F. What will be retained

- The Tata Neu shell and the five-tab bar.
- One NeuPlan entry on Home and one on Categories.
- The JSON repository, route handlers, and demo-only catalogue flags (`isLive: false`, `demoOnly: true`).
- Gemini counts-only, server-side, with the deterministic fallback.
- Ananya as labelled demo data. No college, roommates, spend, or city.
- The hypothesis line: youth WAU +15% is a target, not a result.
- Scan & Pay does not move money.

## G. What will be redesigned

- Home entry: dark border, NeuPlan mark, “New”, a value line, and “Open NeuPlan”.
- First open: a short intro, then an example week, then a setup under a minute.
- Setup: what matters, an optional note, where they stay. No seven-day timetable.
- After setup: a seeded week from those choices, labelled as set up from the picks.
- Main screen: what needs attention, a Tata help block only where a mapping exists, the week as a supporting list, and what changed.
- Add a need: type chips, title, when, optional time of day. No native time field. No brand picker.
- Need detail: track it, or explore a demo Tata stop when the title actually fits.
- Demo stop: demo products and “₹—”. No invented price.

## H. Why each change is required

| Change | Why |
| --- | --- |
| Stronger Home entry | A person cannot use a feature they cannot identify. |
| Intro before an empty grid | The product was being understood as a calendar. |
| Example before effort | An empty state asks for work before it shows value. |
| Seeded week | The first success should be recognition, not data entry. |
| Needs as the core | The week changes when something is still open, not when a day row exists. |
| Deterministic Tata mapping | Commerce has to follow the need. An assignment must not become a shop. |
| Exploring state | The path engagement → intent → demo destination has to be visible. |
| What changed | A later visit needs a reason that came from state, not from a streak or a coin. |
| ₹— on demo products | A price that was not sourced would be a fake offer. |
