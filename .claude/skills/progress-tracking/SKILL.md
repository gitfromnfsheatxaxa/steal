# Progress Tracking Skill

## Purpose
Defines the data structures and UI patterns for tracking fitness progress in Steal Therapy.

## Data Model

### Progress Metrics
```typescript
interface UserProfile {
  id: string
  user: string // relation to users
  age?: number
  height?: number
  weight?: number
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced'
  limitations?: any // JSON: physical limitations
  injuryHistory?: string
  onboardingComplete?: boolean
}

interface FitnessGoal {
  id: string
  user: string // relation to users
  type?: 'muscle_building' | 'strength' | 'fat_loss' | 'endurance' | 'rehabilitation' | 'general_fitness'
  environment?: 'gym' | 'home' | 'outdoor' | 'mixed'
  equipment?: any // JSON: available equipment
  daysPerWeek?: number
  sessionMinutes?: number
  priority?: 'primary' | 'secondary'
}

interface ProgressSnapshot {
  date: string
  weight?: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    thighs?: number
  }
  photos?: string[] // URLs
  notes?: string
}

interface PersonalRecord {
  id: string
  exercise: string // relation to exercises
  user: string
  weight: number
  reps: number
  date: string
  setNumber: number
  session: string // relation to workout_sessions
}
```

## Progress Tracking Features

### Weight & Measurements
- Weekly weigh-in reminder
- Measurement tracking (chest, waist, hips, arms, thighs)
- Progress photos with date stamps
- Body fat percentage estimates (optional)

### Strength Progress
- 1RM estimates from logged sets
- Exercise-specific progress charts
- Personal record notifications
- Volume load trends (weekly/monthly)

### Consistency Metrics
- Streak counter (consecutive weeks with sessions)
- Sessions completed vs. planned
- Average weekly volume
- Goal adherence percentage

## UI Patterns

### Progress Dashboard
```
┌─────────────────────────────────┐
│  Progress                       │
│                                 │
│  ┌─────┐  ┌─────┐  ┌─────┐    │
│  │ 42  │  │ 28  │  │ 12  │    │
│  │Days │  │Sessions│ │PRs  │    │
│  └─────┘  └─────┘  └─────┘    │
│                                 │
│  Weight Trend                   │
│  ┌─────────────────────────┐   │
│  │     📈 chart here       │   │
│  └─────────────────────────┘   │
│                                 │
│  Recent Personal Records        │
│  • Deadlift: 225lbs × 5 (new)  │
│  • Bench: 185lbs × 3 (new)     │
└─────────────────────────────────┘
```

### Progress Photo Timeline
- Grid view with date overlays
- Side-by-side comparison mode
- Before/after slider

### PR Celebration
- Subtle animation on new PR
- Share option (optional)
- Add notes to commemorate

## PocketBase Collections
- `profiles` — User physical data
- `goals` — Fitness objectives
- `workout_sessions` — For progress calculations
- `session_sets` — For PR detection

## Usage
Reference this skill when implementing progress dashboards, tracking features, or analytics.