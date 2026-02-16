import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileInterests } from "@/components/profile-interests";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { cohort: true },
  });

  if (!user) redirect("/login");

  let interests: string[] = [];
  try {
    interests = JSON.parse(user.interests || "[]");
  } catch {
    interests = [];
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-sm font-medium text-stone-500">Email</h2>
          <p className="mt-1">{user.email}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-stone-500">Name</h2>
          <p className="mt-1">{user.name || "—"}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-stone-500">Personality cohort</h2>
          <p className="mt-1">
            {user.cohort ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                {user.cohort.name}
              </span>
            ) : (
              "—"
            )}
          </p>
          {user.cohort?.description && (
            <p className="mt-1 text-stone-600 text-sm">{user.cohort.description}</p>
          )}
        </div>
        <ProfileInterests initialInterests={interests} />
      </div>
    </div>
  );
}
