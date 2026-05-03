"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const client = searchParams.get("client")?.toLowerCase();
    const storedClient = window.localStorage.getItem("beatza:auth-client")?.toLowerCase();
    const isAndroidClient = client === "android" || storedClient === "android";

    if (isAndroidClient) {
      window.localStorage.setItem("beatza:auth-client", "Android");

      const accessToken = searchParams.get("accessToken") || searchParams.get("token");
      const refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description") || searchParams.get("message");

      if (accessToken || refreshToken || error) {
        const params = new URLSearchParams();
        if (accessToken) params.set("accessToken", accessToken);
        if (refreshToken) params.set("refreshToken", refreshToken);
        if (error) params.set("error", error);
        if (errorDescription) params.set("error_description", errorDescription);

        const suffix = params.toString();
        router.replace(suffix ? `/cross-callback?${suffix}` : "/cross-callback");
      }
      return;
    }

    if (client && client !== "android") {
      window.localStorage.removeItem("beatza:auth-client");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-dvh px-4 pt-20 pb-8 sm:px-6 sm:pt-28">
      <div className="mx-auto flex w-full max-w-110">
        <LoginForm />
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="min-h-dvh px-4 pt-20 sm:px-6 sm:pt-28" />}>
      <SignInContent />
    </Suspense>
  );
}
