import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Create your store" };

export default function SignupPage() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
        Get started · Free
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        Create your PrintNest store.
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        It takes about 60 seconds. You can upload artwork right after.
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
      <p className="mt-6 text-sm text-zinc-500">
        Already have a store?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline dark:text-blue-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
