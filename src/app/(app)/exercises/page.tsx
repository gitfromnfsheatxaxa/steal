export const dynamic = 'force-dynamic';
import { getAllExercises, getFilterOptions } from "@/lib/exercise-library";
import { ExercisePageHeader } from "./ExercisePageHeader";
import { ExerciseLibrary } from "./ExerciseLibrary";

export const metadata = {
  title: "Exercise Library | Steal Therapy",
};

export default async function ExercisesPage() {
  const [filters, all] = await Promise.all([
    getFilterOptions(),
    getAllExercises(),
  ]);

  return (
    <div className="space-y-6 py-6">
      <ExercisePageHeader count={all.length} />
      <ExerciseLibrary filters={filters} />
    </div>
  );
}
