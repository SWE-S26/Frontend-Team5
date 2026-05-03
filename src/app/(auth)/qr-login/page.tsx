"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBack, IoRefresh } from "react-icons/io5";
import QRCode from "react-qr-code";
import { useQRLogin } from "@/hooks/useAuth";

export default function QrLoginPage() {
  const router = useRouter();

  const { generateQR, startPolling, stopPolling, qrCode, status, loading, error } = useQRLogin();

  const hasGeneratedQr = useRef(false);
  const isPollingRef = useRef(false);
  const generateNewQr = useCallback(async () => {
    stopPolling();
    isPollingRef.current = false;
    await generateQR();
  }, [generateQR, stopPolling]);

  useEffect(() => {
    if (hasGeneratedQr.current) return;
    hasGeneratedQr.current = true;
    generateNewQr();
  }, [generateNewQr]);

  // Start/stop polling
  useEffect(() => {
    if (!qrCode || status !== "waiting") {
      stopPolling();
      isPollingRef.current = false;
      return;
    }

    if (!isPollingRef.current) {
      startPolling();
      isPollingRef.current = true;
    }

    return () => {
      stopPolling();
      isPollingRef.current = false;
    };
  }, [qrCode, status, startPolling, stopPolling]);

  // Redirect on success
  useEffect(() => {
    if (status === "success") {
      router.push("/home");
    }
  }, [status, router]);

  const isImagePayload =
    !!qrCode &&
    (qrCode.startsWith("http://") ||
      qrCode.startsWith("https://") ||
      qrCode.startsWith("data:image"));

  const statusText =
    status === "success"
      ? "Sign-in confirmed. Redirecting..."
      : status === "expired"
        ? "QR code expired"
        : "Waiting for scan approval...";

  return (
    <main className="min-h-dvh bg-chinese-black px-4 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex h-full w-full max-w-xl items-center">
        <section className="max-h-full w-full overflow-y-auto no-scrollbar rounded-2xl border border-white/10 bg-chinese-black p-5 text-white-smoke shadow-[0_12px_32px_rgba(0,0,0,0.35)] sm:p-6 md:p-7">
          <button
            type="button"
            onClick={() => router.push("/sign-in")}
            className="mb-5 -ml-1 rounded-full border border-white/10 p-2 hover:bg-white/5"
          >
            <IoChevronBack size={24} />
          </button>

          <h1 className="text-[26px] font-black tracking-tight sm:text-[32px]">
            Sign in with QR code
          </h1>

          <p className="mt-2 text-sm text-gray-300">
            Open BeatZa on your phone and scan this code.
          </p>

          <div className="mt-4 space-y-1 text-sm text-gray-300">
            <p>1. Open the BeatZa app</p>
            <p>2. Go to QR scanner</p>
            <p>3. Scan and approve login</p>
          </div>

          {/* QR Box */}
          <div className="mt-6 rounded-xl border border-white/15 bg-black/20 p-4">
            <div className="flex min-h-72 items-center justify-center rounded-lg border border-white/15 p-4">
              {loading ? (
                <p className="text-sm text-gray-400">Generating QR code...</p>
              ) : qrCode && isImagePayload ? (
                <img src={qrCode} alt="QR code" className="h-56 w-56 rounded-md bg-white p-2" />
              ) : qrCode ? (
                <div className="rounded-md bg-white p-3">
                  <QRCode value={qrCode} size={224} />
                </div>
              ) : (
                <p className="text-sm text-gray-400">Failed to load QR code</p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-300">{statusText}</p>

              <button
                onClick={generateNewQr}
                disabled={loading}
                className="flex items-center gap-2 rounded-md bg-linear-to-r from-crusta to-inferno px-3 py-2 text-xs font-semibold text-white hover:brightness-110 disabled:opacity-60"
              >
                <IoRefresh size={14} />
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-red-500 bg-red-500 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
