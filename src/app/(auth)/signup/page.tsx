import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = { title: "Create your store" };

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
        Create your PrintNest store
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
        It takes about 60 seconds. You can upload artwork next.
      </p>
      <div className="mt-6">
        <AuthForm mode="signup" />
      </div>
      <p className="mt-6 text-sm text-zinc-500">
        Already have a store?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-white">
          Sign in
        </Link>
      </p>
    </div>
  );
}
