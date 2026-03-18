import { useState, useCallback } from "react";
import { authService } from "@/services/auth.service";

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
    async (token: string, newPassword: string) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await authService.resetPassword({ token, newPassword });
        setSuccess(res.data.success);
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
