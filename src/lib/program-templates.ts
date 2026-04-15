/**
 * Predefined Program Templates with Exercise Rotations
 * 
 * Each program is designed as a one-week challenge. After completing the week,
 * users can renew to get the next week with rotated exercises.
 */

import type { 
  ProgramTemplateDefinition, 
  ExerciseVariationDef,
  ExerciseWithVariations
} from "@/types/plan";

// Helper to create variations
const var1 = (name: string, reps?: string, notes?: string): ExerciseVariationDef => ({
  weekNumber: 2,
  name,
  repsMin: reps ? parseInt(reps.split("–")[0]) || undefined : undefined,
  repsMax: reps ? parseInt(reps.split("–")[1]) || undefined : undefined,
  notes,
});

const var2 = (name: string, reps?: string, notes?: string): ExerciseVariationDef => ({
  weekNumber: 3,
  name,
  repsMin: reps ? parseInt(reps.split("–")[0]) || undefined : undefined,
  repsMax: reps ? parseInt(reps.split("–")[1]) || undefined : undefined,
  notes,
});

const var3 = (name: string, reps?: string, notes?: string): ExerciseVariationDef => ({
  weekNumber: 4,
  name,
  repsMin: reps ? parseInt(reps.split("–")[0]) || undefined : undefined,
  repsMax: reps ? parseInt(reps.split("–")[1]) || undefined : undefined,
  notes,
});

