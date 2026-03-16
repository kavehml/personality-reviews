import Link from "next/link";

type Props = {
  active: "overview" | "personality";
};

export function ProfileTabs({ active }: Props) {
  return (
    <div className="mb-4 border-b border-stone-200">
      <nav className="flex gap-4">
        <Link
          href="/profile"
          className={
            active === "overview"
              ? "px-3 py-2 border-b-2 border-amber-600 text-amber-700 text-sm font-medium"
              : "px-3 py-2 text-sm text-stone-600 hover:text-stone-900"
          }
        >
          Overview
        </Link>
        <Link
          href="/profile/personality"
          className={
            active === "personality"
              ? "px-3 py-2 border-b-2 border-amber-600 text-amber-700 text-sm font-medium"
              : "px-3 py-2 text-sm text-stone-600 hover:text-stone-900"
          }
        >
          Personality insights
        </Link>
      </nav>
    </div>
  );
}

