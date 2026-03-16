import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export async function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { quizCompleted: true },
  });
  // Allow users to retake the quiz even if they've completed it before.
  // We only enforce authentication here; quiz completion is checked elsewhere.
  return <>{children}</>;
}
