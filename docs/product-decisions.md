# Product decisions

Decisions made while building the prototype, where the brief allowed more than one reading.

| Decision | Choice | Why |
| --- | --- | --- |
| Stack | Vite, React 19, TypeScript strict, Tailwind 4 | The repository had no app. This is the brief's default. |
| Where the formula lives | `src/domain/sip-calculator.ts` only | Screens were already drifting toward copies of the arithmetic. |
| Number type | Digit strings and `BigInt` | A JavaScript number would round values past `MAX_SAFE_INTEGER`. The brief says not to overflow silently. |
| Blank versus zero | Blank is an error. Zero is a real proposed amount and means a pause preview. | Coercing an empty field to 0 would show a pause the person did not enter. |
| Above ₹10,00,000 | Greater than 10,00,000, not equal | The brief says "above". |
| Entry doors | Same visual weight | A louder "change a SIP" door would push people into the decision path. |
| Keep, Reduce, Pause | Same size, border, and type. The selected one gets the same forest outline whichever it is. | The brief forbids making Keep easier. |
| Impact before choice | The input step collects a proposed amount and an optional remaining contribution target. The plan step translates that preview. The choice step recomputes from Keep, Reduce, or Pause, and the decision card uses that later figure. | The choice has to be allowed to change the figure. The rupee product is not the climax. |
| Restart month | Optional, after Reduce or Pause. It stays on the decision card for the session. Copy says nothing will restart the SIP. | A required month reads like an instruction to the AMC. |
| "I'm not sure" | Contribution line and units line only. No extra market sentence. | The brief says not to infer a recommendation. |
| Sample path | Opens on the comparison for ₹12,000 to ₹6,000 over 6 months, with a persistent banner. Back reaches the same inputs. Excluded from the informed-choice denominator. | The worked example has to be visible immediately, and it must not look like Ananya's real session or count as one. |
| Persona | Named on the sample banner as an illustration that has not been interviewed. | The brief says not to present Ananya as evidence. |
| Platform rules | Not shown | Help-center cutoffs conflicted across articles. Inventing one would be a false financial rule. |
| Payments | A footer line that an optional review starts at ₹99. No checkout. | The price is the published list price. Taking payment is out of scope. |
| Registration | Footer states FinLit says it is not registered with SEBI or AMFI, and that a compliance review of this prototype has not happened. | The brief forbids inventing an approval. |
| Analytics | In-memory events, no amounts, cleared on refresh | A third-party tracker would export financial inputs. |
| Extra event | `inputs_rejected` | The brief asks for a calculator error rate, which the named event list does not cover. |
| Pressure and usefulness | Two yes/no questions on the recap, not required | They are guardrail and support metrics. Free text is not stored. |
| Gemini | Not integrated | The brief forbids it for this MVP. |
| Persistence | None | Refresh must not restore amounts. |
| Distribution and usability gates | Not displayed as achieved | They are planning rules. The metrics panel shows only what this browser session actually did. |
