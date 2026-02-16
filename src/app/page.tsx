import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 flex justify-between items-center border-b border-stone-200">
        <span className="text-xl font-semibold text-amber-700">Personality Reviews</span>
        <nav className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-stone-600 hover:text-stone-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">
          Reviews from people like you
        </h1>
        <p className="text-lg text-stone-600 mb-8">
          Two people might both rate a restaurant 5 stars, but their reasons matter.
          See and prioritize reviews from people with similar personality types—so you
          know what to expect before you go.
        </p>
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-stone-300 rounded-lg font-medium hover:bg-stone-100"
          >
            Log in
          </Link>
        </div>

        <div className="mt-16 text-left w-full">
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <ol className="space-y-3 text-stone-600">
            <li>
              <strong className="text-stone-900">1. Take a short quiz</strong> — Answer 10 questions to discover your dining personality type (Explorer, Planner, Foodie, Value-Seeker, or Minimalist).
            </li>
            <li>
              <strong className="text-stone-900">2. Browse restaurants</strong> — Explore restaurants in Montreal and Toronto (more cities coming soon).
            </li>
            <li>
              <strong className="text-stone-900">3. See cohort-matched reviews</strong> — Prioritize reviews from your cohort, or filter by others. A match score shows how relevant each review is to you.
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
}
