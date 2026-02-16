import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { quizCompleted: true },
  });
  if (user?.quizCompleted) redirect("/restaurants");

  return <>{children}</>;
}
