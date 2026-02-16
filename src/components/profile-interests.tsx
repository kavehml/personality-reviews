"use client";

import { useState } from "react";
import { INTEREST_OPTIONS } from "@/lib/validations";

type Props = {
  initialInterests: string[];
};

export function ProfileInterests({ initialInterests }: Props) {
  const [interests, setInterests] = useState<string[]>(initialInterests);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function toggle(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
    setSaved(false);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/profile/interests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests }),
      });
      if (res.ok) {
        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-sm font-medium text-stone-500">
        Your interests (affects match score)
      </h2>
      <p className="text-xs text-stone-400 mt-0.5">
        Select what matters to you in reviews
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {INTEREST_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-full text-sm ${
              interests.includes(opt)
                ? "bg-amber-100 text-amber-800"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : saved ? "Saved" : "Save interests"}
      </button>
    </div>
  );
}
