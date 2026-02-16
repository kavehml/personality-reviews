"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ReviewForm } from "./review-form";
import { computeMatchScore } from "@/lib/match-score";

type RestaurantWithReviews = {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  description: string;
  reviews: Array<{
    id: string;
    rating: number;
    title: string;
    content: string;
    tags: string;
    createdAt: string;
    author: { id: string; name: string | null };
    authorCohort: { id: string; name: string };
  }>;
};

type Props = {
  restaurant: RestaurantWithReviews;
  currentUserCohortId: string | null;
  userInterests: string[];
};

type FilterMode = "my-cohort" | "all" | "other";
type SortMode = "relevant" | "newest" | "rating";

export function RestaurantDetail({
  restaurant,
  currentUserCohortId,
  userInterests,
}: Props) {
  const [filter, setFilter] = useState<FilterMode>("my-cohort");
  const [cohortFilter, setCohortFilter] = useState<string>("");
  const [sort, setSort] = useState<SortMode>("relevant");
  const [showForm, setShowForm] = useState(false);

  const cohorts = useMemo(() => {
    const set = new Set(restaurant.reviews.map((r) => r.authorCohort.name));
    return Array.from(set).sort();
  }, [restaurant.reviews]);

  const filteredAndSortedReviews = useMemo(() => {
    let list = restaurant.reviews;

    if (filter === "my-cohort" && currentUserCohortId) {
      list = list.filter((r) => r.authorCohort.id === currentUserCohortId);
    } else if (filter === "other" && cohortFilter) {
      list = list.filter((r) => r.authorCohort.name === cohortFilter);
    }

    const withScore = list.map((r) => ({
      ...r,
      matchScore: computeMatchScore({
        sameCohort: r.authorCohort.id === currentUserCohortId,
        rating: r.rating,
        userInterests,
        reviewTags: parseTags(r.tags),
      }),
    }));

    if (sort === "relevant") {
      withScore.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sort === "newest") {
      withScore.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      withScore.sort((a, b) => b.rating - a.rating);
    }

    return withScore;
  }, [
    restaurant.reviews,
    filter,
    cohortFilter,
    sort,
    currentUserCohortId,
    userInterests,
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/restaurants"
        className="text-amber-600 hover:underline mb-4 inline-block"
      >
        ← Back to restaurants
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        <p className="text-stone-500">{restaurant.cuisine} · {restaurant.city}</p>
        <p className="text-stone-600 mt-2">{restaurant.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-700">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterMode)}
            className="px-3 py-1.5 border border-stone-300 rounded-lg text-sm"
          >
            <option value="my-cohort">My cohort</option>
            <option value="all">All reviews</option>
            <option value="other">Other cohort</option>
          </select>
        </div>
        {filter === "other" && (
          <select
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
            className="px-3 py-1.5 border border-stone-300 rounded-lg text-sm"
          >
            <option value="">Select cohort</option>
            {cohorts.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-stone-700">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="px-3 py-1.5 border border-stone-300 rounded-lg text-sm"
          >
            <option value="relevant">Most relevant</option>
            <option value="newest">Newest</option>
            <option value="rating">Highest rating</option>
          </select>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="ml-auto px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
        >
          {showForm ? "Cancel" : "Write a review"}
        </button>
      </div>

      {showForm && (
        <ReviewForm
          restaurantId={restaurant.id}
          onSuccess={() => {
            setShowForm(false);
            window.location.reload();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-4 mt-6">
        {filteredAndSortedReviews.length === 0 ? (
          <p className="text-stone-500 py-8">
            No reviews match your filters.
          </p>
        ) : (
          filteredAndSortedReviews.map((r) => (
            <div
              key={r.id}
              className="p-4 bg-white border border-stone-200 rounded-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium">{r.title}</h3>
                  <p className="text-sm text-stone-500">
                    {r.author.name || "Anonymous"} · {r.authorCohort.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-amber-600 font-medium">
                      {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    </span>
                    {currentUserCohortId && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                        Match {r.matchScore}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-stone-600">{r.content}</p>
              {parseTags(r.tags).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {parseTags(r.tags).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-stone-100 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-stone-400 mt-2">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function parseTags(tagsJson: string): string[] {
  try {
    const arr = JSON.parse(tagsJson || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
