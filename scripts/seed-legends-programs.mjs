#!/usr/bin/env node
/**
 * Seed 7 Legends Training Programs into plan_templates (EN + RU + UZ).
 * Each record stores all 3 locales inside structure.locales.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-legends-programs.mjs
 *
 * Resumable — .legends-cache.json caches parsed/translated data.
 * Re-run after failure; cached steps are skipped.
 */

import PocketBase from "pocketbase";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const MD_PATH    = join(__dir, "../7-legends-training-program.md");
const CACHE_PATH = join(__dir, "../.legends-cache.json");

// ── Env ────────────────────────────────────────────────────────────────────
const PB_URL    = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8090";
const PB_EMAIL  = process.env.POCKETBASE_ADMIN_EMAIL;
const PB_PASS   = process.env.POCKETBASE_ADMIN_PASSWORD;

const CEREBRAS_MAIN = process.env.CEREBRAS_API_KEY;
const CEREBRAS_RU   = process.env.CEREBRAS_API_KEY_RU;
const CEREBRAS_UZ   = process.env.CEREBRAS_API_KEY_UZ;
const GEMINI_KEY    = process.env.GEMINI_API_KEY;
const AI_MODEL      = process.env.AI_MODEL      || "qwen-3-235b-a22b-instruct-2507";
const GEMINI_MODEL  = process.env.GEMINI_MODEL  || "gemini-2.0-flash";

if (!PB_EMAIL || !PB_PASS) { console.error("✗ Missing POCKETBASE_ADMIN_EMAIL / POCKETBASE_ADMIN_PASSWORD"); process.exit(1); }
if (!CEREBRAS_MAIN && !GEMINI_KEY) { console.error("✗ No AI key found (need CEREBRAS_API_KEY or GEMINI_API_KEY)"); process.exit(1); }

// ── Helpers ────────────────────────────────────────────────────────────────
function extractFirstJSON(text) {
  const s = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```(?:json)?\s*/gi, "")
    .replace(/```/g, "");
  const oi = s.indexOf("{"), ai = s.indexOf("[");
  const start = oi === -1 ? ai : ai === -1 ? oi : Math.min(oi, ai);
  if (start === -1) throw new Error("No JSON found in response");
  const open = s[start], close = open === "{" ? "}" : "]";
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (esc)        { esc = false; continue; }
    if (c === "\\") { esc = true;  continue; }
    if (c === '"')  { inStr = !inStr; continue; }
    if (inStr)      continue;
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return s.slice(start, i + 1); }
  }
  throw new Error("Unbalanced JSON in response");
}

function repairJSON(raw) {
  return raw
    .replace(/,\s*,+/g, ",")       // double/triple commas
    .replace(/,\s*}/g, "}")         // trailing comma before }
    .replace(/,\s*]/g, "]")         // trailing comma before ]
    .replace(/(['"])?([a-zA-Z_][a-zA-Z0-9_]*)\1\s*:/g, '"$2":');  // unquoted keys (safety)
}

function parseJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    try {
      return JSON.parse(repairJSON(raw));
    } catch (e2) {
      throw new Error(`JSON parse failed after repair: ${e2.message}`);
    }
  }
}

