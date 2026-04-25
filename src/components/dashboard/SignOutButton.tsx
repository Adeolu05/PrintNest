"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getBrowserSupabase } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = getBrowserSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
