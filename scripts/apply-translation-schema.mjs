#!/usr/bin/env node
/**
 * Create (or patch) the `exercise_translations` collection on a remote
 * PocketBase instance. Idempotent — safe to re-run.
 *
 * Usage:
 *   node --env-file=.env.local scripts/apply-translation-schema.mjs
 *
 * Required env:
 *   NEXT_PUBLIC_API_URL (or POCKETBASE_URL)
 *   POCKETBASE_ADMIN_EMAIL
 *   POCKETBASE_ADMIN_PASSWORD
 */

import PocketBase from "pocketbase";

const PB_URL =
  process.env.POCKETBASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8090";
const ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing env: POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD",
  );
  process.exit(1);
}

const pb = new PocketBase(PB_URL);
try {
  await pb
    .collection("_superusers")
    .authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log(`✓ authed as ${ADMIN_EMAIL} → ${PB_URL}`);
} catch (err) {
  console.error("✗ superuser auth failed:", err.message || err);
  process.exit(1);
}

const COLLECTION_NAME = "exercise_translations";

// ── Full target field list (both migrations merged) ────────────────────────
const TARGET_FIELDS = [
  {
    id: "exercise_translations_exerciseExtId",
    name: "exerciseExtId",
    type: "text",
    required: false,
    presentable: true,
    hidden: false,
    max: 64,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_locale",
    name: "locale",
    type: "select",
    required: true,
    presentable: false,
    hidden: false,
    maxSelect: 1,
    values: ["en", "ru", "uz"],
  },
  {
    id: "exercise_translations_name",
    name: "name",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: 200,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_overview",
    name: "overview",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: null,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_bodyPart",
    name: "bodyPart",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: 100,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_equipment",
    name: "equipment",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: 100,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_target",
    name: "target",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: 100,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_muscleGroup",
    name: "muscleGroup",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: 100,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_category",
    name: "category",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: 50,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_difficulty",
    name: "difficulty",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: 50,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_secondaryMuscles",
    name: "secondaryMuscles",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: null,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_instructions",
    name: "instructions",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: null,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_exerciseTips",
    name: "exerciseTips",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: null,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_variations",
    name: "variations",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: null,
    min: null,
    pattern: "",
  },
  {
    id: "exercise_translations_description",
    name: "description",
    type: "text",
    required: false,
    presentable: false,
    hidden: false,
    max: null,
    min: null,
    pattern: "",
  },
];

const TARGET_INDEXES = [
  "CREATE UNIQUE INDEX idx_exercise_translations_extid ON exercise_translations (exerciseExtId, locale)",
  "CREATE INDEX idx_exercise_translations_locale ON exercise_translations (locale)",
];

// ── Create or patch ────────────────────────────────────────────────────────
let collection;
try {
  collection = await pb.collections.getOne(COLLECTION_NAME);
  console.log(`✓ found existing collection "${COLLECTION_NAME}" — patching…`);

  const existingByName = new Map(
    (collection.fields || []).map((f) => [f.name, f]),
  );
  let added = 0;
  let updated = 0;

  // Merge TARGET_FIELDS into the existing field list, updating properties
  // (e.g. max limits) on fields that already exist.
  const nextFields = collection.fields.map((existing) => {
    const target = TARGET_FIELDS.find((t) => t.name === existing.name);
    if (!target) return existing;
    const merged = { ...existing, ...target };
    if (JSON.stringify(merged) !== JSON.stringify(existing)) {
      updated++;
      console.log(`  ~ updating field "${existing.name}"`);
    } else {
      console.log(`  = field "${existing.name}" already present`);
    }
    return merged;
  });

  for (const f of TARGET_FIELDS) {
    if (!existingByName.has(f.name)) {
      nextFields.push(f);
      added++;
      console.log(`  + adding field "${f.name}"`);
    }
  }

  // Rebuild indexes — drop stale, add desired
  const finalIndexes = TARGET_INDEXES.slice();
  console.log(`  fields: ${collection.fields.length} → ${nextFields.length} (+${added} added, ~${updated} updated)`);

  await pb.collections.update(collection.id, {
    fields: nextFields,
    indexes: finalIndexes,
  });
  console.log("✓ collection patched");
} catch (err) {
  if (!err.message?.includes("wasn't found") && err.status !== 404) {
    console.error("✗ unexpected error:", err.message || err);
    process.exit(1);
  }

  // Collection doesn't exist — create it
  console.log(`→ collection "${COLLECTION_NAME}" not found — creating…`);
  try {
    await pb.collections.create({
      id: "exercisetranslations01",
      name: COLLECTION_NAME,
      type: "base",
      system: false,
      listRule: "@request.auth.id != \"\"",
      viewRule: "@request.auth.id != \"\"",
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: TARGET_FIELDS,
      indexes: TARGET_INDEXES,
    });
    console.log(`✓ collection "${COLLECTION_NAME}" created`);
  } catch (createErr) {
    console.error("✗ create failed:", createErr.message || createErr);
    if (createErr.response) console.error(JSON.stringify(createErr.response, null, 2));
    process.exit(1);
  }
}

// ── Verify ─────────────────────────────────────────────────────────────────
const verified = await pb.collections.getOne(COLLECTION_NAME);
const have = new Set(verified.fields.map((f) => f.name));
const missing = TARGET_FIELDS.map((f) => f.name).filter((n) => !have.has(n));
if (missing.length) {
  console.error("✗ verification: missing fields:", missing.join(", "));
  process.exit(1);
}
console.log("✓ verification OK — all target fields present");
