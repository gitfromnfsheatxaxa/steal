export type AchievementId =
  | "first_blood"
  | "iron_five"
  | "iron_ten"
  | "grinding"
  | "committed"
  | "centurion"
  | "on_fire"
  | "unstoppable"
  | "iron_will"
  | "month_one"
  | "pr_hunter";

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export interface AchievementDef {
  id: AchievementId;
  name: string;
  description: string;
  icon: string; // text label like "I", "V", "X"
  tier: AchievementTier;
}

export interface UserAchievement {
  id: AchievementId;
  unlockedAt: string; // ISO date
  def: AchievementDef;
}
