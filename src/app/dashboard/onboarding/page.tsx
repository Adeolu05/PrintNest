import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/dashboard/OnboardingForm";
import { PageHeader } from "@/components/ui/section";
import { getSessionUser } from "@/server/auth";
import { getStoreByUser } from "@/server/repositories/stores";
import { hasServerSupabase } from "@/server/supabase";

export const metadata = { title: "Set up your store" };

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) redirect("/login");

  const ownerId = user?.id ?? "local-user";
  const existing = await getStoreByUser(ownerId).catch(() => null);
  if (existing) {
    redirect("/dashboard");
  }

  return (
    <div>
      <PageHeader
        title="Set up your store"
        description="Tell us about you. We'll generate your storefront URL and recommended theme."
      />
      <OnboardingForm
        defaultName={user?.fullName ?? ""}
        defaultEmail={user?.email ?? ""}
      />
    </div>
  );
}
