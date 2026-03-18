"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";

export default function GooglePopupBridgePage() {
  const params = useSearchParams();
  const [message, setMessage] = useState("Finalizing Google sign-in...");

  useEffect(() => {
    const code = params.get("code");
    const scope = params.get("scope") || undefined;

    const sendResult = (payload: unknown) => {
      if (window.opener) {
        window.opener.postMessage(
          { type: "google-auth-result", payload },
          window.location.origin,
        );
      }
    };

    const closeSoon = () => {
      window.setTimeout(() => window.close(), 250);
    };

    if (!code) {
      const payload = { message: "Missing Google callback code" };
      sendResult(payload);
      setMessage("Google sign-in failed. You can close this window.");
      closeSoon();
      return;
    }

    const run = async () => {
      try {
        const res = await authService.googleCallback({ code, scope });
        sendResult(res.data);
        setMessage("Google sign-in complete. Returning to the app...");
      } catch (err: any) {
        const payload = {
          message: err.response?.data?.message || "Google sign-in failed",
        };
        sendResult(payload);
        setMessage("Google sign-in failed. You can close this window.");
      } finally {
        closeSoon();
      }
    };

    run();
  }, [params]);

  return (
    <div className="min-h-screen bg-chinese-black text-white-smoke flex items-center justify-center p-6 text-center">
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  );
}
