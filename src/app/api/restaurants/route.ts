import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth-utils";
import { createLocationSchema } from "@/lib/validations";

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(restaurants);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createLocationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { slug: parsed.data.categorySlug },
      select: { name: true, slug: true },
    });
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const location = await prisma.restaurant.create({
      data: {
        name: parsed.data.name,
        city: parsed.data.city,
        cuisine: `${category.name} · ${parsed.data.detail}`,
        description: parsed.data.description,
      },
    });

    return NextResponse.json(location);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
