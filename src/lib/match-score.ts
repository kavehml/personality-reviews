export function computeMatchScore(params: {
  sameCohort: boolean;
  rating: number;
  userInterests: string[];
  reviewTags: string[];
}): number {
  const { sameCohort, rating, userInterests, reviewTags } = params;
  let score = sameCohort ? 50 : 0;
  score += rating * 10;
  const overlap = userInterests.filter((i) => reviewTags.includes(i)).length;
  score += overlap * 5;
  return Math.min(100, score);
}
