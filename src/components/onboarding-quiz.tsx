"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS } from "@/lib/quiz-questions";

export function OnboardingQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const q = QUIZ_QUESTIONS[step];
  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100;

  function handleNext() {
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      submitQuiz();
    }
  }

  function handlePrev() {
    if (step > 0) setStep(step - 1);
  }

  async function submitQuiz() {
    setError("");
    setLoading(true);
    const answerList = Object.entries(answers)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => ({ questionId: parseInt(k, 10), answerIndex: v }));
    if (answerList.length !== QUIZ_QUESTIONS.length) {
      setError("Please answer all questions.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answerList }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to submit");
        setLoading(false);
        return;
      }
      router.push("/restaurants");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Personality quiz</h1>
        <p className="text-stone-600 mb-6">
          Answer a few questions so we can match you with reviewers who share your style.
        </p>

        <div className="mb-6 h-2 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-white rounded-lg border border-stone-200 p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-4">{q.text}</h2>
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <label
                key={i}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-stone-50 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50"
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === i}
                  onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                  className="text-amber-600"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={answers[q.id] === undefined}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === QUIZ_QUESTIONS.length - 1
              ? loading
                ? "Submitting…"
                : "Finish"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
