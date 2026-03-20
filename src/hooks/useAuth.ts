import { useState, useCallback, useRef } from "react";
import { authService } from "@/services/auth.service";
import { authStore } from "@/store/authStore";

export function useFindEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);

  const findEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    setExists(null);
    try {
      const res = await authService.findEmail({ email });
      setExists(res.data.data.exists);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { findEmail, loading, error, exists };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await authService.login({ email, password });
      setSuccess(res.data.success ?? true);
      authStore.setAuthenticated(true);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error, success };
}

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const signup = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      dateOfBirth: string,
      gender: string,
    ) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await authService.signup({
          email,
          password,
          displayName,
          dateOfBirth,
          gender,
        });
        setSuccess(res.data.success);
        return res.data;
      } catch (err: any) {
        const message = err.response?.data?.message || "Something went wrong";
        setError(message);
        setSuccess(false);
        return { success: false, message, data: {} };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { signup, loading, error, success };
}

export function useForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const forgetPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await authService.forgetPassword({ email });
      setSuccess(res.data.success);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { forgetPassword, loading, error, success };
}

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const resetPassword = useCallback(
    async (token: string, newPassword: string, signOutEverywhere = false) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await authService.resetPassword({
          token,
          newPassword,
          signOutEverywhere,
        });
        setSuccess(true)  // ← if no error thrown, it's a success
        return res.data;
      } catch (err: any) {
        const message = err.response?.data?.message || "Something went wrong";
        setError(message);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { resetPassword, loading, error, success };
}

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await authService.logout();
      setSuccess(true);
      authStore.setAuthenticated(false);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { logout, loading, error, success };
}

export function useGoogleComplete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const completeGoogleSignup = useCallback(
    async (incompleteToken: string, dateOfBirth: string, gender: string) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await authService.googleComplete({
          incompleteToken,
          dateOfBirth,
          gender,
        });
        setSuccess(true);
        authStore.setAuthenticated(true);
        return res.data;
      } catch (err: any) {
        const message = err.response?.data?.message || "Something went wrong";
        setError(message);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { completeGoogleSignup, loading, error, success };
}

export function useGoogleVerifyCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const verifyGoogleCode = useCallback(
    async (pendingToken: string, code: string) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await authService.googleVerifyCode({ pendingToken, code });
        setSuccess(true);
        authStore.setAuthenticated(true);
        return res.data;
      } catch (err: any) {
        const message = err.response?.data?.message || "Something went wrong";
        setError(message);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { verifyGoogleCode, loading, error, success };
}

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const verifyEmail = useCallback(async (token: string) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await authService.verifyEmail(token)
      setSuccess(true)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }, [])

  return { verifyEmail, loading, error, success }
}

export function useResendVerificationEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const resendVerificationEmail = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await authService.resendVerificationEmail({ email })
      setSuccess(true)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }, [])

  return { resendVerificationEmail, loading, error, success }
}

export function useQRLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "waiting" | "success" | "expired">("idle");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  //Generate QR
  const generateQR = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatus("idle");

    try {
      const res = await authService.generateQRcode();

      const qrPayload = res.data.pendingToken;
      if (!qrPayload?.qrCode) {
        throw new Error("QR payload missing from response");
      }

      const { qrCode, expiresIn } = qrPayload;

      setQrCode(qrCode);
      setExpiresIn(typeof expiresIn === "number" ? expiresIn : 120);
      setStatus("waiting");

      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  //Polling
  const startPolling = useCallback(() => {
    if (!qrCode) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setError(null);

    intervalRef.current = setInterval(async () => {
      try {
        const res = await authService.loginWithQRcode({ qrCode });

        const message = res.data.message.toLowerCase();

        if (message.includes("successful")) {
          setStatus("success");
          setError(null);
          authStore.setAuthenticated(true);

          if (intervalRef.current) clearInterval(intervalRef.current);
        }

        if (message.includes("expired")) {
          setStatus("expired");
          setError(null);

          if (intervalRef.current) clearInterval(intervalRef.current);
        }

      } catch (err: any) {
        const message = (err.response?.data?.message || "Polling failed").toLowerCase();

        if (message.includes("expired")) {
          setStatus("expired");
          setError(null);
        } else {
          setError(err.response?.data?.message || "Polling failed");
        }

        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 3000);
  }, [qrCode]);

  //Stop polling manually
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return { generateQR, startPolling, stopPolling, qrCode, expiresIn, status, loading, error,};
}