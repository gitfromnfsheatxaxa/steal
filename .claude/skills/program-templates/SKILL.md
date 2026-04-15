# Program Templates Skill

## Purpose
Defines the data structures, patterns, and UI conventions for workout program templates in Steal Therapy.

## Data Model

### Program Template Structure
```typescript
interface ProgramTemplate {
  id: string
  title: string
  description: string
  goalType: 'muscle_building' | 'strength' | 'fat_loss' | 'endurance' | 'rehabilitation' | 'general_fitness'
  environment: 'gym' | 'home' | 'outdoor' | 'mixed'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  durationWeeks: number
  structure: {
    weeks: WeekStructure[]
  }
  popularity: number
  createdAt: string
  updatedAt: string
}

interface WeekStructure {
  weekNumber: number
  days: DayStructure[]
}

interface DayStructure {
  dayOfWeek: number // 1-7
  label: string
  focus: {
    muscleGroups: string[]
    intensity: 'low' | 'medium' | 'high'
  }
  warmup: ExerciseReference[]
  exercises: PlanExercise[]
  cooldown: ExerciseReference[]
}

interface PlanExercise {
  exerciseId: string
  name: string // Fallback for manual plans
  sets: number
  repsMin: number
  repsMax: number
  rpeTarget?: number
  restSeconds: number
  notes?: string
}
```

## Program Generation Rules

### Progressive Overload
- Week 1-2: Base building, moderate intensity
- Week 3-4: Volume increase
- Week 5+: Intensity progression or deload

### Exercise Selection
- Compound movements first (squat, deadlift, press, pull)
- Accessory work for muscle balance
- Mobility work for injury prevention

### Volume Guidelines
- Beginner: 3-4 exercises per session, 3-4 days/week
- Intermediate: 5-7 exercises per session, 4-5 days/week
- Advanced: 7-10 exercises per session, 5-6 days/week

## UI Patterns

### Template Selection
- Card grid with goal type badges
- Filter by environment, difficulty, duration
- Preview modal showing week-by-week breakdown

### Program Display
- Week navigation tabs
- Day cards with exercise count and estimated duration
- Progress tracking per day (not started / in progress / completed)

### Manual Plan Creation
- Drag-and-drop exercise browser
- Set/reps input with quick presets
- Auto-calculate estimated duration

## PocketBase Collections
- `plan_templates` — Pre-built templates
- `workout_plans` — User's active plans (from template or custom)
- `plan_days` — Individual workout days
- `plan_exercises` — Exercises within a plan day

## Usage
Reference this skill when creating, editing, or displaying workout program templates and user plans.