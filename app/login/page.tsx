import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { login } from "@/app/actions";
import { isAdmin } from "@/lib/auth";

const ERROR_MESSAGES: Record<string, string> = {
  missing: "Email and password are required.",
  invalid: "Invalid email or password.",
  rate_limited: "Too many sign-in attempts. Please try again in a few minutes.",
  unavailable: "Sign-in is not configured on this server.",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense>
      <LoginForm searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) {
    redirect("/");
  }

  const { error } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] ?? "Something went wrong." : null;

  return (
    <div className="min-h-dvh bg-[#f6f4f1] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-semibold text-stone-800 text-lg tracking-wide">Admin login</h1>
          <p className="mt-1 text-sm text-stone-500">Sign in to edit the infographic.</p>
        </div>

        <form action={login} className="space-y-4 bg-white/90 border border-stone-200/80 rounded-xl p-6">
          <div>
            <label htmlFor="email" className="block text-sm text-stone-600 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-stone-600 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
          </div>

          {errorMessage && <p className="text-sm text-rose-700">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full text-sm px-4 py-2 rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-colors"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-stone-600 hover:text-teal-800 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
