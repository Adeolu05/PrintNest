import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/section";
import { AIStudio } from "@/components/dashboard/AIStudio";
import { getSessionUser } from "@/server/auth";
import { hasServerSupabase } from "@/server/supabase";

export const metadata = { title: "AI Studio" };

export default async function AIStudioPage() {
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) redirect("/login");

  return (
    <div>
      <PageHeader
        title="AI Studio"
        description="Generate captions, bios, announcements, and SEO copy on demand."
      />
      <Card>
        <CardHeader>
          <CardTitle>Quick generators</CardTitle>
        </CardHeader>
        <CardBody>
          <AIStudio />
        </CardBody>
      </Card>
    </div>
  );
}
