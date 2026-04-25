import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/section";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { getSessionUser } from "@/server/auth";
import { getStoreByUser } from "@/server/repositories/stores";
import { hasServerSupabase } from "@/server/supabase";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) redirect("/login");
  const ownerId = user?.id ?? "local-user";
  const store = await getStoreByUser(ownerId).catch(() => null);
  if (!store) redirect("/dashboard/onboarding");

  return (
    <div>
      <PageHeader title="Settings" description="Update profile, contact details, and currency." />
      <Card>
        <CardHeader>
          <CardTitle>Store profile</CardTitle>
        </CardHeader>
        <CardBody>
          <SettingsForm
            storeId={store.id}
            initial={{
              storeName: store.store_name,
              artistName: store.artist_name,
              whatsappNumber: store.whatsapp_number,
              instagramUrl: store.instagram_url ?? "",
              tiktokUrl: store.tiktok_url ?? "",
              xUrl: store.x_url ?? "",
              currency: store.currency,
              country: store.country ?? "",
              city: store.city ?? "",
              bio: store.bio ?? "",
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
