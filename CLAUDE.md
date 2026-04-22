# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Intent

- Pure frontend web app — Next.js 15 (App Router + Server Components), TypeScript strict mode.
- Communicates with a **PocketBase backend** via the PocketBase SDK.
- All data operations go through custom hooks in `src/hooks/` that use TanStack Query.
- Deploy target: Vercel.

## Tech Stack (Locked — Do Not Substitute Without Asking)

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, RSC, Turbopack dev) |
| Language | TypeScript 5, `strict: true` |
| Styling | Tailwind CSS **v4** (via `@tailwindcss/postcss`, no `tailwind.config.js` — tokens live in `globals.css` via `@theme`) |
| Components | shadcn/ui (New York style, neutral base, CSS variables) |
| Server State | `@tanstack/react-query` v5 |
| Client State | `zustand` v5 |
| Forms | `react-hook-form` + `zod` (via `@hookform/resolvers`) |
| Icons | `lucide-react` |
| State Management | PocketBase SDK for backend data |
| Path Alias | `@/*` → `src/*` |

Rule of thumb: Zustand for client-only state (UI toggles, ephemeral form wizards); TanStack Query + PocketBase for anything sourced from the backend.

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx        # root layout — Server Component
│   ├── page.tsx          # landing — Server Component
│   ├── (auth)/           # auth routes (login)
│   ├── (app)/            # protected app routes (dashboard, programs, plans, etc.)
│   └── globals.css       # Tailwind v4 entry + CSS vars
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # AppShell, Navbar, BottomNav, overlays
│   ├── plans/            # PlanCard, plan-related components
│   ├── programs/         # PlanImageCarousel, program components
│   ├── progress/         # charts and progress visualization
│   ├── fx/               # animations and effects
│   └── auth/             # LoginForm, auth components
├── hooks/                # custom React hooks (data fetching via PocketBase)
│   ├── useAuth.ts        # authentication state
│   ├── usePlans.ts       # workout plan CRUD operations
│   └── useProgress.ts    # progress data, streaks, PRs, volume
├── lib/
│   ├── pocketbase.ts     # PocketBase SDK initialization
│   └── utils.ts          # `cn()` helper for Tailwind
├── types/                # shared TS types / DTOs
│   ├── plan.ts           # WorkoutPlan, PlanDay, PlanExercise
│   ├── profile.ts        # UserProfile, GoalType, Environment
│   ├── session.ts        # WorkoutSession, SessionSet
│   └── progress.ts       # PersonalRecord, StreakData, VolumeData
└── utils/                # pure helpers (non-React)
```

`components.json` at the repo root is the shadcn/ui config — aliases match this tree.

## PocketBase Data Model

### Collections

| Collection | Purpose | Key Fields |
| --- | --- | --- |
| `profiles` | User profile data | goalType, environment, currentWeight, height, age |
| `workout_plans` | User's workout programs | title, description, source, goalType, durationWeeks, currentWeek, status, **imageUrls** (JSON array) |
| `plan_days` | Individual training days | plan, week, dayOfWeek, label, focus (JSON array), warmup, cooldown |
| `plan_exercises` | Exercises in a plan day | planDay, exercise, sets, repsMin, repsMax, rpeTarget, restSeconds |
| `exercises` | Exercise catalog | name, muscleGroup, equipment, instructions |
| `workout_sessions` | Completed workout sessions | user, planDay, plan, startedAt, completedAt, status, mood, energyLevel, sessionNotes |
| `session_sets` | Sets logged in a session | session, exercise, setNumber, weight, reps, rpe, notes |
| `plan_templates` | Pre-built program templates | title, description, goalType, difficulty, durationWeeks, structure (JSON) |
| `goals` | User fitness goals | user, goalType, targetWeight, deadline, notes |

### Data Flow Pattern

1. **Authentication**: `useAuth` hook manages PocketBase auth store
2. **Data Fetching**: Custom hooks (`usePlans`, `useProgress`) use TanStack Query with PocketBase SDK
3. **CRUD Operations**: Hooks provide `create`, `update`, `delete` functions that call PocketBase collection methods
4. **Real-time**: PocketBase subscriptions can be used for live updates (optional)

### Image URL Field (workout_plans)

- Field name: `imageUrls`
- Type: JSON (stores array of strings)
- Usage: Stores multiple image URLs for program cards
- Format: `["https://example.com/image1.jpg", "https://example.com/image2.jpg"]`
- Frontend: `PlanImageCarousel` component auto-slides through images

### plan_templates — Embedded Multilingual Structure

The `structure` JSON field stores all 3 locales inline — no separate translation table:

```json
{
  "slug": "arnold",
  "locales": {
    "en": { "title": "...", "description": "...", "overview": {...}, "days": [...], "guidelines": {...} },
    "ru": { ... },
    "uz": { ... }
  }
}
```

`useProgramTemplates()` (`src/hooks/useProgramTemplates.ts`) reads `useI18n().language` and uses TanStack Query `select` to remap the cached raw records to the active locale — **one PB fetch, zero extra requests on language switch**.

The `listRule`/`viewRule` for `plan_templates` must be empty (`""`) because `/programs` is a public route. If set to `@request.auth.id != ""`, unauthenticated visitors get an empty list silently.

### exercise_translations Collection

Seeded via `scripts/seed-exercise-translations.mjs`. Each row: `{ exerciseExtId, locale, name, overview, bodyPart, equipment, target, ... }`. The hook `useExercisesBatchTranslation` batches up to 80 IDs per PB filter call. Requires auth (`listRule: @request.auth.id != ""`).

### Week Progression Logic

`workout_plans.currentWeek` advances in `src/app/(app)/workout/[sessionId]/page.tsx` after a session completes:
1. Load all `plan_days` for the finished week
2. Load all `workout_sessions` for those days with `status="completed"`
3. If every day has a completed session → `currentWeek += 1`

Only days where `planDay.week === plan.currentWeek` are shown as active in the dashboard. Future weeks are "locked" in the UI (not enforced in DB).

### Known Quirk: useProgress Fetches All Sessions

`useProgress.ts` calls `getList(1, 200)` **without a user filter** then filters in JS. This is a workaround for PocketBase SDK auto-cancellation issues with filters. Do not "fix" it to use a server-side filter without testing — it will break the auto-cancel protection.

### PocketBase Proxy

Browser requests go to `/pb/*` which Next.js (`next.config.mjs`) proxies to `POCKETBASE_INTERNAL_URL`. Server-side (SSR) calls hit PocketBase directly. Never hardcode the PocketBase URL on the client side.

### Zustand Stores

- `src/stores/workout-store.ts` — active session state (sets logged, timer, current exercise). Persisted to `localStorage` so in-progress workouts survive page refresh.
- `src/stores/ui-store.ts` — ephemeral UI toggles (sidebar open, modal state).

## Product Rules

- Distinctive UI — no generic "AI slop" layouts. Prefer Server Components; only reach for `"use client"` when you need interactivity, browser APIs, or a client-only library.
- Every API call must handle **loading, error, and empty** states explicitly. An unhandled empty state counts as a bug.
- Accessibility and Core Web Vitals are first-class requirements, not polish.
- All data operations go through PocketBase SDK via custom hooks.
- Follow the brutal gym aesthetic and brand guidelines ("Steel Forges Steel" tone).
- Image carousels must auto-slide, pause on hover, and support keyboard navigation.

## Commands

| Command | What It Does |
| --- | --- |
| `npm run dev` | Start dev server at http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` strict typecheck |
| `npx shadcn@latest add <component>` | Add a shadcn/ui component into `src/components/ui/` |
| `./pocketbase/pocketbase migrate` | Run PocketBase migrations |
| `./pocketbase/pocketbase serve` | Start PocketBase server |
| `node --env-file=.env.local scripts/seed-exercise-translations.mjs` | Seed EN→RU/UZ exercise translations into PocketBase |
| `node --env-file=.env.local scripts/seed-legends-programs.mjs` | Seed 7 legend programs (EN/RU/UZ) into `plan_templates` |

Both seed scripts are **resumable** — they write progress to `.seed-progress.json` and `.legends-cache.json` respectively. Re-running after a failure skips completed records.

Lint is not wired up yet — add `next lint` or an ESLint flat config in a follow-up if/when needed.

## Environment

- `.env.local` holds `NEXT_PUBLIC_API_URL`. It is gitignored via `.env*.local`. Do **not** commit real backend URLs here.
- Any new public env var must be prefixed `NEXT_PUBLIC_` to reach the browser; otherwise it is server-only.

## Environment & Tooling Gotchas

- **Platform is Windows + Git Bash.** Use Unix shell syntax in Bash tool calls (forward slashes, `/dev/null`).
- `.claude/skills/` contains domain-specific skills. Read them before implementing features:
  - `brutal-gym-ui/` — UI conventions and styling
  - `brand-guidelines/` — Tone of voice and brand identity
  - `program-templates/` — Workout plan data structures
  - `session-logging/` — Session tracking patterns
  - `progress-tracking/` — Analytics and metrics
- `.claude/agents/` contains the 6-agent team. Read them for role-specific instructions:
  - `architect.md` — Planning and architecture
  - `frontend-lead.md` — Component architecture and organization
  - `frontend-designer.md` — Visual design and styling
  - `frontend-dev.md` — Feature implementation
  - `program-manager.md` — Workout program design
  - `reviewer.md` — Code quality and standards

## Team — 6-Agent Workflow

| Agent | Purpose | When to Use |
| --- | --- | --- |
| **Architect** | Planning, specs, architecture | Starting new features, complex changes |
| **Frontend-Lead** | Component architecture, code organization | Breaking down features, reviewing structure |
| **Frontend-Designer** | Visual design, styling, UX | Creating distinctive UI, design systems |
| **Frontend-Dev** | Feature implementation, hooks | Building components, connecting data |
| **Program-Manager** | Workout programming, fitness logic | Designing plans, progression rules |
| **Reviewer** | Code quality, accessibility, brand | After implementation, before completion |

## Token Efficiency & Context Management

### Core Principles
- Be concise but complete. Prefer clarity over brevity when it affects understanding.
- Never repeat information that already exists in CLAUDE.md, skills, or previous outputs unless explicitly asked.
- Keep responses focused. Only include what is necessary for the current task.
- Use structured, compact formats (tables, bullet points, YAML) when appropriate.

### Agent & Pipeline Rules
- When using multiple agents, keep the active agent count to a maximum of 5 unless the user explicitly requests more.
- Agents must reference existing files (CLAUDE.md, skills, SPEC.md) instead of re-explaining rules.
- After completing a major phase, summarize the outcome in maximum 8–10 lines before moving to the next phase.
- Only load relevant skills and agents for the current task. Do not preload unnecessary ones.

### Response Style Rules
- Avoid long introductory explanations or motivational language unless the user asks for it.
- When suggesting code changes, show only the diff or the specific file/section being modified.
- Use "Continue" or "Next" style responses when a task has clear next steps.
- For code generation: Prioritize clean, production-ready code with minimal comments.

### Context Management Rules
- At the end of every major milestone, offer a short "Context Summary" (max 5 lines) capturing the current state.
- If the conversation becomes very long (>15 messages), suggest starting a fresh session with a condensed summary.
- Prefer referencing file paths and existing documentation over re-describing architecture or rules.

## Performance Safeguards

- Token rules must never reduce reasoning quality, architectural thinking, or UI/design excellence.
- If a task requires deep analysis or creative solutions, use full reasoning even if it costs more tokens.
- Always prioritize correctness, type safety, accessibility, and distinctive UI over token optimization.

## Recommended Workflow for Large Projects

1. Use Plan Mode for complex features first.
2. Execute with maximum 4–5 agents.
3. After each major phase, create/update a short SPEC.md or STATUS.md.
4. Regularly extract useful patterns into the skills library to reduce future context load.