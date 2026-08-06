import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAll } from "@/lib/announcements";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  const initial = await getAll();
  return <AdminDashboard initial={initial} />;
}
