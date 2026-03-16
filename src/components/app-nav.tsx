"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/restaurants" className="text-lg font-semibold text-amber-700">
          Personality Reviews
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/restaurants"
            className={pathname?.startsWith("/restaurants") ? "text-amber-600 font-medium" : "text-stone-600 hover:text-stone-900"}
          >
            Restaurants
          </Link>
          <Link
            href="/profile"
            className={pathname?.startsWith("/profile") ? "text-amber-600 font-medium" : "text-stone-600 hover:text-stone-900"}
          >
            Profile
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-stone-500 hover:text-stone-700 text-sm"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
