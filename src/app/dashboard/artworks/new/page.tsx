import { redirect } from "next/navigation";
import { ArtworkForm } from "@/components/dashboard/ArtworkForm";
import { PageHeader } from "@/components/ui/section";
import { getSessionUser } from "@/server/auth";
import { getStoreByUser } from "@/server/repositories/stores";
import { hasServerSupabase } from "@/server/supabase";

export const metadata = { title: "New artwork" };

export default async function NewArtworkPage() {
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) redirect("/login");
  const ownerId = user?.id ?? "local-user";
  const store = await getStoreByUser(ownerId).catch(() => null);
  // If we don't have a store yet (Supabase or local cookie), send the artist
  // back to onboarding regardless of mode. Without a store we can't link
  // artworks to anything sensible.
  if (!store) redirect("/dashboard/onboarding");

  return (
    <div>
      <PageHeader
        title="Upload artwork"
        description="Drop an image, let AI draft the copy, and set print sizes."
      />
      <ArtworkForm storeCurrency={store?.currency ?? "NGN"} />
    </div>
  );
}
