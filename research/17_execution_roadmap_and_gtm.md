# 17 — Execution, roadmap, and experiments

No team size or fixed deadline was given. Phases are ordered, not calendar promises.

## Prioritization

Framework: MoSCoW for scope, with RICE assumptions shown so they can be challenged. Reach is FinLit-scale, not India-scale. Impact is on informed choice, 0.25 / 0.5 / 1 / 2 / 3. Confidence is a fraction. Effort is person-weeks for a small build of the prototype, not a broker integration.

| Item | MoSCoW | R | I | C | E | RICE | Note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Reason branch and three choices | Must | 200 | 2 | 0.7 | 2 | 140 | Core |
| Rupee arithmetic and "units unknown" | Must | 200 | 2 | 0.8 | 1 | 320 | Highest confidence |
| Sample mode label | Must | 200 | 1 | 0.9 | 0.5 | 360 | Prevents fake personalization |
| Skip does not redeem; restart month | Must | 200 | 2 | 0.7 | 1 | 280 | From the voice-of-customer gaps |
| Restatement check | Must | 200 | 1 | 0.6 | 1 | 120 | Makes the metric real |
| Groww rule quoted only with source | Should | 80 | 1 | 0.5 | 1 | 40 | Easy to get stale |
| Save restart reminder | Could | 50 | 0.5 | 0.4 | 2 | 5 | Needs notice and storage |
| LLM prose | Could | 200 | 0.5 | 0.4 | 3 | 13 | Template is enough for the prototype |
| Broker connect | Won't for now | — | — | — | — | — | No partner, no credential collection |
| Redemption tax engine | Won't for now | — | — | — | — | — | Data and advice risk |
| Fund recommendation | Won't | — | — | — | — | — | Out of bounds |
| Return forecast | Won't | — | — | — | — | — | Out of bounds |

RICE reach of 200 is the conservative monthly arrival assumption, not a fact.

## Roadmap

Gates and role-owners are in `22_scorecard_revision.md`. Short form:

1. **Spec.** Entry point, calculator, and evidence chain. Written. User evidence is not done.
2. **Counsel before any public pilot.** A written review. This folder is not that review.
3. **Prototype.** Six screens and calculator tests, including ₹12,000 to ₹6,000 over 6 months = ₹36,000 of contributions not invested, and the rejected inputs in `13`. Not built.
4. **Usability.** 8–10 sessions. Pass only if at least 7 of 10 restate the rupee line and the units line, and cash-need users can pause without hunting. Not run.
5. **Distribution.** The single FinLit page. Fail if fewer than 10 of the first 50 non-staff sessions are "about to change a SIP." Not run.
6. **Pilot decision.** Only if usability, distribution, and counsel all pass. Continuation rate is not the gate.
7. **Not scheduled:** redemption math, a broker embed.

## Experiments

| Test | Hypothesis | Method | Sample | Pass | Fail |
| --- | --- | --- | --- | --- | --- |
| Comprehension | After the card, most participants restate missed rupees and that units are not redeemed | Moderated task, two scenarios | 8–10 salaried SIP investors. Not a population estimate | At least 7 of 10 restate both facts in the fear scenario | Below 5 of 10 |
| Branch fit | Cash scenario still ends in an easy pause with a restart month | Same sessions, second task | Same people | At least 7 of 10 who say they need cash can pause without hunting | They describe pressure, or cannot find Pause |
| Usefulness | Participants say the card told them something the confirm screen does not | One question | Same | Majority name a specific line, not "it was nice" | They cannot name one |
| Trust | Participants can say what the card refused to do | One question | Same | Majority mention no forecast or no order | They think it told them what to buy |
| Behaviour | In the fear scenario, some people change from pause to reduce or keep after the card | Pre/post choice | Same | Report the count. Do not require a majority change | A change driven by shame copy |
| Commercial | A share ask for the review without being pushed | Optional link | Public month, if reached | Observe. No target until n > 100 completions | Paid clicks bought with fear headlines |

No p-values will be claimed on ten people.

## GTM, operational

See `14`. The first distribution piece is an article that answers "should I pause my SIP" and embeds the check. The article must include the cash-need case in the first screen of the story, not only the crash case. Otherwise acquisition selects for fear and biases the metric.
