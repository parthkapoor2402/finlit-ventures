# NeuPlan V3 — product discovery

This is a hypothesis. It is not a validated habit, not product-market fit, and not a weekly-active-user result. The case target of youth WAU +15% is a requirement in the brief. It is not shown on the product screen, and it is not claimed as achieved.

## 1. Problem

College students open Tata Neu for a considered purchase and then leave. The case asks for two or three meaningful opens in an ordinary week without requiring a purchase. Public evidence does not show a weekly Tata Neu job. The jobs that do recur — class, food, UPI, chat — already have owners.

## 2. Existing behavior

Tata Neu’s public shell is a mall: search, payments, NeuPass, NeuCard, finance, Croma, hotels, categories, offers. NeuPlan was added as one Home row and one Categories row. It is not a tab.

## 3. Current prototype failure

V2 still starts from a week. Setup asks what the week includes, then seeds Classes and Assignment due. A student whose charger died today does not want a timetable. The day list keeps the calendar metaphor. “What changed” only changes when the student edits NeuPlan, so the return loop is “maintain the list you just created.”

The research file `tata-neu-weekly-job-strategy.md` already scored five mechanisms and recommended not building. That conclusion is evidence. It is not a ban on testing a narrower entry. It does ban claiming that any of those mechanisms produces two or three weekly Tata Neu opens.

## 4. Student jobs

From that note, with the same limits:

- Teaching-day travel is owned by the student’s own commute. College-only weekly counts are `TBD — REQUIRES PRIMARY RESEARCH`.
- Meals, for students living away who already use food apps, recur. Swiggy and Zomato own the cited samples. A meal is a purchase.
- Campus UPI recurs in one Mangaluru sample of existing UPI users. Google Pay owns it. Neu does not see those payments.
- Chat is WhatsApp and Instagram.
- Assignments are lumpy. Exam weeks are spikes.
- A broken thing or a trip is real and episodic. Tata can sometimes finish it. A quiet week has none.

## 5. Competitor substitutes

| Job | Substitute | Why a student stays there |
| --- | --- | --- |
| Timetable | College calendar | It is already the week |
| Reminder | Phone, WhatsApp | The item is already written |
| Meal | Swiggy, Zomato, mess | Hunger is solved there |
| Small payment | Google Pay, PhonePe | The money already moves there |
| Charger or gift | Amazon, Croma’s own app, a shop | Search is faster than a plan |
| Trip | The airline or a travel app | The ticket is the job |

## 6. Tata right-to-win

Verified from public product surfaces and the research note, not from an assumed API:

| Stop | Status |
| --- | --- |
| Croma | On Neu. Electronics. No live stock in this prototype. |
| Westside | On Neu. Fashion. Zudio is not on Neu. |
| BigBasket / bbnow | Tata Digital. Grocery. Student order rate on this brand is unknown. |
| Tata 1mg | Pharmacy. Student refill rate is unknown. |
| Air India | Travel brand on Neu. NeuCoin redemption on Air India is excluded in HDFC Tata Neu card terms. No fare in this prototype. |
| IHCL | Hotels. No rate in this prototype. |
| Neu UPI | Exists. Not preferred in the only student UPI sample cited. This prototype does not move money. |
| Cult / fitness | A card-partner brand. Booking inside Neu versus the Cult app is unknown. Not used as a resolution. |
| Qmin | Named on the public Neu site. Not used as a student meal app. |

The right to win is a rupee at checkout on an eligible brand, plus a store or catalogue when the student is already buying. It is not a weekly object.

## 7. Five concepts

1. **Intent to action.** The student states what is happening, in a tap or a sentence. NeuPlan proposes a few lines. The student keeps only the ones they want. Tata is offered only when a kept line fits a verified stop.
2. **Open need only.** Same as a charger, with no moment around it. One field. One resolution or none.
3. **Week command center.** The current prototype. Setup, then a seeded week.
4. **Hunger Door.** The meal, inside Neu.
5. **Visible Rupee.** A weekly money view inside Neu.

NeuRoom, NeuSlip, streaks, and coins for opening are not in this set.

## 8. Scoring

Each score is 0–10. The sum is out of 160. Equal weights are a reading aid. They are not the research model, and a high sum is not permission to claim weekly active use.

| Criterion | Intent to action | Open need only | Week command center | Hunger Door | Visible Rupee |
| --- | ---: | ---: | ---: | ---: | ---: |
| Recurring need | 3 | 2 | 2 | 8 | 4 |
| First-open value | 8 | 8 | 3 | 8 | 5 |
| Second-open value | 5 | 5 | 3 | 7 | 3 |
| Third-open value | 2 | 1 | 1 | 7 | 2 |
| No-setup value | 8 | 9 | 1 | 8 | 4 |
| Intrinsic value | 7 | 7 | 4 | 8 | 4 |
| Tata right-to-win | 5 | 6 | 4 | 2 | 3 |
| Differentiation | 4 | 3 | 2 | 1 | 3 |
| Cross-category value | 4 | 2 | 3 | 2 | 2 |
| Commerce potential | 5 | 5 | 4 | 6 | 2 |
| Non-commerce engagement | 6 | 5 | 5 | 1 | 6 |
| Network / social | 1 | 1 | 1 | 2 | 1 |
| Feasibility | 7 | 8 | 7 | 2 | 3 |
| Data advantage | 2 | 2 | 2 | 1 | 2 |
| Trust | 6 | 7 | 5 | 3 | 4 |
| Habit potential | 3 | 2 | 2 | 6 | 3 |
| **Sum** | **76** | **73** | **49** | **72** | **51** |

