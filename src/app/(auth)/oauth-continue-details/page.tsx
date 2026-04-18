"use client";

import { useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RegisterDetailsForm from "@/components/auth/RegisterDetailsForm";
import { useGoogleComplete } from "@/hooks/useAuth";

function OAuthContinueDetailsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeGoogleSignup, loading, error } = useGoogleComplete();

  const incompleteToken = useMemo(
    () => searchParams.get("incompleteToken") || "",
    [searchParams],
  );

  const email = useMemo(
    () => searchParams.get("email") || "your email",
    [searchParams],
  );

  const handleComplete = async (details: {
    displayName: string;
    dob: string;
    gender: string;
  }) => {
    if (!incompleteToken) {
      return;
    }

    const result = await completeGoogleSignup(
      incompleteToken,
      details.dob,
      details.gender,
    );

    if (result) {
      router.push("/home");
    }
  };

  return (
    <main className="min-h-dvh bg-chinese-black px-4 py-8 sm:px-6">
      <div className="mx-auto mt-6 w-full max-w-xl sm:mt-12">
        {!incompleteToken ? (
          <section className="rounded-sm border border-white/10 bg-chinese-black px-5 py-8 text-white-smoke sm:px-8 sm:py-10">
            <h1 className="text-xl font-bold">Unable to continue Google sign-in</h1>
            <p className="mt-3 text-sm text-white-smoke/90">
              Missing or expired continuation token. Please start Google sign-in again.
            </p>
            <button
              type="button"
              onClick={() => router.push("/sign-in")}
              className="mt-6 h-10 rounded-md bg-white-smoke px-5 text-sm font-semibold text-chinese-black cursor-pointer"
            >
              Back to sign in
            </button>
          </section>
        ) : (
          <section className="rounded-sm border border-white/10 bg-chinese-black px-5 py-8 sm:px-8 sm:py-10">
            <RegisterDetailsForm
              email={email}
              requireDisplayName={true}
              submitError={error}
              isSubmitting={loading}
              onBack={() => router.push("/sign-in")}
              onComplete={handleComplete}
            />
          </section>
        )}
      </div>
    </main>
  );
}

export default function OAuthContinueDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-chinese-black" />}>
      <OAuthContinueDetailsForm />
    </Suspense>
  );
}