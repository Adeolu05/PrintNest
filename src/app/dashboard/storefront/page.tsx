import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/section";
import { StorefrontEditor } from "@/components/dashboard/StorefrontEditor";
import { getSessionUser } from "@/server/auth";
import { getStoreByUser } from "@/server/repositories/stores";
import { hasServerSupabase } from "@/server/supabase";

export const metadata = { title: "Storefront" };

export default async function StorefrontEditorPage() {
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) redirect("/login");
  const store = user ? await getStoreByUser(user.id).catch(() => null) : null;
  if (!store) redirect("/dashboard/onboarding");

  return (
    <div>
      <PageHeader
        title="Storefront"
        description="Tweak your hero, theme, and contact details."
      />
      <Card>
        <CardHeader>
          <CardTitle>Live editor</CardTitle>
        </CardHeader>
        <CardBody>
          <StorefrontEditor
            storeId={store.id}
            initial={{
              themeId: store.theme_id,
              accentColor: store.accent_color ?? "#111111",
              displayMode: store.display_mode,
              heroHeadline: store.hero_headline ?? "",
              heroSubheadline: store.hero_subheadline ?? "",
              bio: store.bio ?? "",
              isPublished: store.is_published,
              storeSlug: store.store_slug,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