async function callCerebras(apiKey, system, prompt, maxTokens = 16000) {
  const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: AI_MODEL,
      messages: [{ role: "system", content: system }, { role: "user", content: prompt }],
      max_tokens: maxTokens,
    }),
  });
  if (!res.ok) throw new Error(`Cerebras ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()).choices[0].message.content;
}

async function callGemini(system, prompt) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) process.env.GOOGLE_GENERATIVE_AI_API_KEY = GEMINI_KEY;
  const { google }       = await import("@ai-sdk/google");
  const { generateText } = await import("ai");
  const { text } = await generateText({ model: google(GEMINI_MODEL), system, prompt });
  return text;
}

async function callAI(key, system, prompt, maxTokens = 16000) {
  if (key && key.startsWith("csk-")) return callCerebras(key, system, prompt, maxTokens);
  if (GEMINI_KEY) return callGemini(system, prompt);
  throw new Error("No AI key available");
}

async function callAIWithRetry(key, system, prompt, maxTokens = 16000, retries = 4) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callAI(key, system, prompt, maxTokens);
    } catch (err) {
      const isRateLimit = /429|rate.?limit|quota|too_many/i.test(err.message);
      if (attempt === retries) {
        // Final fallback: try Gemini if available and different from current key
        if (isRateLimit && GEMINI_KEY) {
          console.warn(`    ⚠ Falling back to Gemini…`);
          return callGemini(system, prompt);
        }
        throw err;
      }
      const wait = isRateLimit ? attempt * 12000 : attempt * 5000;
      console.warn(`    ⚠ Attempt ${attempt} failed: ${err.message.slice(0, 80)}. Retrying in ${wait / 1000}s…`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

// ── Cache ──────────────────────────────────────────────────────────────────
let cache = existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, "utf8")) : {};
const saveCache = () => writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));

// ── Split markdown into 7 program sections ─────────────────────────────────
const markdown = readFileSync(MD_PATH, "utf8");
const lines = markdown.split("\n");
const boundaries = lines.reduce((acc, line, i) => (/^## \d+\./.test(line) ? [...acc, i] : acc), []);
const summaryIdx = lines.findIndex(l => /^## SUMMARY/.test(l));

const rawSections = boundaries.map((start, i) => {
  const end = i + 1 < boundaries.length ? boundaries[i + 1] : (summaryIdx > -1 ? summaryIdx : lines.length);
  return lines.slice(start, end).join("\n");
});

if (rawSections.length !== 7) {
  console.error(`✗ Expected 7 program sections, found ${rawSections.length}`);
  process.exit(1);
}

const SLUGS = ["arnold", "platz", "piana", "mentzer", "yates", "ronnie", "nippard"];
const DIFFICULTIES = {
  arnold: "advanced", platz: "advanced", piana: "advanced",
  mentzer: "advanced", yates: "advanced", ronnie: "advanced", nippard: "intermediate",
};
const GOAL_TYPES = {
  arnold: "muscle_building", platz: "muscle_building", piana: "muscle_building",
  mentzer: "strength", yates: "strength", ronnie: "muscle_building", nippard: "muscle_building",
};

console.log(`→ Found ${rawSections.length} program sections`);

// ── Prompts ────────────────────────────────────────────────────────────────
const PARSE_SYSTEM = `You are a fitness data engineer. Parse training program markdown into structured JSON.
Return ONLY raw JSON — no markdown fences, no explanation, no text before or after the JSON.`;

function buildParsePrompt(section) {
  return `Parse this training program into a JSON object with EXACTLY this structure:
{
  "slug": "<arnold|platz|piana|mentzer|yates|ronnie|nippard>",
  "title": "<full program title as written>",
  "description": "<2-3 sentence program description capturing the training philosophy>",
  "overview": {
    "split": "<training split description>",
    "bestFor": "<who this is best for>",
    "characteristics": ["<key characteristic 1>", "<key characteristic 2>", "<key characteristic 3>"]
  },
  "days": [
    {
      "dayNumber": 1,
      "label": "<day label e.g. CHEST>",
      "isRest": false,
      "exercises": [
        {
          "name": "<exercise name>",
          "sets": "<full sets description e.g. '2 warm-up + 4 working × 8-10'>",
          "repsRange": "<e.g. '8-10'>",
          "restSeconds": <number — convert '2-3 minutes' to 150, '90 seconds' to 90, '60 seconds' to 60, '3 minutes' to 180, '5 minutes' to 300>,
          "tempo": "<e.g. '2-0-1-0'>",
          "notes": "<coaching notes, remove surrounding parentheses>"
        }
      ]
    },
    {
      "dayNumber": 7,
      "label": "REST",
      "isRest": true,
      "activities": ["<rest activity 1>", "<rest activity 2>"]
    }
  ],
  "guidelines": {
    "progression": ["<progression point 1>", "<progression point 2>"],
    "deload": ["<deload point 1>"],
    "recovery": ["<recovery point 1>", "<recovery point 2>"]
  }
}

Program section to parse:
${section}`;
}

const RU_SYSTEM = `Ты — профессиональный переводчик фитнес-контента с английского на русский язык. Используй живой профессиональный язык фитнес-индустрии.
АБСОЛЮТНЫЕ ПРАВИЛА:
• Отвечай ТОЛЬКО JSON — без markdown, без тройных апострофов, без объяснений.
• Переводи ВСЕ текстовые поля: title, description, overview.*text, label, name, sets, notes, activities, guidelines.*.
• НЕ переводи и не меняй: slug, isRest, restSeconds, tempo, dayNumber, repsRange.`;

const UZ_SYSTEM = `Siz ingliz tilidan o'zbek tiliga (lotin yozuvi) fitness kontentini tarjima qiluvchi professional tarjimon.
MUTLAQ QOIDALAR:
• FAQAT JSON bilan javob bering — markdown yo'q, tushuntirish yo'q.
• BARCHA matn maydonlarini tarjima qiling: title, description, overview.*text, label, name, sets, notes, activities, guidelines.*.
• TARJIMA QILMANG: slug, isRest, restSeconds, tempo, dayNumber, repsRange.`;

function buildTranslatePrompt(enData, locale) {
  const lang = locale === "ru" ? "Russian" : "Uzbek (Latin script)";
  return `Translate all text fields from English to ${lang}. Keep slug, isRest, restSeconds, tempo, dayNumber, repsRange unchanged. Return ONLY the translated JSON:

${JSON.stringify(enData, null, 0)}`;
}

// ── PocketBase ─────────────────────────────────────────────────────────────
const pb = new PocketBase(PB_URL);
try {
  await pb.collection("_superusers").authWithPassword(PB_EMAIL, PB_PASS);
  console.log("✓ PocketBase authenticated\n");
} catch (err) {
  console.error("✗ PocketBase auth failed:", err.message);
  process.exit(1);
}

async function upsertTemplate(record) {
  const opts = { requestKey: null };
  try {
    const existing = await pb.collection("plan_templates")
      .getFirstListItem(`title="${record.title.replace(/"/g, '\\"')}"`, opts);
    await pb.collection("plan_templates").update(existing.id, record, opts);
    return "updated";
  } catch {
    await pb.collection("plan_templates").create(record, opts);
    return "created";
  }
}

