# NeuPlan architecture

NeuPlan is a qualitative prototype inside a Tata Neu-like shell. The strategy note `tata-neu-weekly-job-strategy.md` concludes that no concept can credibly create two or three meaningful Tata Neu opens in an ordinary college week. This repository does not overturn that conclusion. NeuPlan is a hypothesis a team can put in front of a person. It is not a validated habit, not a weekly-active-user result, and not a claim of product-market fit.

Working name: NeuPlan. Descriptor: "Your week. Planned around what matters."

The names Neu Daily, Neu Feed, Neu Club, Neu Student, Neu Circle, Neu Social, Neu Rewards, Neu Streak, and Neu Hub are not used.

## Why this stack

`main` contains only `README.md`. There is no application, no design-token package, and no styling system to extend. The FinLit Vite app lives on other branches and is a different product. Replacing it, or folding NeuPlan into it, would mix two briefs.

This branch uses Next.js (App Router) and TypeScript in strict mode, with CSS modules. That gives server-side route handlers for the week API and for Gemini, a file-based mock repository, and a client UI. Tailwind, Redux, and Zustand are not added. Server state lives in the repository. Screen state lives in React components. There is no global client store.

Dependencies are listed in `package.json` and explained in `docs/TOOLS_USED.md` and the README. Every runtime dependency is there because the brief names it (React via Next.js, the official Google GenAI SDK) or because the app cannot be tested without it.

## Product architecture

Two layers share one phone canvas and the Tata Neu bottom navigation.

1. **Shell.** Home, Categories, Scan & Pay, Offers, NeuCard. This is the container a Tata Digital stakeholder already knows. Scan & Pay does not move money. Offers and NeuCard repeat commercial lines transcribed from the reference screenshots. They are not a live catalogue, not personalised, and not priced by this prototype beyond the words visible in those screenshots.
2. **NeuPlan.** A sub-feature opened from one Home row and one Categories row. It holds onboarding, the week, needs, demo Tata stops, a weekly summary, and an activity list.

The bottom navigation is not replaced. NeuPlan is not a fifth tab. When the path is under `/neuplan`, no shell tab is marked current, because NeuPlan is not one of those destinations.

Primary person: a college student. The only persona in the prototype is Ananya, living in a hostel, labelled DEMO DATA on screen. The record does not contain a college, a roommate, a spend figure, a balance, or a city.

### What NeuPlan is allowed to do

- Show the current week as seven days with counts and items the person typed.
- Hold a need until the person marks it resolved or removes it.
- Point at a closed demo list of Tata stops (Croma, Westside, BigBasket, Tata 1mg, Travel, IHCL, Neu UPI). Every stop has `isLive: false` and `demoOnly: true`.
- Summarise counts the app already stored, either with Gemini or with a deterministic fallback.

### What it refuses

Streaks, coins for opening, push copy, fake urgency, scarcity, gamification, invented prices, invented stock, "because you love electronics," and any sentence that says youth weekly active users rose. The case bar, youth WAU +15%, is labelled Target / hypothesis. The prototype does not compute a percentage.

## Frontend

Mobile first. The app column is `min(100%, 430px)`, centred on a neutral field. Desktop does not stretch the phone UI into a dashboard.

Routes:

| Path | Role |
| --- | --- |
| `/` | Home, including the single NeuPlan entry |
| `/categories` | Category grid and one NeuPlan row |
| `/scan` | Scan & Pay placeholder |
| `/offers` | Reference offer creative |
| `/neucard` | NeuCard issuer sheet |
| `/neuplan` | Week, after onboarding |
| `/neuplan/onboarding` | Three short steps |
| `/neuplan/needs` | Needs |
| `/neuplan/summary` | Weekly summary |
| `/neuplan/activity` | This prototype's own events |
| `/neuplan/demo/[destination]` | One demo Tata stop |

NeuPlan sections use a text tab list under the NeuPlan header. The shell bottom nav stays mounted.

Rendering:

