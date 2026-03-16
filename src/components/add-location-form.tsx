"use client";

import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function AddLocationForm({ categories }: { categories: Category[] }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [detail, setDetail] = useState("");
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, detail, description, categorySlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to add location");
        setLoading(false);
        return;
      }
      setSuccess("Location added. Refreshing list...");
      setName("");
      setCity("");
      setDetail("");
      setDescription("");
      setTimeout(() => window.location.reload(), 600);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white border border-stone-200 rounded-lg p-4 space-y-3">
      <h2 className="font-semibold">Add a new place</h2>
      <p className="text-xs text-stone-500">
        Any logged-in user can add new places (restaurants, attractions, cinemas, etc.).
      </p>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {success && <p className="text-sm text-green-700">{success}</p>}
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Place name"
          className="px-3 py-2 border border-stone-300 rounded-lg"
          required
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="px-3 py-2 border border-stone-300 rounded-lg"
          required
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          className="px-3 py-2 border border-stone-300 rounded-lg"
          required
        >
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Type detail (e.g. Thai, Museum, IMAX)"
          className="px-3 py-2 border border-stone-300 rounded-lg"
          required
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description"
        className="w-full px-3 py-2 border border-stone-300 rounded-lg"
        rows={3}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add place"}
      </button>
    </form>
  );
}

