import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./client";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getSession();

  // Basic security check: ensure user is logged in
  if (!session) {
    redirect("/auth");
  }

  // Ensure user is an ADMIN
  if (session.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-red-100">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">
            You do not have permission to view the Admin Dashboard. Only accounts with the ADMIN role can access this page.
          </p>
          <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl text-left">
            <strong>How to fix this:</strong>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Open Prisma Studio in your terminal.</li>
              <li>Go to the <code>User</code> table.</li>
              <li>Find your email address.</li>
              <li>Change your <code>role</code> from "USER" to "ADMIN".</li>
              <li>Refresh this page.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Fetch all colleges securely on the server
  const colleges = await prisma.college.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <main className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* Background gradients similar to the rest of the app */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-gray-50 to-white -z-10" />
      <AdminDashboardClient initialColleges={colleges} />
    </main>
  );
}
