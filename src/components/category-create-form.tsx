"use client";

import { useState } from "react";

export function CategoryCreateForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to create category");
        setLoading(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="border border-stone-200 rounded-lg p-4 space-y-3">
      <h3 className="text-sm font-medium text-stone-700">Add category</h3>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (e.g. Attraction)"
          className="px-3 py-2 border border-stone-300 rounded-lg"
          required
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug (e.g. attraction)"
          className="px-3 py-2 border border-stone-300 rounded-lg"
          required
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg"
        rows={2}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Create category"}
      </button>
    </form>
  );
}

