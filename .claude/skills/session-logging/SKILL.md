# Session Logging Skill

## Purpose
Defines the data structures and UI patterns for logging workout sessions in Steal Therapy.

## Data Model

### Workout Session Structure
```typescript
interface WorkoutSession {
  id: string
  user: string // relation to users
  planDay?: string // optional relation to plan_days
  plan?: string // optional relation to workout_plans
  startedAt: string
  completedAt?: string
  status: 'in_progress' | 'completed' | 'skipped'
  mood?: 'great' | 'good' | 'okay' | 'rough' | 'terrible'
  energyLevel?: 1 | 2 | 3 | 4 | 5
  sessionNotes?: string
  therapyReflection?: string
  sets: SessionSet[]
}

interface SessionSet {
  id: string
  session: string // relation to workout_sessions
  exercise?: string // optional relation to exercises
  setNumber: number
  reps: number
  weight: number
  rpe?: number
  completed: boolean
  notes?: string
}
```

## Session Logging Flow

### 1. Session Start
- User selects today's planned workout or creates ad-hoc
- Show planned exercises with target sets/reps
- Display warmup recommendations

### 2. During Workout
- Each set logged with: reps, weight, RPE (optional)
- Quick-add buttons for common increments
- Rest timer option between sets
- Ability to add notes per exercise

### 3. Session Complete
- Mood/energy rating prompt
- Optional reflection text field
- Auto-calculate volume load (sets × reps × weight)
- Show session summary stats

## UI Patterns

### Active Session View
- Large, tap-friendly set inputs
- Current set highlighted
- Previous sets collapsed but accessible
- Floating action button for quick complete

### Set Input Card
```
┌─────────────────────────────┐
│ Barbell Squat               │
│ Target: 3 sets × 8-10 reps  │
│                             │
│ Set 1 │ 8 reps │ 135 lbs │ ✓│
│ Set 2 │ 8 reps │ 135 lbs │ ✓│
│ Set 3 │ 9 reps │ 135 lbs │🔄│
│                             │
│ [+5 lbs] [+2.5 lbs] [-2.5]│
│ [Reps: -] [Reps: +] [Done]│
└─────────────────────────────┘
```

### Post-Session Summary
- Total volume lifted
- Personal records broken (if any)
- Mood/energy trend chart
- Next session preview

## PocketBase Collections
- `workout_sessions` — Session metadata
- `session_sets` — Individual set records
- Links to `exercises` for reference data

## Usage
Reference this skill when implementing workout session logging, tracking, or history features.