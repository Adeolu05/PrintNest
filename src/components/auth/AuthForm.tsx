"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, FormField } from "@/components/ui/input";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

type Mode = "signup" | "login";

export function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!isSupabaseConfigured) {
      setError(
        "Supabase isn't configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable real auth.",
      );
      return;
    }
    const supabase = getBrowserSupabase();
    if (!supabase) {
      setError("Auth client unavailable. Try refreshing the page.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (err) throw err;
        if (!data.session) {
          setInfo("Check your email to confirm your account, then sign in.");
          setLoading(false);
          return;
        }
        await persistSession(data.session.access_token);
        router.push("/dashboard/onboarding");
        return;
      }

      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) throw err;
      if (data.session?.access_token) {
        await persistSession(data.session.access_token);
      }
      router.push("/dashboard");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" ? (
        <FormField label="Your name" required>
          <Input
            placeholder="Tola Adebayo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>
      ) : null}
      <FormField label="Email" required>
        <Input
          type="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </FormField>
      <FormField label="Password" required hint="Use at least 8 characters.">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </FormField>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950">
          {info}
        </p>
      ) : null}
      <Button type="submit" loading={loading} fullWidth size="lg">
        {mode === "signup" ? "Create my store" : "Sign in"}
      </Button>
    </form>
  );
}

async function persistSession(accessToken: string) {
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });
}
