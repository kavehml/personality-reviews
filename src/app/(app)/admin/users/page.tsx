import { prisma } from "@/lib/prisma";
import { RequireAdmin } from "@/components/require-admin";
import { AdminUsersTable } from "@/components/admin-users-table";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <RequireAdmin>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Admin: Users</h1>
        <p className="text-sm text-stone-600 mb-6">
          Manage user roles and remove users. Admins can promote or demote users
          between USER and ADMIN.
        </p>
        <AdminUsersTable
          users={users.map((u) => ({
            ...u,
            createdAt: u.createdAt.toISOString(),
          }))}
        />
      </div>
    </RequireAdmin>
  );
}