- Server layout sets the document, the skip link, and the phone column.
- Shell and NeuPlan screens are client components because they read the path, forms, and the API.
- Route handlers stay on the server. The GenAI SDK is imported only from `lib/ai/gemini.ts`, which is imported only from the summary route.

Design tokens live in `app/globals.css` before any component treats colour as a one-off. Components use CSS modules that reference those tokens. Token groups: color, type, space, radius, shadow, border, motion.

Sampled from the Home screenshot (approximate cluster centres, not a brand guideline PDF):

- Active nav purple `#8800EC` (rgb 136, 0, 236). Contrast against white is about 6.45:1, so it can sit on labels.
- Scan control `#444148`.
- Page field near white. Cards `#f4f7fb` with white text on top. Icon tiles use a light purple wash and a purple glyph.
- Type is black `#1a1a1a` on near-white. Secondary text `#5c5c66`.

Motion runs only for a sheet, an undo bar, and a completed-row state change. `prefers-reduced-motion: reduce` removes those transitions.

Accessibility: one `h1` per view, labelled inputs, visible `:focus-visible`, 44px targets, semantic buttons and links, `aria-busy` skeletons instead of the word "Loading...", and error copy with a Try again control.

## Backend

Next.js route handlers are the API. There is no second server and no database.

`lib/repository.ts` is the only module that reads and writes the JSON file. Components never import the seed object to render a week. They call `fetch`.

The file path is `NEUPLAN_DATA_DIR` or `.data/` under the project. `.data/` is gitignored. Tests set `NEUPLAN_DATA_DIR` to a temporary directory. The store is one demo user. It is not an account system and it is not safe for concurrent strangers. A write queue keeps a single Node process from interleaving JSON writes.

Clock: the week is Monday–Sunday in `Asia/Kolkata`. India has no daylight-saving shift. The zone is an assumption about the product's country, not a detected city. The assumption is written in the README.

## Data model

Typed in `lib/types.ts`.

```ts
type WeekShape =
  | "classes"
  | "food"
  | "shopping"
  | "travel"
  | "fitness"
  | "events"
  | "study"
  | "personal";

type LivingSituation = "with_family" | "hostel" | "pg" | "shared_apartment";

type HelpFocus = "see_the_week" | "hold_a_need" | "see_a_tata_stop";

interface User {
  id: "demo-ananya";
  displayName: "Ananya";
  isDemo: true;
  demoLabel: "DEMO DATA";
  livingSituation: LivingSituation | null;
  weekShapes: WeekShape[];
  helpWith: HelpFocus[];
  onboardingComplete: boolean;
  onboardingCompletedAt: string | null;
}

interface Week {
  id: string; // week-<startsOn>
  startsOn: string; // YYYY-MM-DD Monday
  endsOn: string;
  timeZone: "Asia/Kolkata";
  items: WeekItem[];
}

type WeekItemState = "planned" | "done";

interface WeekItem {
  id: string;
  type: WeekShape;
  title: string;
  day: string; // inside the current week
  time: string | null; // HH:MM
  state: WeekItemState;
  tataDestination: TataDestination | null;
  createdAt: string;
  updatedAt: string;
}

type NeedType = "buy" | "book" | "prepare" | "remember" | "replace" | "plan";
type NeedState = "open" | "resolved";

interface Need {
  id: string;
  type: NeedType;
  title: string;
  state: NeedState;
  resolution: TataResolution | null;
  createdAt: string;
  updatedAt: string;
}

type TataDestination =
  | "croma"
  | "westside"
  | "bigbasket"
  | "tata_1mg"
  | "travel"
  | "ihcl"
  | "neu_upi";

interface TataResolution {
  destination: TataDestination;
  label: string;
  isLive: false;
  demoOnly: true;
}

interface AIInsight {
  id: string;
  source: "gemini" | "fallback";
  text: string;
  counts: WeeklyCounts;
  cacheKey: string;
  generatedAt: string;
  fallbackReason: string | null;
}
```

