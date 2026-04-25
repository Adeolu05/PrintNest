import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
        Sign in
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        Welcome back.
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Sign in to manage your storefront, AI copy, and orders.
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-sm text-zinc-500">
        Don&apos;t have a store yet?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:underline dark:text-blue-300"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
