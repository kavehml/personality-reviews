import { prisma } from "@/lib/prisma";
import { RequireAdmin } from "@/components/require-admin";
import { CategoryCreateForm } from "@/components/category-create-form";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <RequireAdmin>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Place categories</h1>
        <p className="text-sm text-stone-600 mb-6">
          Use categories to group different types of places like restaurants,
          attractions, cinemas, cafés, and more. For now, these categories are
          used behind the scenes, but future versions can attach reviews to any
          type of place.
        </p>
        <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
          <h2 className="text-sm font-medium text-stone-500">Existing categories</h2>
          <CategoryCreateForm />
          {categories.length === 0 ? (
            <p className="text-sm text-stone-500">No categories yet.</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex items-start justify-between gap-4 border border-stone-200 rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {cat.name}
                      <span className="ml-2 text-xs text-stone-500">
                        ({cat.slug})
                      </span>
                    </p>
                    {cat.description && (
                      <p className="text-xs text-stone-600 mt-1">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-stone-400">
            Note: Creating and editing categories can be added here later. For
            now, seed data provides a few common types.
          </p>
        </div>
      </div>
    </RequireAdmin>
  );
}