`WeeklyCounts` is the only object Gemini may see. It contains living situation, selected week shapes, help focuses, item counts by state, type, and day, need counts by state and type, and how many resolved needs point at each demo destination. It does not contain titles, notes, prices, or free text.

`AIInsight` is stored beside the week, not inside a `WeekItem`. Factual state and model text do not share a field.

The demo catalogue is a closed map in `lib/catalogue.ts`. A destination not in that map cannot be stored. Remember-type needs resolve without a destination. Other types may resolve to a destination the map allows for that type, or to no destination when the map says a Tata stop is optional. The UI cannot submit a destination the map does not list.

No field holds a price, a stock count, a discount, a NeuCoin balance, or a rating.

## State model

| State | Where it lives | Who writes it |
| --- | --- | --- |
| Persona, onboarding answers | JSON store, copied to `localStorage` key `neuplan.user` | `PUT /api/user` after each onboarding step is confirmed; the last step sets `onboardingComplete` |
| Week items, needs, insight, analytics events | JSON store | Week, need, summary, and analytics routes |
| Visible list, form draft, error, undo | Component state | The screen, after a response or a failed request |
| "This tab already counted a meaningful session" | `sessionStorage` key `neuplan.session_meaningful` | The client, once |

Onboarding draft keys: `neuplan.draft` so a refresh keeps the step. Completing onboarding clears the draft.

Refresh reads the server. The server file survives a browser reload for the life of that machine's `.data` directory. Back uses real URLs, not a single-page stack that forgets history.

Delete keeps the deleted item in component state and shows "Removed" with Undo. Undo posts the same fields again. The new id is acceptable. There is no trash-bin product.

Optimistic completion is not used. The row changes after `PATCH` succeeds. A failure leaves the row as it was and shows the error.

`session_meaningful` fires once in a tab after the first of: item created, item completed, need created, need resolved. The definition is "the person finished something they started in this tab." It is not a weekly-active-user measurement.

## API boundaries

| Method and path | Body | Result |
| --- | --- | --- |
| `GET /api/week` | — | Current week and its items |
| `POST /api/week/items` | `type`, `title`, `day`, `time`, optional `tataDestination` | Created item, or 400 |
| `PATCH /api/week/items/:id` | Any of those fields, plus `state` | Updated item, or 404 |
| `DELETE /api/week/items/:id` | — | Deleted item, or 404 |
| `POST /api/ai/weekly-summary` | Empty | `AIInsight`. Always 200 if counts can be read. Gemini failure becomes a fallback insight, not a 500 |
| `GET /api/user` | — | Demo user |
| `PUT /api/user` | Onboarding fields | Updated user, or 400 |
| `GET /api/needs` | — | Needs |
| `POST /api/needs` | `type`, `title` | Created need |
| `PATCH /api/needs/:id` | `title`, `state`, optional `tataDestination` | Updated need. Unknown destination is 400 |
| `POST /api/analytics` | `name`, optional enum `props` | Appends one event. Unknown names are 400 |

`GET /api/week` errors return `{ "message": "We couldn't refresh your week." }` with status 500 only when the file store throws. The client shows that sentence and Try again.

Validation rejects empty titles, titles over 80 characters, days outside the current week, times that are not `HH:MM`, and enums outside the lists above. Messages name the field. They do not echo secrets.

Analytics `props` may include `type`, `state`, `destination`, `source`, and `reason`. They must not include titles, the Gemini prompt, or the API key.

## Gemini boundary

Files:

- `lib/ai/prompts.ts` builds the prompt from `WeeklyCounts` only.
- `lib/ai/gemini.ts` calls `@google/genai` on the server. It reads `GEMINI_API_KEY` and `GEMINI_MODEL` from the environment at call time. The model string is never written in source.
- `lib/ai/fallback.ts` builds a deterministic paragraph from the same counts.
- `lib/ai/summary.ts` caches, calls, validates, and falls back.
- `app/api/ai/weekly-summary/route.ts` is the only route that imports the summary module.

Call rules:

