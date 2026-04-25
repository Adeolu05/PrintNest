import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Welcome back</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        Sign in to manage your storefront and orders.
      </p>
      <div className="mt-6">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-sm text-zinc-500">
        Don&apos;t have a store yet?{" "}
        <Link href="/signup" className="font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-white">
          Create one
        </Link>
      </p>
    </div>
  );
}
