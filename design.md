# Steal Therapy — App Architecture & Design Reference

## Brand
**Name:** Steal Therapy | **Tagline:** "Steal Forges Steel"
**Aesthetic:** Brutal gym UI — dark, high-contrast, tactical/military tone, no generic AI layouts.
**Theme:** Dark/light toggle. Primary accent: raw industrial palette (CSS vars in `globals.css`).

---

## Route Tree

```
/                                    ← Landing (marketing hero, feature grid, CTAs)
├── (auth)/
│   ├── login/                       ← Email+password login, branded header
│   └── register/                    ← Email+password+confirm registration
│
├── (public)/
│   └── programs/                    ← Browse legend programs (grid, modal, compare table)
│
└── (app)/  [protected, AppShell]
    ├── dashboard/                   ← HQ: clock, 4-KPI row, active plan, session feed, PR wall
    ├── onboarding/                  ← 4-step wizard: Stats → Injuries → Mission → Arena
    ├── exercises/
    │   ├── (list)                   ← Filterable exercise library
    │   └── [slug]/                  ← Exercise detail: mechanics, variations, media
    ├── plans/
    │   ├── (list)                   ← Tabbed: My Programs / Sessions / Templates
    │   ├── create/                  ← Manual plan builder form
    │   └── [planId]/                ← Plan detail: weekly breakdown, day cards, per-day exercises
    ├── workout/
    │   ├── (index)                  ← Today's workout + weekly schedule (auth + guest mode)
    │   ├── quick/                   ← Ad-hoc session: pick exercises, log sets, save
    │   └── [sessionId]/             ← Live session: set logging, rest timer, mood, complete
    ├── progress/                    ← Analytics: 8+ charts, PRs, achievements, heatmap
    └── settings/                    ← Profile form, dark mode toggle, logout
```

---

## Pages — Feature Summary

| Route | Key Features |
|---|---|
| `/` | Hero, 3-column feature showcase, Sign In + Browse CTAs |
| `/login` | Email/password form, register link, connection debug |
| `/register` | Email/password/confirm form, sign-in redirect |
| `/programs` | Program grid cards, detail modal, comparison table, enroll button |
| `/dashboard` | Tactical clock, streak/sessions/volume/PRs KPIs, active plan briefing, session history, recent activity, PR wall |
| `/onboarding` | Age/height/weight/gender, injury checkboxes, goal/frequency/duration, environment + equipment |
| `/exercises` | Filterable catalog with count display, server-prefetched filters |
| `/exercises/[slug]` | Name, mechanics, variations, media |
| `/plans` | Tabs: saved plans, session history, template grid |
| `/plans/create` | Manual plan builder (title, days, exercises) |
| `/plans/[planId]` | Week grid, day cards (ready/completed/locked), exercise list, progress % |
| `/workout` | Today's card + week schedule, guest-mode fallback |
| `/workout/quick` | Exercise picker, set rows, mood check, notes, save session |
| `/workout/[sessionId]` | Live exercise cards, set logging, rest timer, mood/notes, complete flow |
| `/progress` | KPI row, volume chart, trend chart, reps distribution, heatmap, muscle radar, donut split, PR board, achievements |
| `/settings` | Display name, weight/height, dark mode, logout |

---

## Component Tree