- If the key or the model is missing, do not construct a client. Return the fallback. Reason: `missing_key` or `missing_model`.
- Timeout is 8 seconds via `AbortSignal.timeout`. On timeout or any throw, return the fallback. Reason: `timeout` or `request_failed`.
- The prompt instructs the model to use only the numbers and labels in the JSON, to write at most three short sentences, and to add nothing else. It forbids new events, products, prices, inventory, discounts, colleges, roommates, history, and financial advice.
- The response is accepted only if it is a string under 600 characters and it does not contain `₹`, `rs.`, percent signs, or the words discount, offer, price, stock, hurry, limited, coin, streak, roommate, college, buy now. Digits in the reply must appear in the counts JSON. Failure reason: `malformed`.
- Cache key is the SHA-256 of the canonical counts JSON. An unchanged week returns the stored insight and does not call Gemini again.
- Logs may include the reason code. Logs must not include the key, the Authorization material, or the raw environment.

The fallback sentence states that the app wrote it from the counts. An empty week says the week is clear and no needs are open. The fallback does not name a brand and does not give advice.

The UI labels the source as "Model" or "Written by the app". A cached reply says the week has not changed.

## Analytics abstraction

`lib/analytics.ts` exports `ANALYTICS_EVENTS` and `trackEvent`. `trackEvent` on the server appends to the store. The client helper posts to `/api/analytics`. Nothing in this repository sends the events to a vendor.

Events: `neuplan_open`, `neuplan_onboarding_complete`, `week_view_open`, `week_item_created`, `week_item_completed`, `need_created`, `need_resolved`, `tata_resolution_viewed`, `tata_resolution_clicked`, `ai_summary_generated`, `ai_summary_fallback`, `session_meaningful`.

The hypothesis strip inside NeuPlan reads: the case talks about youth WAU +15%; status is Target / hypothesis; this prototype has not measured it and has not achieved it. No chart, no fake baseline, no percentage.

## Component hierarchy

```text
html
  SkipLink
  PhoneCanvas
    AppShell
      page header or screen
      BottomNav
        Home, Categories, Scan & Pay, Offers, NeuCard
    HomeScreen
      SearchForm
      ProfileButton
      QuickActions
      Bento (NeuPass, Cards, Finance, Electronics, Hotels)
      NeuPlanEntry
      TopOffers
      NotConnectedDialog
    CategoriesScreen
      CategoryGroup[]
      NeuPlanEntry
    ScanScreen
    OffersScreen
    NeuCardScreen
    NeuPlanFrame
      DemoBanner
      HypothesisNote
      SectionTabs (Week, Needs, Summary, Activity)
      WeekScreen
        WeekDay[]
          WeekItemRow
        ItemForm
        EmptyState
        ErrorState
        UndoBar
        SkeletonBlock
      OnboardingScreen
      NeedsScreen
        NeedForm
        NeedRow
      SummaryScreen
      ActivityScreen
      DemoDestinationScreen
```

Base components in `components/ui`: `Button`, `Card`, `TextField`, `Skeleton`, `Dialog`. They have no product copy.

## Product flow

```text
Open /
  Search submits a not-connected message
  Profile opens the demo sheet
  Quick actions and card Apply open the not-connected dialog
  NeuPlan entry -> /neuplan

/neuplan
  if onboarding is incomplete -> /neuplan/onboarding
  else show the week

Onboarding
  1. Which of these are in the week? (multi-select, at least one)
  2. Living situation (one)
  3. What should NeuPlan help with? (multi-select, at least one)
  Persist each confirmation
  Finish -> week view
  Refresh keeps the step
  Back returns to the previous step, then Home

Week
  Glance by day: count, then rows (type, title, time, state, optional demo stop)
  Empty week: "Your week is clear." and Add something
  Add, edit, mark done, remove, undo remove
  Fetch error: "We couldn't refresh your week." and Try again

Needs
  Add a need (Buy, Book, Prepare, Remember, Replace, Plan)
  Resolve with an allowed demo stop, or with no stop when the catalogue allows that
  Open the demo page. It states DEMO, isLive false, and that nothing will be bought or booked

Summary
  Summarise this week
  Show model or app text, kept separate from the items

Activity
  The events this prototype recorded, with timestamps
```

