"use client";

import { useState } from "react";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
};

export function AdminUsersTable({ users }: { users: UserRow[] }) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateRole(userId: string, role: "USER" | "ADMIN") {
    setError("");
    setBusyId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error ?? "Failed to update role");
      } else {
        window.location.reload();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  async function removeUser(userId: string) {
    if (!confirm("Delete this user? Their reviews will also be removed.")) return;
    setError("");
    setBusyId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data?.error ?? "Failed to delete user");
      } else {
        window.location.reload();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-4">
      <h2 className="text-sm font-medium text-stone-500">All users</h2>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u.id}
            className="border border-stone-200 rounded-lg p-3 flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-sm font-medium text-stone-900">{u.email}</p>
              <p className="text-xs text-stone-500">
                {u.name || "No name"} · {u.role} · Joined {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {u.role === "USER" ? (
                <button
                  onClick={() => updateRole(u.id, "ADMIN")}
                  disabled={busyId === u.id}
                  className="px-3 py-1.5 text-xs rounded bg-amber-100 text-amber-800 hover:bg-amber-200 disabled:opacity-50"
                >
                  Make admin
                </button>
              ) : (
                <button
                  onClick={() => updateRole(u.id, "USER")}
                  disabled={busyId === u.id}
                  className="px-3 py-1.5 text-xs rounded bg-stone-200 text-stone-800 hover:bg-stone-300 disabled:opacity-50"
                >
                  Make user
                </button>
              )}
              <button
                onClick={() => removeUser(u.id)}
                disabled={busyId === u.id}
                className="px-3 py-1.5 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

