import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-utils";

export async function RequireAdmin({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role !== "ADMIN") {
    redirect("/restaurants");
  }

  return <>{children}</>;
}