A week in which the student adds nothing stays empty. The product does not invent a class, a meal, or a deal to fill it.

## Testing strategy

Unit and component tests use Vitest and Testing Library. End-to-end tests use Playwright against `next start`.

| Area | Test |
| --- | --- |
| Week math | Monday start in Asia/Kolkata for a fixed instant |
| Catalogue | Every destination is `isLive: false` and `demoOnly: true`. Unknown names throw. Need types cannot resolve to a destination outside their list |
| Repository | Create, update, delete, reject bad days, round-trip the user |
| Onboarding | Cannot finish without the required choices. Draft survives a remount |
| Week UI | Empty copy, error copy, add and complete |
| Needs UI | Rejects a destination that is not on the list |
| Summary | Missing key, missing model, thrown timeout, malformed text, accepted text, cache skips the second call |
| Navigation | Shell links and the single NeuPlan entry |
| Playwright | First visit, onboarding, open NeuPlan, add, edit, complete, need, resolve, summary, Gemini path via fallback and a forced route failure, empty week, 390 / 768 / 1280, refresh, back, axe on the main screens |

`docs/TEST_STATUS.md` records commands and results after they are run. A line is not marked passed before the command exits 0.

After each phase: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.

## Phase plan

1. **Foundation.** Tokens, phone canvas, UI primitives, env example, types, week math, catalogue, repository, `GET /api/week`. App starts.
2. **Shell.** Home, Categories, Scan & Pay, Offers, NeuCard, bottom nav, one NeuPlan entry on Home and one row in Categories. Navigation tests.
3. **Onboarding.** Three steps, local draft, server user, refresh and back.
4. **Week.** Create, edit, complete, delete, undo, empty, error.
5. **Needs.** Types, states, demo destinations, no invalid destination, demo page.
6. **Gemini.** Prompt, client, fallback, cache, route, tests for success, missing key, timeout, malformed.
7. **Visual polish.** Compare with the screenshots. Remove gradient text, extra purple, metric tiles, and decorative cards.
8. **Playwright.** The flows above. Screenshots under `/opt/cursor/artifacts/neuplan/`.

A phase that fails its checks is fixed before the next phase starts.

## Risk register

| Risk | Why it matters | What the build does |
| --- | --- | --- |
| A reviewer treats NeuPlan as the answer to youth WAU | The strategy note says the brief fails | Hypothesis label on every NeuPlan screen. README states it is not a proven WAU solution. No percentage is rendered |
| Quiet weeks look like a bug | The honest week is often empty | Empty copy is "Your week is clear." The app does not seed fake classes |
| Demo stops look purchasable | Trust | `demoOnly`, on-screen DEMO, no price, no stock, no pay button |
| Gemini invents a life | The model is not a source of facts | Counts only, output filter, fallback |
| The API key reaches the browser | Secret leak | Server route only. No `NEXT_PUBLIC` key. Build is grepped for the key value |
| Offer lines drift from the live app | The screenshots are a moment in time | Copy is attributed to the reference screenshots. Nothing new is priced |
| File store is wiped or shared | One JSON file | Documented. Tests use their own directory. Not a production account system |
| Someone fills the week with a streak or a coin | Forbidden by the brief | Not implemented. Activity is a log, not a score |
| Asia/Kolkata is wrong for a traveller | Day boundaries | Documented assumption. The prototype does not geolocate |

## Security

- `.env` is gitignored. `.env.example` has empty `GEMINI_API_KEY` and `GEMINI_MODEL`.
- The key is read in `lib/ai/gemini.ts` on the server. Client components do not import that module.
- Error responses and `console` output use reason codes, not the key and not the prompt plus the key.
- Item titles are rendered as text. They are not passed to Gemini.
- Scan & Pay, Send Money, Recharges, Pay Bills, Transactions, and NeuCard Apply do not call a payment endpoint. There is no payment endpoint.
