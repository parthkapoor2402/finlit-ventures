# 19 — Bonus components and architecture

| Component | Customer value | Business value | Approach | Data | Risk | MVP |
| --- | --- | --- | --- | --- | --- | --- |
| A. Reasoning framework | The user sees a decision table, not a vibe | Debuggable | Reason × horizon → which paragraphs are allowed | User inputs | A hidden prompt that overrides the table | Include the table. No free-form reasoning |
| B. Explainable card | Every number has a source line | Trust | Blocks in `13` | Same | Fake precision | Include |
| C. Personalization | Only her amount and horizon | Avoids a generic essay | Substitution into templates | User-entered | Implies a portfolio feed that does not exist | Include substitution. Defer a profile |
| D. Guardrails | Pause stays available; cash branch differs | Avoids a retention scandal | Separate templates; checker | Choice events | Copy drift | Include |
| E. Compliance | She is not given an order | Firm survival | Banned phrases; counsel | n/a | Advice boundary | Include the limits. Defer registration strategy to counsel |
| F. Monetization | She is not charged to pause | A review she can opt into | Free card | Click event | Conflict if priced on continuation | Include the free card. Defer new prices |
| G. Architecture | A correct number | A testable core | Below | User inputs | LLM as calculator | Include the split. Defer the LLM |
| H. Instrumentation | The metric is real | Learning | Events in `15` | Events, not holdings | Over-collection | Include the event list. Defer a warehouse |

## Architecture

```text
Phone browser
    |
    v
Skip Check UI  ----  sample banner or empty form
    |
    v
Input validation
    |
    v
Deterministic calculator  ----  rupees, deltas, omitted fields
    |
    v
Rules table  ----  which paragraphs, which citations
    |
    v
Template renderer  ----  the card
    |
    optional, not in MVP
    v
LLM phraser  -->  output checker  -->  only if every number matches the JSON
    |
    v
Choice log (session only, unless a reminder consent exists)
    |
    v
Events: intent, card_shown, reason, choice, restatement, dismiss
```

Trust boundaries:

- The browser does not receive broker tokens. There is no broker.
- The calculator does not call a market API in the MVP.
- The phraser, if added later, cannot see credentials and cannot write numbers that are not in the JSON.
- Stored reminders, if added, are a separate store with a delete path.
- Staff analytics see aggregates and reason codes, not free-text stories, unless the user submits a bug report.

The prototype must be labeled as a demonstration with user-entered or sample figures. It is not a production advice system, not a market-data terminal, and not connected to a folio.