```
components/
├── layout/
│   ├── AppShell            ← Navbar + BottomNav + page slot wrapper
│   ├── Navbar              ← Logo + user/menu links (top bar)
│   ├── BottomNav           ← 5-tab mobile nav (Dashboard/Plans/Workout/Progress/Settings)
│   ├── AmbientGymLayer     ← Atmospheric background effect
│   ├── BrandNoiseOverlay   ← Subtle noise texture for depth
│   └── GymBackgroundOverlay← Full-page themed background
│
├── auth/
│   ├── LoginForm           ← Controlled form, PB auth call
│   ├── RegisterForm        ← Controlled form with confirm field
│   └── ConnectionDebug     ← Dev-only PB connection tester
│
├── onboarding/
│   ├── ProfileStep         ← Age/height/weight/gender/level
│   ├── LimitationsStep     ← Injury checkboxes
│   ├── GoalsStep           ← Goal type, frequency, duration
│   ├── EnvironmentStep     ← Gym/home, equipment multi-select
│   └── types.ts            ← Zod schema + shared TS types
│
├── programs/
│   ├── ProgramDetail       ← Full overview: description, split, enroll
│   ├── ProgramPreview      ← Card with athlete photo, tags, frequency
│   └── PlanImageCarousel   ← Auto-slide, pause-on-hover, keyboard nav
│
├── plans/
│   ├── PlanCard            ← Saved plan card with actions
│   ├── ManualPlanForm      ← Custom plan builder form
│   ├── TemplateGrid        ← Available templates grid
│   ├── ExercisePickerModal ← Exercise search + select modal
│   └── SessionHistory      ← Past/upcoming sessions list
│
├── workout/
│   ├── ExerciseCard        ← Exercise block with set input rows
│   ├── SetRow              ← Weight / reps / RPE / done toggle
│   ├── ExerciseMedia       ← Thumbnail or full image/GIF
│   ├── RestTimer           ← Countdown between sets
│   ├── MoodCheck           ← Emoji mood selector (5 states)
│   └── WorkoutSummary      ← Post-session: exercises, duration, volume
│
├── progress/
│   ├── CalendarHeatmap     ← Year-view activity grid (GitHub style)
│   ├── EnhancedVolumeChart ← 8-week volume line/bar
│   ├── ProgressTrendChart  ← e1RM + RPE trend lines
│   ├── RepsDistributionChart← Rep range bar chart
│   ├── MusclePieChart      ← Muscle group donut
│   ├── MuscleBalance       ← Push/pull/legs balance indicator
│   ├── MuscleDistribution  ← Detailed muscle breakdown
│   ├── MuscleRadar         ← Spider chart for muscle balance
│   ├── DonutBreakdown      ← Push/pull/legs split donut
│   ├── VolumeChart         ← Simple volume tracker
│   ├── VolumeStackedChart  ← Stacked area by exercise/muscle
│   ├── LiftProgressionChart← Top lifts over time
│   ├── PRBoard             ← Personal records table
│   ├── PRWall              ← Recent PRs card grid (3 cards)
│   ├── StreakTracker       ← Streak counter + best streak
│   ├── GaugeRing           ← Circular metric gauge
│   └── AchievementsBoard   ← Unlocked badges grid
│
├── fx/
│   └── ImpactFlash         ← Animated number counter transition
│
├── providers/
│   ├── Providers           ← Root composition wrapper
│   ├── AuthProvider        ← PB auth context + session
│   ├── QueryProvider       ← TanStack Query client setup
│   ├── ThemeProvider       ← Dark/light context
│   ├── ThemeInitializer    ← SSR theme script (no flash)
│   ├── I18nProvider        ← EN/RU/UZ language context
│   └── PageTransition      ← Route change animation
│
└── ui/                     ← shadcn/ui primitives (DO NOT EDIT)
    button, card, dialog, form, input, label, select, badge,
    avatar, accordion, dropdown-menu, progress, radio-group,
    separator, sheet, skeleton, slider, switch, tabs,
    textarea, tooltip, sonner
```

---

## Hooks

| Hook | Purpose |
|---|---|
| `useAuth` | PB auth state, login, logout, session |
| `useProfile` | User profile (age/weight/height/goals), cached |
| `usePlans` | User plans, active plan, plan days + exercises, completed sessions |
| `useProgress` | Aggregated metrics: streaks, PRs, volume, muscle distribution, achievements |
| `useAchievements` | Unlocked achievement list |
| `useProgramTemplates` | Legend program templates with i18n locale select |
| `useRestTimer` | Start/stop/countdown rest timer state |
| `useQuickSessions` | Ad-hoc workout session CRUD |
| `useGuestWorkouts` | Guest mode: localStorage plan days, exercises, sessions |
| `useOfflineSync` | Offline data persistence + sync |
| `useExerciseTranslation` | Exercise name i18n lookup |

---

## Data Flow

```
PocketBase (backend)
   │
   ├── Auth       → useAuth → AuthProvider → all components
   ├── plans      → usePlans → plans/[planId], workout/[sessionId]
   ├── sessions   → usePlans / useQuickSessions → workout pages
   ├── progress   → useProgress → /progress, /dashboard
   ├── exercises  → inline PB calls → exercises/, workout pages
   ├── templates  → useProgramTemplates → /programs, /plans
   └── profile    → useProfile → /onboarding, /settings, /dashboard
```

## State Architecture

| Store | Type | Scope | Purpose |
|---|---|---|---|
| `workout-store.ts` | Zustand + localStorage | Client | Active session sets, timer, current exercise — survives refresh |
| `ui-store.ts` | Zustand | Client (ephemeral) | Sidebar open, modal state |
| TanStack Query cache | Server state | Client | All PB fetches with deduplication + background refetch |

---

## i18n

- Languages: **EN / RU / UZ**
- Strategy: `plan_templates` embeds all 3 locales in `structure.locales.*` — one PB fetch, zero re-requests on language switch.
- Exercise translations: `exercise_translations` collection, batched 80 IDs/call via `useExercisesBatchTranslation`.

---

## Key UX Patterns

- **Guest mode** — `/workout` works without login; data stored in localStorage via `useGuestWorkouts`.
- **Week locking** — Only `plan.currentWeek` days are active; future weeks are locked in UI.
- **Auto-advance week** — After all days in current week have completed sessions, `currentWeek += 1`.
- **Dual navigation** — Desktop: Navbar (top). Mobile: BottomNav (5 tabs, fixed bottom).
- **Image carousels** — Auto-slide 4s, pause on hover, keyboard-navigable.
- **Loading/error/empty states** — Required on every data-fetching component.