Why the low third-open scores: a second look is “the thing I confirmed is still unfinished.” A third look needs another real thing. Nothing in the public evidence says an ordinary college week contains three Tata-resolvable moments. Hunger Door’s third open is another meal, in someone else’s app.

## 9. Chosen mechanism

**Intent to action, constrained.**

The leading sentence in the brief — “Tell us what’s happening. We’ll line up what you need.” — survives as the entry, because it removes the timetable. It does not survive as an automatic life planner.

What was rejected inside that hypothesis:

- Auto-creating every suggested line. The student checks the lines.
- A Wednesday “still open” prompt and a Thursday “your trip is tomorrow” prompt. Those are manufactured return visits. The date the student set can be shown on the card. It is not a notification and it is not a fake change.
- Mapping fitness to Cult, or dinner to Qmin. Those capabilities are not verified as in-app resolutions.
- Showing youth WAU +15% on the screen.

Open-need-only is almost as strong and is the charger path inside this mechanism. Hunger Door scores close on the equal-weight sum and wins on frequency. It fails Tata’s right to win. It is not built.

## 10. Why the others lose

- **Week command center:** the student pays a setup cost before any true need. Seeded classes are props.
- **Hunger Door:** the meal is real and already owned. Building it in Neu is a second food app.
- **Visible Rupee:** the payments that would change the number are not in Neu.
- **Open need only:** kept as the shape of a single-line moment, not as a separate product.

## 11. Proposition

NeuPlan. “Tell us what’s happening. We’ll line up what you need.”

The student states a moment or a sentence. NeuPlan offers a few actions. The student keeps some. Tata Neu is offered only on a kept action it can actually speak for. If it cannot, the action stays a reminder with no shop.

## 12. Job to be done

When something is already happening — a broken charger, a trip home, people coming, exams — help me see the few things I might do next, and take me to a Tata stop only if that stop fits. Do not ask me to describe my week first.

## 13. How might we

How might we turn one sentence into a short list the student can accept or refuse, without inventing a timetable, a price, or a reason to come back tomorrow?

## 14. User journey

Home → NeuPlan → “What are you up to?” → a chip or a sentence → suggested lines, unchecked except when there is only one obvious line → student confirms → the moment and the kept lines exist → a line can open a demo Tata stop or be marked done → later, NeuPlan opens on those lines. This week is a secondary list of the lines that have dates. It is not setup.

## 15. Second and third open

Second open: a kept line is still open, or it was marked exploring and not finished. That is the student’s own unfinished action.

Third open: only if another moment or line exists. Not designed. Not promised. A week with nothing unfinished shows “Nothing is waiting on you.”

## 16. Commerce bridge

Replace charger → Croma, because the title is an electronic replacement.

Travel home → Air India, because the line is travel.

Groceries → BigBasket, only if that line was kept.

Gift → Westside, only if that line was kept.

Medicine → Tata 1mg, only if the title is a health item.

Exam study, pack, “call home,” and a vague “buy something” → no stop.

Demo pages stay `isLive: false` and `demoOnly: true`. Price is ₹—. Nothing is sold.

## 17. Risks

- Students still will not leave Google, WhatsApp, Swiggy, or the Croma app for a plan wrapped around a search.
- A multi-line moment can feel like the timetable again if too many lines appear.
- Keyword parsing will misread a sentence. The student must be able to refuse every line.
- A polished demo can be mistaken for evidence. The strategy note still says no concept has cleared two or three weekly opens.
- Gemini can phrase a structure. It must not add products, prices, or stops. The deterministic rule remains the only resolution.

## 18. Experiments

Not run. Designed only.

- A: old week setup versus this intent entry. Measure who confirms one real line.
- B: blank sentence versus chips. Measure who submits.
- C: Tata stop shown versus hidden, on lines that fit. Measure clicks, not sales.
- D: return visit when a line is still open versus a static empty week.

No result is available. Do not fill one in.

## 19. Metrics

Case target, not on screen and not achieved: youth WAU +15% versus control. Baseline is `TBD — REQUIRES TATA INTERNAL DATA`.

Prototype events record intent submitted, moment created, line kept, resolution shown, resolution clicked, and a session that included one of those actions. Opening the screen is not a meaningful session. No rate is computed in the product.
