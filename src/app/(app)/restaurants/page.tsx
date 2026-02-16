import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function RestaurantsPage() {
  const restaurants = await prisma.restaurant.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurants</h1>
      <p className="text-stone-600 mb-8">
        Browse restaurants in Montreal and Toronto. Click to see reviews and prioritize those from your cohort.
      </p>

      <div className="grid gap-4">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            href={`/restaurants/${r.id}`}
            className="block p-4 bg-white border border-stone-200 rounded-lg hover:border-amber-400 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg">{r.name}</h2>
            <p className="text-sm text-stone-500">
              {r.cuisine} · {r.city}
            </p>
            <p className="text-stone-600 text-sm mt-1 line-clamp-2">{r.description}</p>
          </Link>
        ))}
      </div>

      {restaurants.length === 0 && (
        <p className="text-stone-500">
          No restaurants yet. Run <code className="bg-stone-100 px-1 rounded">npm run seed</code> to add sample data.
        </p>
      )}
    </div>
  );
}
