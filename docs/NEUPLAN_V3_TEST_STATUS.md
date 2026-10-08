# NeuPlan V3 test status

Recorded after the intent-first implementation. These are command results, not a claim that youth WAU moved.

## npm test

```
> neuplan@0.1.0 test
> vitest run

 RUN  v5.0.3 /workspace

 Test Files  24 passed (24)
      Tests  69 passed (69)
```

Exit code 0.

## npm run typecheck

```
> neuplan@0.1.0 typecheck
> tsc --noEmit
```

Exit code 0.

## npm run lint

```
> neuplan@0.1.0 lint
> eslint .
```

Exit code 0.

## npm run build

```
> neuplan@0.1.0 build
> next build

▲ Next.js 16.4.0 (Turbopack)
✓ Compiled successfully
✓ Generating static pages using 3 workers (29/29)
```

Exit code 0. The production build includes `/neuplan`, `/neuplan/new`, `/api/ai/intent`, and `/api/moments`.

## npm run e2e

The first attempt in the same shell as the build failed before any test ran: `http://127.0.0.1:4180 is already used`. The listener was a leftover `next-server` that had already exited into `TIME_WAIT`. After that socket cleared, Playwright was run again:

```
> neuplan@0.1.0 e2e
> playwright test

Running 9 tests using 1 worker
  ✓  1 tests/e2e/neuplan.spec.ts:30:5 › home entry, viewports, and no week setup (1.8s)
  ✓  2 tests/e2e/neuplan.spec.ts:74:5 › flow A charger resolves to Croma without a calendar (1.3s)
  ✓  3 tests/e2e/neuplan.spec.ts:102:5 › flow B going home keeps travel only when that line is selected (716ms)
  ✓  4 tests/e2e/neuplan.spec.ts:124:5 › flow C friends coming does not force a shop (623ms)
  ✓  5 tests/e2e/neuplan.spec.ts:142:5 › flow D exam week does not force commerce (629ms)
  ✓  6 tests/e2e/neuplan.spec.ts:162:5 › flow E exploring and done come from real actions (709ms)
  ✓  7 tests/e2e/neuplan.spec.ts:183:5 › flow F fallback still creates a plan (395ms)
  ✓  8 tests/e2e/neuplan.spec.ts:199:5 › flow G refresh keeps the plan (331ms)
  ✓  9 tests/e2e/neuplan.spec.ts:209:5 › flow H back button returns to the open list (467ms)

  9 passed (8.2s)
```

Exit code 0. Viewports covered in that file: 360, 390, 414, and 1440. Axe ran on Home, the intent screen, the open list, and the charger need. No `GEMINI_API_KEY` was present, so flows A and F recorded `source: "fallback"`.

An earlier Playwright run in this same session failed one assertion (`getByText('Weekend')` matched the chip, the field, and the moment title). The locator was narrowed and the run above passed. That failure is not the final result.
