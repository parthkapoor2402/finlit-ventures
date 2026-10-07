# Product decisions

NeuPlan is a hypothesis for qualitative testing. The strategy note `tata-neu-weekly-job-strategy.md` recommends not building a weekly-open feature. This prototype does not claim that recommendation was wrong. It exists so a person can react to one concrete shape. It does not claim product-market fit, habit formation, or a change in youth weekly active users.

Youth WAU +15% is labelled on screen as a target. Status: not measured. Not achieved.

## Why the nav stays

The Tata Neu bottom nav is Home, Categories, Scan & Pay, Offers, and NeuCard. Replacing any of those with NeuPlan would pretend the hypothesis is already a primary destination. Entry is one row on Home and one row in Categories. When the path is under `/neuplan`, no shell tab is current, because NeuPlan is not one of those destinations.

## Demo versus live

The shell repeats commercial lines that were visible in the reference screenshots: NeuPass, NeuCard, Croma's "3 hour delivery", the Spotify and iPhone offer lines, and the NeuCard issuer sheet. Those lines are attributed on Offers and NeuCard. They are not priced further, not personalised, and not connected to checkout.

Inside NeuPlan, a Tata stop is chosen from a closed list: Croma, Westside, BigBasket, Tata 1mg, Travel, IHCL, Neu UPI. Every entry has `isLive: false` and `demoOnly: true`. A need type can only resolve to a stop the list allows, or to no stop. Remember cannot be pointed at Croma. The demo page says nothing is for sale, in stock, or bookable.

Ananya is DEMO DATA. The record has a display name and, after onboarding, a living situation the person picked. It does not have a college, a roommate, a spend, or a city.

## Gemini boundary

The model sees `WeeklyCounts` only: living situation, selected week shapes, help focuses, and counts of items and needs. It does not see titles. The prompt forbids new events, products, prices, inventory, discounts, colleges, roommates, history, and financial advice.

The reply is rejected if it is empty, longer than 600 characters, contains a rupee sign, a percent, or words such as discount, price, stock, coin, or streak, or contains a number that is not already in the counts. Rejection, a missing key, a missing model, a timeout, or a thrown request all return the same deterministic paragraph. That paragraph says the app wrote it from the counts.

The model name comes from `GEMINI_MODEL`. It is not in source. The key is not in the client bundle and is not written to logs by this app.

The summary is cached by a hash of the counts. An unchanged week does not call the model again.

## What was rejected

- A NeuPlan tab, and the names Neu Daily, Feed, Club, Student, Circle, Social, Rewards, Streak, and Hub.
- Streaks, coins for opening, push copy, fake urgency, scarcity, and gamification.
- Seeded classes, meals, roommates, or a college timetable. An empty week says "Your week is clear."
- Live prices, stock, "because you love electronics," and invented recommendations.
- Tailwind, Redux, and Zustand. The repo on `main` had no styling system. CSS modules were enough.
- TypeScript 7. `typescript-eslint` could not parse it. TypeScript 6.0.3 stays in strict mode.
- A payments implementation. Scan & Pay and the quick actions say they are not connected.

## Panel questions

**GPM. Why would someone open this?** The only honest first open is "I want to look at the week I just described." A second open exists only if something they typed is still unresolved. A third open is not designed and is not promised. The strategy note already says the jobs that recur belong to the mess, the timetable, Swiggy, Zomato, Google Pay, and WhatsApp. This prototype does not create a reason those opens move to Tata Neu.

**UX. What is unnecessary?** The optional demo Tata stop on a week item is the first thing to cut if people treat it as a shop. Onboarding is three questions because the prototype must not invent a hostel or a timetable. The shell's "not connected" dialogs are there so a tap does not look like a payment.

**Eng. What breaks?** The JSON file is one demo user in one Node process. Two people writing at once can overwrite each other. The week boundary is `Asia/Kolkata` even if the laptop is not. Gemini can still write a bland sentence that passes the filter and sounds more certain than the counts. There is no login. Deleting `.data/` wipes the prototype.

**Data. What is measurable?** The events in the activity list: open, onboarding complete, week viewed, item created, item completed, need created, need resolved, demo stop clicked, demo stop viewed, summary generated, summary fallback, and one `session_meaningful` flag per browser tab after a real action. None of these is youth WAU. No percentage is computed.

**Tata. What is Tata's to own?** The brands on the demo list are Tata or Tata Neu destinations. The week itself is not. A class, a meal, a chat, and a UPI payment already have owners. The prototype does not fulfil an order, so it does not exercise the loyalty moat the strategy describes, which shows up at checkout.

**Gen Z. Why not WhatsApp, Calendar, Amazon, Swiggy, or Google Pay?** NeuPlan is not those products and does not argue that a student will leave them. Calendar already holds a timetable. WhatsApp already holds the circle. Swiggy already holds the meal. Google Pay already holds the campus payment in the only student sample the strategy cites. Amazon already holds a product search. NeuPlan does not read any of them.

**Security. Can a secret leak?** `GEMINI_API_KEY` is read in server code only. It is not a `NEXT_PUBLIC_` variable. A search of `.next/static` after the production build found no `GEMINI_API_KEY`. The log test uses a fake key and asserts that key is not passed to `console`. `.env` is gitignored. Scan & Pay does not collect a card or a UPI pin. Item titles are not sent to Gemini.

**Design. Where is the AI slop?** Gradient wordmarks, glass, neon, empty picture blocks, a repeated category icon, metric tiles, and a fake user count were rejected. Offer tiles are type, because this prototype does not have the photographs. The finance tile is sparse for the same reason. The week is a list of days, not a stack of cards. The remaining risk is that the add form is long. It is a form because the prototype must not invent the week.
