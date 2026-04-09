"use client";

import { useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

type BridgePayload = {
  source: "beatza-cross-callback";
  status: "success" | "error";
  message?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  pendingToken?: string;
  incompleteToken?:string;
  displayName?: string;
};

function CrossPlatformCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParams = useMemo(() => {
    const token = searchParams.get("token") || undefined;
    const accessToken =
      searchParams.get("accessToken") ||
      token ||
      undefined;
    const refreshToken =
      searchParams.get("refreshToken") ||
      undefined;
    const pendingToken =
      searchParams.get("pendingToken") ||
      undefined;
    const error = searchParams.get("error") || undefined;
    const errorDescription =
      searchParams.get("error_description") ||
      searchParams.get("message") ||
      undefined;
    const incompleteToken =
      searchParams.get("incompleteToken") ||
      undefined;
    const displayName =
      searchParams.get("displayName") ||
      undefined;
    const hasAnyToken = Boolean(token || accessToken || refreshToken || pendingToken);

    return {
      token,
      accessToken,
      refreshToken,
      pendingToken,
      error,
      errorDescription,
      hasAnyToken,
      incompleteToken,
      displayName,
    };
  }, [searchParams]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const postToReceivers = (payload: BridgePayload) => {
      const raw = JSON.stringify(payload);

      if (typeof window !== "undefined" && window.opener && !window.opener.closed) {
        window.opener.postMessage(payload, "*");
      }

      if (
        typeof window !== "undefined" &&
        (window as Window & { ReactNativeWebView?: { postMessage: (value: string) => void } })
          .ReactNativeWebView
      ) {
        (window as Window & { ReactNativeWebView?: { postMessage: (value: string) => void } })
          .ReactNativeWebView?.postMessage(raw);
      }
    };

    const payload: BridgePayload = {
      source: "beatza-cross-callback",
      status: tokenParams.error || !tokenParams.hasAnyToken ? "error" : "success",
      message: tokenParams.errorDescription || tokenParams.error,
      token: tokenParams.token,
      accessToken: tokenParams.accessToken,
      refreshToken: tokenParams.refreshToken,
      pendingToken: tokenParams.pendingToken,
      incompleteToken: tokenParams.incompleteToken,
      displayName: tokenParams.displayName,
    };

    postToReceivers(payload);

    if (payload.status === "success") {
      const deepLinkParams = new URLSearchParams();
      if (tokenParams.accessToken) {
        deepLinkParams.set("accessToken", tokenParams.accessToken);
      }
      if (tokenParams.refreshToken) {
        deepLinkParams.set("refreshToken", tokenParams.refreshToken);
      }
      if (tokenParams.pendingToken) {
        deepLinkParams.set("pendingToken", tokenParams.pendingToken);
      }
      if (tokenParams.incompleteToken) {
        deepLinkParams.set("incompleteToken", tokenParams.incompleteToken);
      }
      if (tokenParams.displayName) {
        deepLinkParams.set("displayName", tokenParams.displayName);
      }

      const deepLink = `beatza://auth?${deepLinkParams.toString()}`;

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "beatza:cross-callback",
          JSON.stringify({
            token: tokenParams.token,
            accessToken: tokenParams.accessToken,
            refreshToken: tokenParams.refreshToken,
            incompleteToken: tokenParams.incompleteToken,
            pendingToken: tokenParams.pendingToken,
            displayName: tokenParams.displayName,
          }),
        );
      }

      const timeoutId = window.setTimeout(() => {
        window.location.href = deepLink;

        window.setTimeout(() => {
          router.replace("/home");
        }, 1200);
      }, 1000);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      router.replace("/sign-in");
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, [tokenParams, router]);


  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-4 py-6">
      <div className="w-full rounded-md border border-white/10 bg-chinese-black px-6 py-8 text-center text-white-smoke sm:px-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Cross-Platform Callback</h1>
        <p className="mt-5 text-sm text-white-smoke/90 sm:text-base">
          Processing callback from backend...
        </p>

        {tokenParams.error && (
          <p className="mt-3 text-sm text-red-300">
            {tokenParams.errorDescription || tokenParams.error}
          </p>
        )}

        {!tokenParams.hasAnyToken && !tokenParams.error && (
          <p className="mt-3 text-sm text-red-300">No callback token found in URL.</p>
        )}

        {tokenParams.hasAnyToken && !tokenParams.error && (
          <p className="mt-3 text-sm text-green-300">Success. Opening Beatza app...</p>
        )}

        <div className="mx-auto mt-6 h-8 w-8 animate-spin rounded-full border-2 border-white-smoke/25 border-t-white-smoke" />
      </div>
    </section>
  );
}

export default function CrossPlatformCallbackPage() {
  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-chinese-black text-white-smoke">
      <header className="h-13 bg-chinese-black">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center">
          <div className="flex h-full w-60 items-center bg-chinese-black px-5">
            <img
              src="/app-logo/beatza.png"
              alt="BeatZa logo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <span className="ml-3 text-sm font-semibold tracking-[0.14em] text-white uppercase">
              BeatZa
            </span>
          </div>
        </div>
      </header>

      <Suspense fallback={<div className="flex flex-1 items-center justify-center">Loading...</div>}>
        <CrossPlatformCallbackContent />
      </Suspense>
    </main>
  );
}