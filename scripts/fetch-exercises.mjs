import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "../src/data/exercises.json");
const BASE_URL = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main";
const DATA_URL = `${BASE_URL}/data/exercises.json`;

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log("Fetching exercises dataset...");
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  const raw = await res.json();
  console.log(`Downloaded ${raw.length} records.`);

  const slugCount = new Map();

  const exercises = raw.map((record) => {
    const baseSlug = toSlug(record.name ?? "exercise");
    const count = (slugCount.get(baseSlug) ?? 0) + 1;
    slugCount.set(baseSlug, count);
    const slug = count === 1 ? baseSlug : `${baseSlug}-${count}`;

    return {
      id: String(record.id),
      name: String(record.name ?? ""),
      slug,
      category: String(record.category ?? ""),
      bodyPart: String(record.body_part ?? ""),
      equipment: String(record.equipment ?? ""),
      muscleGroup: String(record.muscle_group ?? ""),
      secondaryMuscles: Array.isArray(record.secondary_muscles)
        ? record.secondary_muscles.map(String)
        : [],
      target: String(record.target ?? ""),
      instructions: String(record.instructions?.en ?? ""),
      steps: Array.isArray(record.instruction_steps?.en)
        ? record.instruction_steps.en.map(String)
        : [],
      image: record.image ? `${BASE_URL}/${record.image}` : "",
      gif: record.gif_url ? `${BASE_URL}/${record.gif_url}` : "",
    };
  });

  // Second pass: resolve slug collisions that arose from count > 1
  // (The map above already handles suffix, but we need unique final slugs)
  const slugSeen = new Set();
  for (const ex of exercises) {
    if (slugSeen.has(ex.slug)) {
      let i = 2;
      while (slugSeen.has(`${ex.slug}-${i}`)) i++;
      ex.slug = `${ex.slug}-${i}`;
    }
    slugSeen.add(ex.slug);
  }

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(exercises, null, 2), "utf8");

  const bytes = Buffer.byteLength(JSON.stringify(exercises, null, 2), "utf8");
  console.log(`Written ${exercises.length} exercises to src/data/exercises.json`);
  console.log(`File size: ${(bytes / 1024).toFixed(1)} KB (${bytes} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