// ── Process each program ───────────────────────────────────────────────────
for (let i = 0; i < 7; i++) {
  const slug = SLUGS[i];
  const section = rawSections[i];
  const tag = `[${slug.toUpperCase().padEnd(7)}]`;

  cache[slug] ||= {};

  // Step 1: Parse EN
  let enData = cache[slug].en;
  if (enData) {
    console.log(`${tag} ✓ EN (cached)`);
  } else {
    process.stdout.write(`${tag} Parsing EN…`);
    const key = CEREBRAS_MAIN || GEMINI_KEY;
    const raw = await callAIWithRetry(key, PARSE_SYSTEM, buildParsePrompt(section), 16000);
    enData = parseJSON(extractFirstJSON(raw));
    enData.slug = slug; // enforce correct slug
    cache[slug].en = enData;
    saveCache();
    console.log(` ✓ (${enData.days.length} days, ${enData.days.reduce((s, d) => s + (d.exercises?.length || 0), 0)} exercises)`);
  }

  // Step 2: Translate RU + UZ in parallel
  let ruData = cache[slug].ru;
  let uzData = cache[slug].uz;

  const tasks = [];

  async function translateWithRetry(key, system, locale, retries = 4) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const raw = await callAI(key, system, buildTranslatePrompt(enData, locale), 16000);
        const parsed = parseJSON(extractFirstJSON(raw));
        parsed.slug = slug;
        return parsed;
      } catch (err) {
        const isRateLimit = /429|rate.?limit|quota|too_many/i.test(err.message);
        if (attempt === retries) {
          if (GEMINI_KEY) {
            console.warn(`    ⚠ ${locale.toUpperCase()} falling back to Gemini…`);
            const raw = await callGemini(system, buildTranslatePrompt(enData, locale));
            const parsed = parseJSON(extractFirstJSON(raw));
            parsed.slug = slug;
            return parsed;
          }
          throw err;
        }
        const wait = isRateLimit ? attempt * 12000 : attempt * 6000;
        console.warn(`    ⚠ ${locale.toUpperCase()} attempt ${attempt} failed: ${err.message.slice(0, 80)}. Retry in ${wait / 1000}s…`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }

  if (!ruData) {
    tasks.push(
      translateWithRetry(CEREBRAS_RU || CEREBRAS_MAIN, RU_SYSTEM, "ru")
        .then(parsed => {
          ruData = parsed;
          cache[slug].ru = ruData;
          saveCache();
          console.log(`${tag} ✓ RU translated`);
        })
    );
  } else {
    console.log(`${tag} ✓ RU (cached)`);
  }

  if (!uzData) {
    tasks.push(
      translateWithRetry(CEREBRAS_UZ || CEREBRAS_MAIN, UZ_SYSTEM, "uz")
        .then(parsed => {
          uzData = parsed;
          cache[slug].uz = uzData;
          saveCache();
          console.log(`${tag} ✓ UZ translated`);
        })
    );
  } else {
    console.log(`${tag} ✓ UZ (cached)`);
  }

  if (tasks.length > 0) await Promise.all(tasks);

  // Step 3: Post to PocketBase
  const record = {
    title:         enData.title,
    description:   enData.description,
    goalType:      GOAL_TYPES[slug] || "muscle_building",
    environment:   "gym",
    difficulty:    DIFFICULTIES[slug] || "advanced",
    durationWeeks: 1,
    popularity:    97 - i,
    structure: {
      slug,
      locales: { en: enData, ru: ruData, uz: uzData },
    },
  };

  const action = await upsertTemplate(record);
  console.log(`${tag} ✓ plan_templates ${action}: "${enData.title}"\n`);
}

console.log("✓ All 7 legends programs seeded successfully!");
