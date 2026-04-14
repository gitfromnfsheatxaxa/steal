export interface ProgressionRules {
  type: "linear" | "periodized" | "autoregulated";
  increment: {
    upper: number; // kg per week
    lower: number; // kg per week
  };
  deloadFrequency: number; // every N weeks
  deloadVolumeReduction: number; // percentage (e.g. 40)
}

interface ProgressionInput {
  currentWeight: number;
  lastRpe: number; // average RPE from last 2 sessions
  rpeHistory: number[]; // last N RPE values for this exercise
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  isUpperBody: boolean;
  rules: ProgressionRules;
  weekNumber: number;
}

interface ProgressionResult {
  nextWeight: number;
  suggestion: string; // human-readable explanation
  isDeload: boolean;
}

/**
 * Calculate the next weight/progression based on RPE history and rules.
 */
export function calculateProgression(input: ProgressionInput): ProgressionResult {
  const { currentWeight, rpeHistory, isUpperBody, rules, weekNumber } = input;

  // Check if this is a deload week
  if (
    rules.deloadFrequency > 0 &&
    weekNumber > 0 &&
    weekNumber % rules.deloadFrequency === 0
  ) {
    return {
      nextWeight: currentWeight,
      suggestion: `Deload week — same weight, ${rules.deloadVolumeReduction}% fewer sets. Your body grows during recovery.`,
      isDeload: true,
    };
  }

  // Get recent RPE trend (last 2 sessions)
  const recentRpe = rpeHistory.slice(-2);
  const avgRpe =
    recentRpe.length > 0
      ? recentRpe.reduce((a, b) => a + b, 0) / recentRpe.length
      : 7;

  const increment = isUpperBody ? rules.increment.upper : rules.increment.lower;

  // RPE too high consistently → hold weight
  if (avgRpe >= 9 && recentRpe.length >= 2) {
    return {
      nextWeight: currentWeight,
      suggestion:
        "Hold this weight — you're working very hard. Add 1 rep before adding weight. Strength is patience.",
      isDeload: false,
    };
  }

  // RPE too low → bigger jump
  if (avgRpe < 7 && recentRpe.length >= 2) {
    const bigJump = increment * 2;
    return {
      nextWeight: roundToNearest(currentWeight + bigJump, 1.25),
      suggestion: `You're cruising — let's add ${bigJump}kg. You're stronger than you think.`,
      isDeload: false,
    };
  }

  // Normal progression
  return {
    nextWeight: roundToNearest(currentWeight + increment, 1.25),
    suggestion: `Progress by ${increment}kg. Consistent small steps build unshakable strength.`,
    isDeload: false,
  };
}

function roundToNearest(value: number, step: number): number {
  return Math.round(value / step) * step;
}

/**
 * Calculate weekly volume change percentage.
 */
export function weeklyVolumeChange(
  prevVolume: number,
  currentVolume: number,
): { change: number; label: string } {
  if (prevVolume === 0) return { change: 0, label: "First week" };
  const change = ((currentVolume - prevVolume) / prevVolume) * 100;
  const rounded = Math.round(change * 10) / 10;

  if (rounded > 10) return { change: rounded, label: "Big jump — check recovery" };
  if (rounded > 0) return { change: rounded, label: "Progressive overload" };
  if (rounded === 0) return { change: 0, label: "Maintenance" };
  if (rounded > -20) return { change: rounded, label: "Slight deload" };
  return { change: rounded, label: "Recovery week" };
}
