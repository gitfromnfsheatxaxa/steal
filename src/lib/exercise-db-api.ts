/**
 * ExerciseDB API wrapper — self-hosted instance of
 * https://github.com/exercisedb/exercisedb-api deployed to Vercel.
 *
 * Configure via NEXT_PUBLIC_EXERCISEDB_URL in .env.local, e.g.:
 *   NEXT_PUBLIC_EXERCISEDB_URL=https://<your-project>.vercel.app/api/v1
 *
 * No auth headers — the self-hosted instance is public.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_EXERCISEDB_URL || "http://localhost:3001/api/v1";

export interface ExerciseV2 {
  exerciseId: string;
  name: string;
  gifUrl: string;
  bodyParts: string[];
  equipments: string[];
  targetMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  // Fields below are present on the richer upstream API but not on all
  // self-hosted forks — keep optional so the type doesn't lie.
  imageUrl?: string;
  videoUrl?: string;
  exerciseTips?: string[];
  variations?: string[];
  overview?: string;
  keywords?: string[];
  category?: string;
  difficulty?: string;
  relatedExerciseIds?: string[];
}

interface Paged<T> {
  success?: boolean;
  data: T;
  metadata?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

async function apiGet<T>(path: string, revalidate = 3600): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    next: { revalidate },
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(
      `ExerciseDB API error: ${response.status} ${response.statusText} — ${url}`,
    );
  }
  const body = (await response.json()) as T | Paged<T>;
  if (body && typeof body === "object" && "data" in (body as object)) {
    return (body as Paged<T>).data;
  }
  return body as T;
}

export async function fetchExercises(
  limit = 100,
  offset = 0,
): Promise<ExerciseV2[]> {
  return apiGet<ExerciseV2[]>(`/exercises?limit=${limit}&offset=${offset}`);
}

export async function getExerciseById(
  exerciseId: string,
): Promise<ExerciseV2> {
  return apiGet<ExerciseV2>(`/exercises/${encodeURIComponent(exerciseId)}`);
}

export async function searchExercisesByName(
  query: string,
): Promise<ExerciseV2[]> {
  return apiGet<ExerciseV2[]>(
    `/exercises/search?q=${encodeURIComponent(query)}`,
  );
}

export async function getExercisesByBodyPart(
  bodyPart: string,
): Promise<ExerciseV2[]> {
  return apiGet<ExerciseV2[]>(
    `/exercises/filter?bodyParts=${encodeURIComponent(bodyPart)}`,
  );
}

export async function getExercisesByEquipment(
  equipment: string,
): Promise<ExerciseV2[]> {
  return apiGet<ExerciseV2[]>(
    `/exercises/filter?equipments=${encodeURIComponent(equipment)}`,
  );
}

export async function getExercisesByTargetMuscle(
  target: string,
): Promise<ExerciseV2[]> {
  return apiGet<ExerciseV2[]>(
    `/exercises/filter?targetMuscles=${encodeURIComponent(target)}`,
  );
}

type NamedEntry = { name: string } | string;

function toNames(list: NamedEntry[]): string[] {
  return list
    .map((item) =>
      typeof item === "string" ? item : (item?.name ?? ""),
    )
    .filter((name): name is string => Boolean(name));
}

export async function getBodyParts(): Promise<string[]> {
  const raw = await apiGet<NamedEntry[]>(`/bodyparts`, 86400);
  return toNames(raw);
}

export async function getEquipmentList(): Promise<string[]> {
  const raw = await apiGet<NamedEntry[]>(`/equipments`, 86400);
  return toNames(raw);
}

export async function getTargetMuscleList(): Promise<string[]> {
  const raw = await apiGet<NamedEntry[]>(`/muscles`, 86400);
  return toNames(raw);
}
