import { notFound } from "next/navigation";
import { findExerciseBySlug } from "@/lib/exercise-library";
import { ExerciseDetailView } from "./ExerciseDetailView";

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const ex = await findExerciseBySlug(slug);
  if (!ex) return {};
  return { title: `${ex.name} | Exercise Library | Steel Therapy` };
}

export default async function ExerciseDetailPage({ params }: Props) {
  const { slug } = await params;
  const exercise = await findExerciseBySlug(slug);
  if (!exercise) notFound();

  return <ExerciseDetailView baseExercise={exercise} />;
}