// ─────────────────────────────────────────────────────────────────────────────
// TRAIN LIKE DORIAN YATES — Blood & Guts
// ─────────────────────────────────────────────────────────────────────────────
export const YATES_PROGRAM: ProgramTemplateDefinition = {
  id: "yates",
  title: "TRAIN LIKE DORIAN YATES",
  subtitle: "Blood & Guts",
  tagline: "One all-out working set. Complete failure. The Shadow's method.",
  description:
    "Dorian Yates revolutionized bodybuilding with his Heavy Duty philosophy. Each exercise gets one all-out working set taken to absolute failure. Warm-ups don't count. The working set does. Controlled negatives, peak contraction, and brutal intensity define the Yates approach.",
  difficulty: "Elite",
  daysPerWeek: "4x/week",
  tags: ["Mass", "Strength", "High Intensity", "HIT"],
  imageUrls: [
    "https://cdn.shopify.com/s/files/1/0709/7905/9960/files/Dorian_Yates_4-Day_Split_Workout_480x480.png?v=1730952240",
    "https://i1.sndcdn.com/artworks-izOMwxbnKyiWFCwy-BGOjRg-t500x500.jpg",
  ],
  goalType: "muscle_building",
  environment: "gym",
  weeklyStructure: {
    rotationLength: 4, // 4-week rotation before renewal
    days: [
      {
        dayOfWeek: 1,
        label: "BACK + BICEPS",
        focus: ["lats", "rhomboids", "biceps"],
        warmup: {
          exercises: [
            { name: "Light cardio", duration: "5 min", notes: "Get blood flowing" },
            { name: "Arm circles + band pull-aparts", duration: "2 min", notes: "Shoulder prep" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Pull-Ups (Wide Grip)",
              sets: 1,
              repsMin: 6,
              repsMax: 8,
              rpeTarget: 10,
              restSeconds: 180,
              notes: "Go to absolute failure. Negative: 3 seconds down.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Lat Pulldowns (Wide Grip)",
                  repsMin: "8–10",
                  notes: "Heavy. Lean back slightly. Squeeze lats at bottom.",
                },
                {
                  weekNumber: 3,
                  name: "Weighted Pull-Ups",
                  repsMin: "4–6",
                  notes: "Add weight. Even +10lbs is progress.",
                },
                {
                  weekNumber: 4,
                  name: "Seated Cable Rows (Close Grip)",
                  repsMin: "8–10",
                  notes: "Pull to lower abs. Squeeze shoulder blades.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Barbell Rows (Pendlay Style)",
              sets: 1,
              repsMin: 6,
              repsMax: 8,
              rpeTarget: 10,
              restSeconds: 180,
              notes: "Explosive pull from floor. Control the negative.",
              variations: [
                {
                  weekNumber: 2,
                  name: "T-Bar Rows",
                  repsMin: "8–10",
                  notes: "Chest supported if possible.",
                },
                {
                  weekNumber: 3,
                  name: "One-Arm Dumbbell Rows",
                  repsMin: "6–8",
                  notes: "Heavy. No momentum. Pure back work.",
                },
                {
                  weekNumber: 4,
                  name: "Chest-Supported Rows",
                  repsMin: "10–12",
                  notes: "Eliminate cheating. Isolate the back.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Deadlifts (Conventional)",
              sets: 1,
              repsMin: 6,
              repsMax: 8,
              rpeTarget: 10,
              restSeconds: 300,
              notes: "The king. One all-out set. Form first, then go.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Romanian Deadlifts",
                  repsMin: "8–10",
                  notes: "Hamstring stretch. Control the descent.",
                },
                {
                  weekNumber: 3,
                  name: "Deficit Deadlifts",
                  repsMin: "4–6",
                  notes: "Stand on 1-inch plate. Deeper range.",
                },
                {
                  weekNumber: 4,
                  name: "Trap Bar Deadlifts",
                  repsMin: "6–8",
                  notes: "More quad involvement. Still brutal.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Cable Pulldowns (Reverse Grip)",
              sets: 1,
              repsMin: 8,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 120,
              notes: "Lower lat sweep. Squeeze hard at bottom.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Straight-Arm Cable Pulldowns",
                  repsMin: "10–12",
                  notes: "Isolate lats. No biceps.",
                },
                {
                  weekNumber: 3,
                  name: "Single-Arm Lat Pulldowns",
                  repsMin: "6–8",
                  notes: "Full stretch, full contraction.",
                },
                {
                  weekNumber: 4,
                  name: "Dumbbell Pullovers",
                  repsMin: "10–12",
                  notes: "Stretch the lats. Feel the expansion.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Barbell Curls",
              sets: 1,
              repsMin: 8,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 90,
              notes: "No swinging. Strict form. Failure.",
              variations: [
                {
                  weekNumber: 2,
                  name: "EZ-Bar Curls (Preacher)",
                  repsMin: "10–12",
                  notes: "Preacher bench. Eliminate cheating.",
                },
                {
                  weekNumber: 3,
                  name: "Incline Dumbbell Curls",
                  repsMin: "8–10",
                  notes: "Full stretch at bottom.",
                },
                {
                  weekNumber: 4,
                  name: "Hammer Curls",
                  repsMin: "10–12",
                  notes: "Brachialis development.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Concentration Curls",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 10,
              restSeconds: 60,
              notes: "Peak contraction. Squeeze at top.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Cable Curls (Single Arm)",
                  repsMin: "12–15",
                  notes: "Constant tension.",
                },
                {
                  weekNumber: 3,
                  name: "Spider Curls",
                  repsMin: "10–12",
                  notes: "Chest on incline bench. No cheating.",
                },
                {
                  weekNumber: 4,
                  name: "21s (Half + Full Reps)",
                  repsMin: "21 total",
                  notes: "7 bottom half, 7 top half, 7 full.",
                },
              ],
            },
          },
        ],
      },
      {
        dayOfWeek: 2,
        label: "CHEST + TRICEPS",
        focus: ["pectorals", "triceps", "front delts"],
        warmup: {
          exercises: [
            { name: "Light cardio", duration: "5 min", notes: "" },
            { name: "Push-ups", duration: "1 set x 15", notes: "Warm up chest" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Bench Press (Flat Barbell)",
              sets: 1,
              repsMin: 6,
              repsMax: 8,
              rpeTarget: 10,
              restSeconds: 180,
              notes: "Retract scapula. Drive through legs. One all-out set.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Incline Barbell Press",
                  repsMin: "8–10",
                  notes: "Upper chest focus.",
                },
                {
                  weekNumber: 3,
                  name: "Weighted Dips",
                  repsMin: "6–8",
                  notes: "Lean forward for chest.",
                },
                {
                  weekNumber: 4,
                  name: "Floor Press",
                  repsMin: "6–8",
                  notes: "Eliminate stretch. Pure strength.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Incline Dumbbell Press",
              sets: 1,
              repsMin: 8,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 150,
              notes: "Upper chest. Full stretch at bottom.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Flat Dumbbell Press",
                  repsMin: "8–10",
                  notes: "Greater range of motion.",
                },
                {
                  weekNumber: 3,
                  name: "Close-Grip Bench Press",
                  repsMin: "6–8",
                  notes: "Triceps + chest.",
                },
                {
                  weekNumber: 4,
                  name: "Machine Press",
                  repsMin: "10–12",
                  notes: "Stable. Push to failure safely.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Cable Flyes (High to Low)",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 10,
              restSeconds: 90,
              notes: "Squeeze at bottom. Lower chest definition.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Dumbbell Flyes (Flat)",
                  repsMin: "10–12",
                  notes: "Stretch the pecs.",
                },
                {
                  weekNumber: 3,
                  name: "Cable Flyes (Low to High)",
                  repsMin: "12–15",
                  notes: "Upper chest sweep.",
                },
                {
                  weekNumber: 4,
                  name: "Pec Deck Machine",
                  repsMin: "12–15",
                  notes: "Isolate. Squeeze hard.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Tricep Pushdowns (Rope)",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 10,
              restSeconds: 90,
              notes: "Spread rope at bottom. Squeeze.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Bar Pushdowns (Straight)",
                  repsMin: "12–15",
                  notes: "Constant tension.",
                },
                {
                  weekNumber: 3,
                  name: "Overhead Cable Extensions",
                  repsMin: "10–12",
                  notes: "Long head focus.",
                },
                {
                  weekNumber: 4,
                  name: "Skull Crushers",
                  repsMin: "8–10",
                  notes: "Barbell or EZ-bar.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Overhead Dumbbell Extensions",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 10,
              restSeconds: 75,
              notes: "Long head stretch. Control the weight.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Close-Grip Bench Press",
                  repsMin: "8–10",
                  notes: "Heavy tricep work.",
                },
                {
                  weekNumber: 3,
                  name: "Cable Kickbacks",
                  repsMin: "12–15",
                  notes: "Peak contraction.",
                },
                {
                  weekNumber: 4,
                  name: "Diamond Push-Ups",
                  repsMin: "To failure",
                  notes: "Bodyweight burnout.",
                },
              ],
            },
          },
        ],
      },
      {
        dayOfWeek: 4,
        label: "LEGS",
        focus: ["quadriceps", "hamstrings", "glutes", "calves"],
        warmup: {
          exercises: [
            { name: "Light cardio", duration: "7 min", notes: "" },
            { name: "Bodyweight squats", duration: "2 sets x 15", notes: "" },
            { name: "Leg extension (light)", duration: "1 set x 20", notes: "" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Squats (Low Bar)",
              sets: 1,
              repsMin: 6,
              repsMax: 8,
              rpeTarget: 10,
              restSeconds: 300,
              notes: "Depth below parallel. One all-out set.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Front Squats",
                  repsMin: "8–10",
                  notes: "Quad focus. Keep chest up.",
                },
                {
                  weekNumber: 3,
                  name: "Box Squats",
                  repsMin: "6–8",
                  notes: "Posterior chain. Sit back.",
                },
                {
                  weekNumber: 4,
                  name: "Hack Squats (Machine)",
                  repsMin: "10–12",
                  notes: "Controlled. Deep stretch.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Leg Press",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 10,
              restSeconds: 180,
              notes: "Feet low for quads. Go deep.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Bulgarian Split Squats",
                  repsMin: "8–10",
                  notes: "Each leg. Unilateral strength.",
                },
                {
                  weekNumber: 3,
                  name: "Sissy Squats",
                  repsMin: "10–12",
                  notes: "Quad isolation. Bodyweight or weighted.",
                },
                {
                  weekNumber: 4,
                  name: "Goblet Squats",
                  repsMin: "12–15",
                  notes: "Deep range. Hold at bottom.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Leg Curls (Seated)",
              sets: 1,
              repsMin: 8,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 120,
              notes: "Hamstring squeeze. Hold at bottom.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Lying Leg Curls",
                  repsMin: "10–12",
                  notes: "Different angle.",
                },
                {
                  weekNumber: 3,
                  name: "Nordic Hamstring Curls",
                  repsMin: "6–8",
                  notes: "Eccentric focus. Brutal.",
                },
                {
                  weekNumber: 4,
                  name: "Stiff-Legged Deadlifts",
                  repsMin: "8–10",
                  notes: "Hamstring stretch.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Leg Extensions",
              sets: 1,
              repsMin: 12,
              repsMax: 15,
              rpeTarget: 10,
              restSeconds: 90,
              notes: "Quad sweep. Squeeze at top.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Single-Leg Extensions",
                  repsMin: "12–15",
                  notes: "Each leg. Eliminate imbalances.",
                },
                {
                  weekNumber: 3,
                  name: "Heavy Leg Extensions",
                  repsMin: "8–10",
                  notes: "Low rep, high weight.",
                },
                {
                  weekNumber: 4,
                  name: "21s Leg Extensions",
                  repsMin: "21 total",
                  notes: "Half + half + full reps.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Standing Calf Raises",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 10,
              restSeconds: 60,
              notes: "Full stretch. Full contraction.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Seated Calf Raises",
                  repsMin: "15–20",
                  notes: "Soleus focus.",
                },
                {
                  weekNumber: 3,
                  name: "Donkey Calf Raises",
                  repsMin: "12–15",
                  notes: "Deep stretch.",
                },
                {
                  weekNumber: 4,
                  name: "Single-Leg Calf Raises",
                  repsMin: "10–12",
                  notes: "Each leg. Bodyweight or weighted.",
                },
              ],
            },
          },
        ],
      },
      {
        dayOfWeek: 5,
        label: "SHOULDERS + TRAPS",
        focus: ["deltoids", "trapezius"],
        warmup: {
          exercises: [
            { name: "Band pull-aparts", duration: "2 sets x 20", notes: "" },
            { name: "Light lateral raises", duration: "1 set x 15", notes: "" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Bent-Over Barbell Curls (Yates Curls)",
              sets: 1,
              repsMin: 8,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 120,
              notes: "Back width. Control the weight.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Chest-Supported T-Bar Rows",
                  repsMin: "10–12",
                  notes: "Upper back focus.",
                },
                {
                  weekNumber: 3,
                  name: "Incline Dumbbell Curls",
                  repsMin: "8–10",
                  notes: "Bicep stretch.",
                },
                {
                  weekNumber: 4,
                  name: "Meadows Rows",
                  repsMin: "8–10",
                  notes: "Unilateral. Heavy.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Seated Dumbbell Overhead Press",
              sets: 1,
              repsMin: 8,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 150,
              notes: "Strict form. No leg drive.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Standing Barbell Press",
                  repsMin: "6–8",
                  notes: "Core engagement.",
                },
                {
                  weekNumber: 3,
                  name: "Arnold Press",
                  repsMin: "10–12",
                  notes: "Rotation for full delt work.",
                },
                {
                  weekNumber: 4,
                  name: "Machine Shoulder Press",
                  repsMin: "12–15",
                  notes: "Stable. Push to failure.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Dumbbell Lateral Raises",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 10,
              restSeconds: 75,
              notes: "Side delts. Lead with elbows.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Cable Lateral Raises",
                  repsMin: "12–15",
                  notes: "Constant tension.",
                },
                {
                  weekNumber: 3,
                  name: "Bent-Over Reverse Flyes",
                  repsMin: "12–15",
                  notes: "Rear delts.",
                },
                {
                  weekNumber: 4,
                  name: "Upright Rows (Cable)",
                  repsMin: "10–12",
                  notes: "Front + side delts.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Bent-Over Lateral Raises",
              sets: 1,
              repsMin: 12,
              repsMax: 15,
              rpeTarget: 10,
              restSeconds: 60,
              notes: "Rear delts. Squeeze at top.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Face Pulls",
                  repsMin: "15–20",
                  notes: "Rear delts + rotator cuff.",
                },
                {
                  weekNumber: 3,
                  name: "Machine Reverse Flyes",
                  repsMin: "12–15",
                  notes: "Stable. Squeeze hard.",
                },
                {
                  weekNumber: 4,
                  name: "Single-Arm Cable Rear Delt",
                  repsMin: "12–15",
                  notes: "Each side. Isolate.",
                },
              ],
            },
          },
          {
            primary: {
              name: "Barbell Shrugs",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 10,
              restSeconds: 90,
              notes: "Hold at top. Squeeze traps.",
              variations: [
                {
                  weekNumber: 2,
                  name: "Dumbbell Shrugs",
                  repsMin: "12–15",
                  notes: "Deeper stretch.",
                },
                {
                  weekNumber: 3,
                  name: "Cable Shrugs",
                  repsMin: "15–20",
                  notes: "Constant tension.",
                },
                {
                  weekNumber: 4,
                  name: "Behind-The-Back Shrugs",
                  repsMin: "10–12",
                  notes: "Different angle.",
                },
              ],
            },
          },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TRAIN LIKE MIKE MENTZER — Heavy Duty HIT
// ─────────────────────────────────────────────────────────────────────────────
export const MENTZER_PROGRAM: ProgramTemplateDefinition = {
  id: "mentzer",
  title: "TRAIN LIKE MIKE MENTZER",
  subtitle: "Heavy Duty HIT",
  tagline: "One working set. Complete failure. Maximum recovery.",
  description:
    "Mike Mentzer's Heavy Duty philosophy is the ultimate test of intensity. One working set per exercise, taken to absolute muscular failure, followed by adequate recovery. Less frequency, higher intensity. The Mentzer way demands precision and brutal honesty.",
  difficulty: "Advanced",
  daysPerWeek: "3-4x/week",
  tags: ["Hypertrophy", "HIT", "Low Volume", "Recovery"],
  imageUrls: [
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Mike_Mentzer.jpg/250px-Mike_Mentzer.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Mm73D__comnPsYlVo0IUYSc0ADldXYCQvA&s",
  ],
  goalType: "muscle_building",
  environment: "gym",
  weeklyStructure: {
    rotationLength: 4,
    days: [
      {
        dayOfWeek: 1,
        label: "CHEST + BACK",
        focus: ["pectorals", "lats", "rhomboids"],
        warmup: {
          exercises: [
            { name: "Light cardio", duration: "5 min", notes: "" },
            { name: "Arm circles + band work", duration: "2 min", notes: "" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Incline Dumbbell Press",
              sets: 1,
              repsMin: 6,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 180,
              notes: "One all-out set. Pre-exhaust with flyes if advanced.",
              variations: [
                { weekNumber: 2, name: "Machine Press", repsMin: "8–10" },
                { weekNumber: 3, name: "Weighted Dips", repsMin: "6–8" },
                { weekNumber: 4, name: "Floor Press", repsMin: "6–8" },
              ],
            },
          },
          {
            primary: {
              name: "Pull-Ups (Wide Grip)",
              sets: 1,
              repsMin: 6,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 180,
              notes: "Full range. One set to failure.",
              variations: [
                { weekNumber: 2, name: "Lat Pulldowns", repsMin: "8–10" },
                { weekNumber: 3, name: "Cable Pulldowns (Reverse)", repsMin: "10–12" },
                { weekNumber: 4, name: "Seated Cable Rows", repsMin: "8–10" },
              ],
            },
          },
          {
            primary: {
              name: "Cable Flyes",
              sets: 1,
              repsMin: 10,
              repsMax: 15,
              rpeTarget: 10,
              restSeconds: 90,
              notes: "Pre-exhaust option. Squeeze at bottom.",
              variations: [
                { weekNumber: 2, name: "Dumbbell Flyes", repsMin: "10–12" },
                { weekNumber: 3, name: "Pec Deck", repsMin: "12–15" },
                { weekNumber: 4, name: "Push-Ups (Weighted)", repsMin: "To failure" },
              ],
            },
          },
          {
            primary: {
              name: "Barbell Rows",
              sets: 1,
              repsMin: 6,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 180,
              notes: "Explosive pull. Control negative.",
              variations: [
                { weekNumber: 2, name: "T-Bar Rows", repsMin: "8–10" },
                { weekNumber: 3, name: "One-Arm Dumbbell Rows", repsMin: "6–8" },
                { weekNumber: 4, name: "Chest-Supported Rows", repsMin: "10–12" },
              ],
            },
          },
        ],
      },
      {
        dayOfWeek: 4,
        label: "LEGS",
        focus: ["quadriceps", "hamstrings", "glutes"],
        warmup: {
          exercises: [
            { name: "Light cardio", duration: "7 min", notes: "" },
            { name: "Bodyweight squats", duration: "2 x 15", notes: "" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Squats",
              sets: 1,
              repsMin: 6,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 300,
              notes: "One all-out set. Depth is non-negotiable.",
              variations: [
                { weekNumber: 2, name: "Leg Press", repsMin: "10–15" },
                { weekNumber: 3, name: "Front Squats", repsMin: "8–10" },
                { weekNumber: 4, name: "Hack Squats", repsMin: "10–12" },
              ],
            },
          },
          {
            primary: {
              name: "Leg Extensions",
              sets: 1,
              repsMin: 10,
              repsMax: 15,
              rpeTarget: 10,
              restSeconds: 90,
              notes: "Pre-exhaust option. Squeeze at top.",
              variations: [
                { weekNumber: 2, name: "Bulgarian Split Squats", repsMin: "8–10" },
                { weekNumber: 3, name: "Goblet Squats", repsMin: "12–15" },
                { weekNumber: 4, name: "Sissy Squats", repsMin: "10–12" },
              ],
            },
          },
          {
            primary: {
              name: "Leg Curls",
              sets: 1,
              repsMin: 8,
              repsMax: 12,
              rpeTarget: 10,
              restSeconds: 120,
              notes: "Hamstring isolation. Hold at bottom.",
              variations: [
                { weekNumber: 2, name: "RDLs", repsMin: "8–10" },
                { weekNumber: 3, name: "Stiff-Legged Deadlifts", repsMin: "6–8" },
                { weekNumber: 4, name: "Nordic Curls", repsMin: "6–8" },
              ],
            },
          },
          {
            primary: {
              name: "Calf Raises",
              sets: 1,
              repsMin: 10,
              repsMax: 15,
              rpeTarget: 10,
              restSeconds: 60,
              notes: "Full stretch. Full contraction.",
              variations: [
                { weekNumber: 2, name: "Seated Calf Raises", repsMin: "15–20" },
                { weekNumber: 3, name: "Single-Leg Calf Raises", repsMin: "10–12" },
                { weekNumber: 4, name: "Donkey Calf Raises", repsMin: "12–15" },
              ],
            },
          },
        ],
      },
      {
        dayOfWeek: 6,
        label: "SHOULDERS + ARMS",
        focus: ["deltoids", "biceps", "triceps"],
        warmup: {
          exercises: [
            { name: "Band pull-aparts", duration: "2 x 20", notes: "" },
            { name: "Light lateral raises", duration: "1 x 15", notes: "" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Seated Dumbbell Press",
              sets: 1,
              repsMin: 6,
              repsMax: 10,
              rpeTarget: 10,
              restSeconds: 150,
              notes: "Strict form. No leg drive.",
              variations: [
                { weekNumber: 2, name: "Machine Press", repsMin: "10–12" },
                { weekNumber: 3, name: "Arnold Press", repsMin: "8–10" },
                { weekNumber: 4, name: "Cable Press", repsMin: "10–12" },
              ],
            },
          },
          {
            primary: {
              name: "Lateral Raises",
              sets: 1,
              repsMin: 10,
              repsMax: 15,
              rpeTarget: 10,
              restSeconds: 75,
              notes: "Side delts. Lead with elbows.",
              variations: [
                { weekNumber: 2, name: "Cable Lateral Raises", repsMin: "12–15" },
                { weekNumber: 3, name: "Machine Lateral Raises", repsMin: "12–15" },
                { weekNumber: 4, name: "Upright Rows", repsMin: "8–10" },
              ],
            },
          },
          {
            primary: {
              name: "Barbell Curls",
              sets: 1,
              repsMin: 8,
              repsMax: 12,
              rpeTarget: 10,
              restSeconds: 90,
              notes: "Strict form. No swinging.",
              variations: [
                { weekNumber: 2, name: "EZ-Bar Curls", repsMin: "10–12" },
                { weekNumber: 3, name: "Incline Dumbbell Curls", repsMin: "8–10" },
                { weekNumber: 4, name: "Hammer Curls", repsMin: "10–12" },
              ],
            },
          },
          {
            primary: {
              name: "Tricep Pushdowns",
              sets: 1,
              repsMin: 10,
              repsMax: 15,
              rpeTarget: 10,
              restSeconds: 75,
              notes: "Spread rope at bottom.",
              variations: [
                { weekNumber: 2, name: "Overhead Extensions", repsMin: "10–12" },
                { weekNumber: 3, name: "Skull Crushers", repsMin: "8–10" },
                { weekNumber: 4, name: "Close-Grip Bench", repsMin: "6–8" },
              ],
            },
          },
          {
            primary: {
              name: "Concentration Curls",
              sets: 1,
              repsMin: 10,
              repsMax: 15,
              rpeTarget: 10,
              restSeconds: 60,
              notes: "Peak contraction. Squeeze.",
              variations: [
                { weekNumber: 2, name: "Preacher Curls", repsMin: "10–12" },
                { weekNumber: 3, name: "Cable Curls", repsMin: "12–15" },
                { weekNumber: 4, name: "Spider Curls", repsMin: "10–12" },
              ],
            },
          },
          {
            primary: {
              name: "Overhead Tricep Extensions",
              sets: 1,
              repsMin: 10,
              repsMax: 15,
              rpeTarget: 10,
              restSeconds: 60,
              notes: "Long head stretch.",
              variations: [
                { weekNumber: 2, name: "Cable Kickbacks", repsMin: "12–15" },
                { weekNumber: 3, name: "Diamond Push-Ups", repsMin: "To failure" },
                { weekNumber: 4, name: "Rope Extensions", repsMin: "12–15" },
              ],
            },
          },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STEAL HYBRID — Strength + Size
// ─────────────────────────────────────────────────────────────────────────────
export const STEAL_HYBRID_PROGRAM: ProgramTemplateDefinition = {
  id: "steal-hybrid",
  title: "STEAL HYBRID",
  subtitle: "Strength + Size",
  tagline: "Compound strength. Hypertrophy accessory. Progressive overload.",
  description:
    "The Steal Hybrid program balances strength and hypertrophy. Monday/Thursday focus on heavy compound lifts. Wednesday/Saturday emphasize hypertrophy with higher volume. Progressive overload is built into every week.",
  difficulty: "Intermediate",
  daysPerWeek: "4x/week",
  tags: ["Hybrid", "Progressive", "Balanced", "Strength + Hypertrophy"],
  imageUrls: [
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800",
    "https://images.unsplash.com/photo-1541534741688-6078c69fb145?q=80&w=800",
  ],
  goalType: "muscle_building",
  environment: "gym",
  weeklyStructure: {
    rotationLength: 4,
    days: [
      {
        dayOfWeek: 1,
        label: "MONDAY — Strength (Upper)",
        focus: ["chest", "back", "shoulders"],
        warmup: {
          exercises: [
            { name: "Light cardio", duration: "5 min", notes: "" },
            { name: "Dynamic stretching", duration: "5 min", notes: "" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Bench Press",
              sets: 1,
              repsMin: 5,
              repsMax: 5,
              rpeTarget: 9,
              restSeconds: 300,
              notes: "Strength focus. Heavy. Progressive overload.",
              variations: [
                { weekNumber: 2, name: "Incline Barbell Press", repsMin: "5–6" },
                { weekNumber: 3, name: "Close-Grip Bench", repsMin: "5–6" },
                { weekNumber: 4, name: "Weighted Dips", repsMin: "5–6" },
              ],
            },
          },
          {
            primary: {
              name: "Pull-Ups (Weighted)",
              sets: 1,
              repsMin: 5,
              repsMax: 5,
              rpeTarget: 9,
              restSeconds: 240,
              notes: "Add weight. Strength focus.",
              variations: [
                { weekNumber: 2, name: "Barbell Rows", repsMin: "5–6" },
                { weekNumber: 3, name: "T-Bar Rows", repsMin: "5–6" },
                { weekNumber: 4, name: "One-Arm Dumbbell Rows", repsMin: "5–6" },
              ],
            },
          },
          {
            primary: {
              name: "Overhead Press (Standing)",
              sets: 1,
              repsMin: 5,
              repsMax: 5,
              rpeTarget: 9,
              restSeconds: 240,
              notes: "Strict form. Core tight.",
              variations: [
                { weekNumber: 2, name: "Arnold Press", repsMin: "6–8" },
                { weekNumber: 3, name: "Z-Press", repsMin: "5–6" },
                { weekNumber: 4, name: "Push Press", repsMin: "5–6" },
              ],
            },
          },
          {
            primary: {
              name: "Chin-Ups",
              sets: 1,
              repsMin: 6,
              repsMax: 8,
              rpeTarget: 9,
              restSeconds: 180,
              notes: "Bicep + back. Full range.",
              variations: [
                { weekNumber: 2, name: "Lat Pulldowns", repsMin: "8–10" },
                { weekNumber: 3, name: "Cable Pulldowns", repsMin: "8–10" },
                { weekNumber: 4, name: "Seated Cable Rows", repsMin: "8–10" },
              ],
            },
          },
        ],
      },
      {
        dayOfWeek: 3,
        label: "WEDNESDAY — Hypertrophy (Lower)",
        focus: ["quadriceps", "hamstrings", "glutes"],
        warmup: {
          exercises: [
            { name: "Light cardio", duration: "7 min", notes: "" },
            { name: "Dynamic leg swings", duration: "3 min", notes: "" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Squats",
              sets: 1,
              repsMin: 8,
              repsMax: 10,
              rpeTarget: 9,
              restSeconds: 240,
              notes: "Hypertrophy rep range. Controlled.",
              variations: [
                { weekNumber: 2, name: "Front Squats", repsMin: "8–10" },
                { weekNumber: 3, name: "Goblet Squats", repsMin: "10–12" },
                { weekNumber: 4, name: "Hack Squats", repsMin: "10–12" },
              ],
            },
          },
          {
            primary: {
              name: "Romanian Deadlifts",
              sets: 1,
              repsMin: 8,
              repsMax: 10,
              rpeTarget: 9,
              restSeconds: 180,
              notes: "Hamstring stretch. Control negative.",
              variations: [
                { weekNumber: 2, name: "Leg Press", repsMin: "10–12" },
                { weekNumber: 3, name: "Bulgarian Split Squats", repsMin: "8–10" },
                { weekNumber: 4, name: "Lunges (Walking)", repsMin: "10–12" },
              ],
            },
          },
          {
            primary: {
              name: "Leg Extensions",
              sets: 1,
              repsMin: 12,
              repsMax: 15,
              rpeTarget: 9,
              restSeconds: 90,
              notes: "Quad burn. Squeeze at top.",
              variations: [
                { weekNumber: 2, name: "Leg Curls", repsMin: "12–15" },
                { weekNumber: 3, name: "Sissy Squats", repsMin: "10–12" },
                { weekNumber: 4, name: "Single-Leg Extensions", repsMin: "12–15" },
              ],
            },
          },
          {
            primary: {
              name: "Calf Raises",
              sets: 1,
              repsMin: 15,
              repsMax: 20,
              rpeTarget: 9,
              restSeconds: 60,
              notes: "High reps. Full range.",
              variations: [
                { weekNumber: 2, name: "Seated Calf Raises", repsMin: "15–20" },
                { weekNumber: 3, name: "Single-Leg Calf Raises", repsMin: "12–15" },
                { weekNumber: 4, name: "Donkey Calf Raises", repsMin: "15–20" },
              ],
            },
          },
        ],
      },
      {
        dayOfWeek: 4,
        label: "THURSDAY — Strength (Lower)",
        focus: ["quadriceps", "hamstrings", "glutes"],
        warmup: {
          exercises: [
            { name: "Light cardio", duration: "7 min", notes: "" },
            { name: "Bodyweight squats", duration: "2 x 15", notes: "" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Deadlifts",
              sets: 1,
              repsMin: 5,
              repsMax: 5,
              rpeTarget: 9,
              restSeconds: 300,
              notes: "Strength focus. Heavy. Perfect form.",
              variations: [
                { weekNumber: 2, name: "Trap Bar Deadlifts", repsMin: "5–6" },
                { weekNumber: 3, name: "Deficit Deadlifts", repsMin: "4–5" },
                { weekNumber: 4, name: "Rack Pulls", repsMin: "3–5" },
              ],
            },
          },
          {
            primary: {
              name: "Front Squats",
              sets: 1,
              repsMin: 6,
              repsMax: 8,
              rpeTarget: 9,
              restSeconds: 240,
              notes: "Quad focus. Chest up.",
              variations: [
                { weekNumber: 2, name: "Box Squats", repsMin: "5–6" },
                { weekNumber: 3, name: "Zercher Squats", repsMin: "5–6" },
                { weekNumber: 4, name: "Safety Bar Squats", repsMin: "5–6" },
              ],
            },
          },
          {
            primary: {
              name: "Leg Press",
              sets: 1,
              repsMin: 8,
              repsMax: 10,
              rpeTarget: 9,
              restSeconds: 180,
              notes: "Feet low for quads.",
              variations: [
                { weekNumber: 2, name: "Hack Squats", repsMin: "8–10" },
                { weekNumber: 3, name: "Bulgarian Split Squats", repsMin: "6–8" },
                { weekNumber: 4, name: "Sissy Squats", repsMin: "8–10" },
              ],
            },
          },
          {
            primary: {
              name: "Calf Raises (Standing)",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 9,
              restSeconds: 60,
              notes: "Heavy. Full stretch.",
              variations: [
                { weekNumber: 2, name: "Seated Calf Raises", repsMin: "12–15" },
                { weekNumber: 3, name: "Single-Leg Calf Raises", repsMin: "10–12" },
                { weekNumber: 4, name: "Donkey Calf Raises", repsMin: "10–12" },
              ],
            },
          },
        ],
      },
      {
        dayOfWeek: 6,
        label: "SATURDAY — Hypertrophy (Upper)",
        focus: ["chest", "back", "shoulders", "arms"],
        warmup: {
          exercises: [
            { name: "Band work", duration: "5 min", notes: "" },
            { name: "Light push-ups", duration: "1 x 15", notes: "" },
          ],
        },
        exercises: [
          {
            primary: {
              name: "Incline Dumbbell Press",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 9,
              restSeconds: 120,
              notes: "Upper chest. Full stretch.",
              variations: [
                { weekNumber: 2, name: "Flat Dumbbell Press", repsMin: "10–12" },
                { weekNumber: 3, name: "Machine Press", repsMin: "12–15" },
                { weekNumber: 4, name: "Cable Crossover Press", repsMin: "12–15" },
              ],
            },
          },
          {
            primary: {
              name: "Lat Pulldowns",
              sets: 1,
              repsMin: 10,
              repsMax: 12,
              rpeTarget: 9,
              restSeconds: 120,
              notes: "Wide grip. Squeeze at bottom.",
              variations: [
                { weekNumber: 2, name: "Cable Rows", repsMin: "10–12" },
                { weekNumber: 3, name: "Single-Arm Pulldowns", repsMin: "10–12" },
                { weekNumber: 4, name: "Dumbbell Pullovers", repsMin: "12–15" },
              ],
            },
          },
          {
            primary: {
              name: "Lateral Raises",
              sets: 1,
              repsMin: 12,
              repsMax: 15,
              rpeTarget: 9,
              restSeconds: 60,
              notes: "Side delts. Constant tension.",
              variations: [
                { weekNumber: 2, name: "Cable Lateral Raises", repsMin: "15–20" },
                { weekNumber: 3, name: "Machine Lateral Raises", repsMin: "12–15" },
                { weekNumber: 4, name: "Bent-Over Reverse Flyes", repsMin: "15–20" },
              ],
            },
          },
          {
            primary: {
              name: "Bicep Curls",
              sets: 1,
              repsMin: 12,
              repsMax: 15,
              rpeTarget: 9,
              restSeconds: 60,
              notes: "Strict form. Squeeze at top.",
              variations: [
                { weekNumber: 2, name: "Hammer Curls", repsMin: "12–15" },
                { weekNumber: 3, name: "Preacher Curls", repsMin: "10–12" },
                { weekNumber: 4, name: "Cable Curls", repsMin: "15–20" },
              ],
            },
          },
          {
            primary: {
              name: "Tricep Pushdowns",
              sets: 1,
              repsMin: 12,
              repsMax: 15,
              rpeTarget: 9,
              restSeconds: 60,
              notes: "Spread rope. Squeeze.",
              variations: [
                { weekNumber: 2, name: "Overhead Extensions", repsMin: "12–15" },
                { weekNumber: 3, name: "Skull Crushers", repsMin: "10–12" },
                { weekNumber: 4, name: "Cable Kickbacks", repsMin: "15–20" },
              ],
            },
          },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export all programs
// ─────────────────────────────────────────────────────────────────────────────
export const PROGRAM_TEMPLATES: ProgramTemplateDefinition[] = [
  YATES_PROGRAM,
  MENTZER_PROGRAM,
  STEAL_HYBRID_PROGRAM,
];

/**
 * Get a program template by ID
 */
export function getProgramTemplate(id: string): ProgramTemplateDefinition | undefined {
  return PROGRAM_TEMPLATES.find((p) => p.id === id);
}

/**
 * Get exercise name for a specific week based on rotation
 */
export function getExerciseForWeek(
  exercise: ExerciseWithVariations,
  weekNumber: number
): { 
  name: string; 
  sets: number; 
  repsMin: number | string; 
  repsMax: number | string; 
  restSeconds: number;
  notes?: string 
} {
  // Find variation for this week, or use primary
  const variation = exercise.variations.find((v: ExerciseVariationDef) => v.weekNumber === weekNumber);
  
  if (variation) {
    return {
      name: variation.name,
      sets: variation.sets ?? exercise.sets,
      repsMin: variation.repsMin ?? exercise.repsMin,
      repsMax: variation.repsMax ?? exercise.repsMax,
      restSeconds: exercise.restSeconds,
      notes: variation.notes ?? exercise.notes,
    };
  }
  
  // If no specific variation, cycle through available variations
  if (exercise.variations.length > 0) {
    const cycleIndex = ((weekNumber - 1) % exercise.variations.length);
    const cycleVar = exercise.variations[cycleIndex];
    return {
      name: cycleVar.name,
      sets: cycleVar.sets ?? exercise.sets,
      repsMin: cycleVar.repsMin ?? exercise.repsMin,
      repsMax: cycleVar.repsMax ?? exercise.repsMax,
      restSeconds: exercise.restSeconds,
      notes: cycleVar.notes ?? exercise.notes,
    };
  }
  
  return {
    name: exercise.name,
    sets: exercise.sets,
    repsMin: exercise.repsMin,
    repsMax: exercise.repsMax,
    restSeconds: exercise.restSeconds,
    notes: exercise.notes,
  };
}

/**
 * Check if a plan week is complete (all days completed)
 */
export function isWeekComplete(
  weekDays: Array<{ isCompleted: boolean; hasSession: boolean }>,
  currentWeek: number
): boolean {
  const weekDaysForCurrent = weekDays.filter((d) => d.isCompleted || d.hasSession);
  return weekDaysForCurrent.length > 0; // At least one day done means in progress
}