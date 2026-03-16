import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { cohort: true },
  });
  if (!user?.cohortId) {
    return NextResponse.json(
      { error: "Complete the personality quiz first" },
      { status: 400 }
    );
  }

  try {
    const { id: restaurantId } = await params;
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const tags = parsed.data.tags ?? [];
    const review = await prisma.review.create({
      data: {
        restaurantId,
        authorId: session.user.id,
        authorCohortId: user.cohortId,
        rating: parsed.data.rating,
        title: parsed.data.title,
        content: parsed.data.content,
        tags: JSON.stringify(tags),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        authorCohort: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(review);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
