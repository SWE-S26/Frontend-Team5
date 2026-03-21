"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { useAuthStore } from "@/store/authStore";

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    const client = searchParams.get("client")?.toLowerCase();
    const storedClient = window.localStorage.getItem("beatza:auth-client")?.toLowerCase();
    const accessToken =
      searchParams.get("accessToken") ||
      searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");
    const errorDescription =
      searchParams.get("error_description") ||
      searchParams.get("message");
    const hasCallbackPayload = Boolean(accessToken || refreshToken || error);
    const isExplicitAndroidClient = client === "android";
    const isAndroidClient = isExplicitAndroidClient || (hasCallbackPayload && storedClient === "android");

    if (hasCallbackPayload && isAndroidClient) {
      const params = new URLSearchParams();
      if (accessToken) params.set("accessToken", accessToken);
      if (refreshToken) params.set("refreshToken", refreshToken);
      if (error) params.set("error", error);
      if (errorDescription) params.set("error_description", errorDescription);

      window.localStorage.setItem("beatza:auth-client", "Android");

      const suffix = params.toString();
      router.replace(suffix ? `/cross-callback?${suffix}` : "/cross-callback");
      return;
    }

    if (isExplicitAndroidClient) {
      window.localStorage.setItem("beatza:auth-client", "Android");
    } else if (!hasCallbackPayload) {
      window.localStorage.removeItem("beatza:auth-client");
    }
  }, [hasHydrated, isAuthenticated, searchParams, router]);
  
  if (!hasHydrated || isAuthenticated) {
    return <div className="mt-40" />;
  }

  return (
    <div>
      <div className="flex mt-40 mx-auto max-w-110">
        <LoginForm />
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="mt-40" />}>
      <SignInContent />
    </Suspense>
  );
}