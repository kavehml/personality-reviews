import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth-utils";
import { RestaurantDetail } from "@/components/restaurant-detail";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          author: { select: { id: true, name: true, email: true } },
          authorCohort: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!restaurant) notFound();

  let userInterests: string[] = [];
  let userCohortId: string | null = null;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { interests: true, cohortId: true },
    });
    if (user) {
      try {
        userInterests = JSON.parse(user.interests || "[]");
      } catch {
        userInterests = [];
      }
      userCohortId = user.cohortId;
    }
  }

  return (
    <RestaurantDetail
      restaurant={restaurant}
      currentUserCohortId={userCohortId}
      userInterests={userInterests}
    />
  );
}
