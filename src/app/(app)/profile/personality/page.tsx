import { auth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileTabs } from "@/components/profile-tabs";
import Link from "next/link";

export default async function PersonalityProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { cohort: true },
  });

  if (!user) redirect("/login");

  const cohortName = user.cohort?.name ?? "Not set yet";
  const cohortDescription =
    user.cohort?.description ??
    "Complete the short quiz to discover your dining personality and see tailored insights.";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <ProfileTabs active="personality" />

      <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-6">
        <section>
          <h2 className="text-sm font-medium text-stone-500">
            Your personality cohort
          </h2>
          <p className="mt-2">
            {user.cohort ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                {cohortName}
              </span>
            ) : (
              "You haven’t completed the personality quiz yet."
            )}
          </p>
          <p className="mt-2 text-stone-600 text-sm">{cohortDescription}</p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-medium text-stone-500">
            What this means for your reviews
          </h3>
          <ul className="list-disc pl-5 text-sm text-stone-600 space-y-1">
            <li>
              Restaurant pages will highlight reviews from diners who share your
              cohort first.
            </li>
            <li>
              The match score combines cohort, rating, and your saved interests
              to surface reviews that are more likely to feel “right” to you.
            </li>
            <li>
              As you refine your interests, your matches will become more
              personalized over time.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-medium text-stone-500">
            Want to update your results?
          </h3>
          <p className="text-sm text-stone-600">
            If your tastes change, you can retake the quiz at any time. We’ll
            keep your review history but update how we match you with other
            diners.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700"
          >
            Retake personality quiz
          </Link>
        </section>
      </div>
    </div>
  );
}

