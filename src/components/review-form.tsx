"use client";

import { useState } from "react";
import { TAG_OPTIONS } from "@/lib/validations";

type Props = {
  restaurantId: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export function ReviewForm({ restaurantId, onSuccess, onCancel }: Props) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title,
          content,
          tags,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to post review");
        setLoading(false);
        return;
      }
      onSuccess();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white border border-stone-200 rounded-lg mb-6"
    >
      <h3 className="font-semibold mb-4">Write a review</h3>
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`text-xl ${rating >= n ? "text-amber-500" : "text-stone-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Review
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            maxLength={2000}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags (optional)</label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  tags.includes(tag)
                    ? "bg-amber-100 text-amber-800"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
        >
          {loading ? "Posting…" : "Post review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
