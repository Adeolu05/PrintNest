import { redirect } from "next/navigation";
import { Sidebar, MobileTabs } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { getSessionUser } from "@/server/auth";
import { getStoreByUser } from "@/server/repositories/stores";
import { hasServerSupabase } from "@/server/supabase";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // In dev without Supabase configured we still let the dashboard render with
  // a stub user so artists can preview the UI. In production, redirect to login.
  if (!user && hasServerSupabase()) {
    redirect("/login");
  }

  const ownerId = user?.id ?? "local-user";
  const store = await getStoreByUser(ownerId).catch(() => null);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar
          storeSlug={store?.store_slug ?? null}
          isPublished={store?.is_published}
          email={user?.email ?? null}
        />
        <div className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </div>
        <MobileTabs />
      </div>
    </div>
  );
}
