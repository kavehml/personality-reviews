import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assignCohortFromAnswers } from "@/lib/cohorts";
import { z } from "zod";

const submitSchema = z.object({
  answers: z.array(z.object({
    questionId: z.number(),
    answerIndex: z.number(),
  })),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { answers } = parsed.data;
    const answerIndices = answers.sort((a, b) => a.questionId - b.questionId).map((a) => a.answerIndex);
    const cohortName = assignCohortFromAnswers(answerIndices);
    const cohort = await prisma.cohort.findFirst({ where: { name: cohortName } });
    if (!cohort) {
      return NextResponse.json({ error: "Cohort not found" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.quizAnswer.deleteMany({ where: { userId: session.user.id } }),
      prisma.quizAnswer.createMany({
        data: parsed.data.answers.map((a) => ({
          userId: session.user!.id,
          questionId: a.questionId,
          answerIndex: a.answerIndex,
        })),
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { cohortId: cohort.id, quizCompleted: true },
      }),
    ]);

    return NextResponse.json({ cohortId, cohortName: cohort.name });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
