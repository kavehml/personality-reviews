import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    if (!restaurant) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(restaurant);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
