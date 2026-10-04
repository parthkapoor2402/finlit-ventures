# 14 — Business model and GTM

Evidence of willingness to pay for Skip Check specifically: none. FinLit publishes session prices. That is the only commercial fact used here.

## Models considered

| Model | Who pays | Value paid for | When value appears | Conflict | Trust | Fit |
| --- | --- | --- | --- | --- | --- | --- |
| Free check, paid review | User pays for a later human or structured review | Time and a broader portfolio conversation | After the decision, if they want it | Low, if the review is not paid by an AMC | High | Matches ₹99–₹2,499 list prices |
| Subscription for the check itself | User | Repeated use | At a second decision | Low | Medium. A SIP decision is rare for one person, so a subscription is a weak match | Poor as the only model |
| Trail or distribution | AMC or platform | Assets that stay | When the SIP continues | High. The product would be paid to prevent pauses | Poor | Incompatible with the footer claim of no AMFI registration, and with the requirement that a pause can be the right answer |
| B2B embed | A platform | Fewer confused tickets, or a compliance-safe confirm | At their skip screen | Depends on the contract. Must not pay FinLit per continued SIP | Medium if the host is the regulated entity | Real upside, no current partner |
| Lead-gen to a registered adviser | Adviser | Referrals | After a complex case | Medium. Referral fees need disclosure | Medium | Only after FinLit is not itself giving the advice |

## Recommendation

**Free Skip Check. Optional paid FinLit review initiated by the user, at the published session prices. No trail. No per-continuation fee.**

Reason: the trust requirement is that FinLit is not paid when the user continues. The company's own prices already support a user-paid conversation. A platform embed is the scale path and is not assumed.

## Unit-economics frame

All rates below are empty or assumed. Do not read them as forecasts.

| Driver | Status |
| --- | --- |
| Addressable decision events | ~50 lakh mixed stop/completion events in a recent month. Not the funnel |
| Reachable users | Unknown. Scenario in `07`: 200 / 1,000 / 5,000 article-or-review arrivals a month |
| Activation (start the check) | Unmeasured. Scenario 20 / 35 / 50% |
| Meaningful use (finish a choice and can restate the math) | Unmeasured. Target comes from the usability test, not from a goal plucked out of the air |
| Conversion to paid review | Unmeasured. Scenario 2 / 5 / 10% |
| Revenue per paying user | List price ₹99 first session up to ₹2,499 a year. Mix unknown |
| Retention | Unknown. The natural repeat is the next time they consider a change, which may be months later |
| Market data cost | Zero in the MVP if numbers are user-entered |
| Model inference cost | Near zero if the card is a template. An LLM explanation is an optional cost to cap per session |
| Support and compliance | A legal read of the copy before public launch. Cost unknown |
| Contribution | Cannot be signed until conversion is observed |

## Commercial line, so it cannot be missed

| Item | Decision |
| --- | --- |
| Payer | The user, only if they ask for a review |
| Free | Skip Check |
| Price | Existing list prices, first session ₹99 through ₹2,499 a year. No new price for the card |
| Not sold | Trail, affiliate, or any fee that depends on the SIP continuing |
| Conflict control | Equal choices. Continuation is not the north star. No fund link on the card |

## GTM hypothesis

- **The one channel under test:** a FinLit page the person opens, with two doors: "I am about to change a SIP in my own app" and "I am only reading." The card runs only after the first door. A broker embed is not this test.
- **Segment:** salaried SIP investors who search the pause question. Urban participation is higher in the SEBI survey. That is context, not proof they will open this page.
- **Proposition:** "Before you confirm a skip, see the contributions that would not be invested, and whether your reason is cash or the market. You can still pause."
- **Planning rule, not a result:** in the first 50 non-staff sessions, fewer than 10 choices of "about to change a SIP" means this channel failed. See `22_scorecard_revision.md`.
- **Activation:** article ends in Skip Check, sample pre-filled, personal numbers optional.
- **Trust:** repeat the unregistered status in plain language; no fund affiliate links on the card.
- **Onboarding:** no account required to see a sample. An account only if they save a restart reminder.
- **Retention:** email only if they ask to be reminded of a restart month.
- **Partnership:** do not pitch a broker until the card's comprehension test passes and counsel has reviewed the copy.
- **Experiment:** usability protocol in `17`, then the two-door page. Completions on that page are a sample of arrivals, not of India. The 10-of-50 rule is a planning gate, not a result.
