# NeuPlan V3 user flow

Hypothesis. Not a measured habit.

## First open

Home shows one NeuPlan block: “Tell us what’s happening. We’ll line up what you need.” It is not in the bottom nav.

NeuPlan opens on “What are you up to?” There is no week, no Monday row, and no living-situation question.

## Intent entry

Chips fill a sentence the student can edit:

- Going somewhere → “Going home this weekend”
- Something to buy → the student names the thing
- Something to fix → “My charger stopped working”
- Exam week → “My exams start Monday”
- Friends coming → “Friends are coming Saturday”
- Weekend plan → “Planning the weekend”
- Birthday → “I need a birthday gift”
- Something else → their own words

“See how it works” is three lines: Tell us, Choose what to keep, Get it done if Tata fits. It does not install a sample week.

## Moment creation

The parser returns a title, a kind, a date only when the sentence names one, and up to four suggested lines. A single obvious line, such as a charger, starts checked. Several lines start unchecked. Nothing is saved until the student confirms at least one line.

## Need creation

Each kept line becomes one need on that moment. The need has a type and, when we could read a day, a date. Time is not asked.

## Tata resolution

On the need, the resolution engine either names one demo stop or says Tata Neu cannot finish this. The student can explore the demo or mark the need done without a shop.

## Commerce exploration

The demo page lists a demo product and ₹—. “View on Croma” (or the other brand) states that this would open that brand and that nothing is for sale. The need becomes Exploring. Returning shows that status.

## Return session

The next open shows the same open needs. “What changed” lists only actions the student took: a line added, a stop explored, a line marked done. A nearer date is written on the card if they set a date. It is not pushed, and it is not called a change.

## Moment completion

When every kept line is resolved, the moment is read as done. The list no longer calls it waiting.

## Empty state

“Nothing is waiting on you.” Add something. No seeded class.

## AI failure

Intent parsing runs through the server. Missing key, timeout, bad JSON, or a reply that names a price uses the same local parser. The student still sees suggestions.

## No Tata resolution

Study, pack, remember, and any line the engine does not recognise get no brand and no catalogue.
