# Test plan

## Informed choice rate

Eligible denominator: decision sessions in which `valid_card_reached` was recorded. A session is one in-memory id created when the person chooses "I'm about to change a SIP".

Numerator: those sessions that also have `reason_selected`, `calculation_viewed`, `choice_recorded`, and `comprehension_passed`.

Sample sessions (`sample_path_selected`) are not in the denominator.

The rate is null when the denominator is 0. It is not shown as a pilot result. The 7-of-10 and 10-of-50 planning rules are not displayed as outcomes.

Continuing, reducing, or pausing does not by itself count as success. A pause counts only when the comprehension check was passed.

## Calculator cases

Covered in `src/domain/sip-calculator.test.ts`: the ₹36,000 example, keep as ₹0, a six-month pause of ₹12,000 as ₹72,000, a reduction to ₹1, rejected zero, negative, blank, and non-numeric amounts, keep when the amounts match, rejected increases, months 1 and 24 accepted, 0 and 25 rejected, a product past `MAX_SAFE_INTEGER` returned as an exact digit string, amounts above ₹10,00,000 flagged for confirmation, and stable repeats.

Cancelling the high-amount confirmation is a component test: the figure is not rendered.

## Journeys

Component tests and Playwright cover Keep, Reduce, Pause, market worry, cash need, "I'm not sure", invalid input, back editing, the sample path, leaving early, refresh, a 390px viewport, and keyboard activation.

## Commands

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run e2e`

Record what actually ran in `docs/implementation-log.md`.
