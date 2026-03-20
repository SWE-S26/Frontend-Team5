"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

function SignInContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const client = searchParams.get("client");

    if (client?.toLowerCase() === "android") {
      window.localStorage.setItem("beatza:auth-client", "Android");
      return;
    }

    window.localStorage.removeItem("beatza:auth-client");
  }, [searchParams]);

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