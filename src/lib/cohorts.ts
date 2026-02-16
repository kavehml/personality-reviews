export const COHORTS = [
  { id: "explorer", name: "Explorer", description: "Loves trying new things and adventurous dining" },
  { id: "planner", name: "Planner", description: "Values structure, reservations, and predictable quality" },
  { id: "foodie", name: "Foodie", description: "Prioritizes cuisine quality and culinary experiences" },
  { id: "value-seeker", name: "Value-Seeker", description: "Focuses on bang-for-buck and practicality" },
  { id: "minimalist", name: "Minimalist", description: "Prefers simple, authentic, no-fuss experiences" },
] as const;

export type CohortId = (typeof COHORTS)[number]["id"];

// Simple cohort assignment: map answer indices to cohorts (0-4)
// Quiz has 10 questions; we sum answer indices and mod by 5
// Returns cohort name (used to look up in DB)
export function assignCohortFromAnswers(answers: number[]): string {
  const sum = answers.reduce((a, b) => a + b, 0);
  const idx = sum % COHORTS.length;
  return COHORTS[idx].name;
}
