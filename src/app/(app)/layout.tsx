import { RequireQuiz } from "@/components/require-quiz";
import { AppNav } from "@/components/app-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireQuiz>
      <div className="min-h-screen flex flex-col">
        <AppNav />
        <main className="flex-1">{children}</main>
      </div>
    </RequireQuiz>
  );
}
