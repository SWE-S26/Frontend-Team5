import { useState, useCallback, useRef } from "react"
import { authService } from "@/services/auth.service"
import { useAppDispatch } from "@/store/hooks"
import { setAuth, clearAuth, setProfileImgLink, setBannerImgLink, setDisplayName } from "@/store/slices/authSlice"
import { RefreshTokenResponse } from "@/types/auth.types"

type AuthUserShape = {
  id?: string
  displayName?: string
  profileImg?: {
    imgLink?: string
  }
}

function extractAuthUser(payload: any): AuthUserShape | null {
  return (
    payload?.data?.user ||
    payload?.user ||
    payload?.data?.data?.user ||
    payload?.data ||
    null
  )
}

// dispatch is now passed in so these pure functions can stay outside the hooks
// without needing to call useAppDispatch() at the top level outside a component
function syncAuthUser(user: AuthUserShape | null, dispatch: ReturnType<typeof useAppDispatch>) {
  if (!user) return
  dispatch(
    setAuth({
      userId: user.id || null,
      displayName: user.displayName || null,
      profileImgLink: user.profileImg?.imgLink || null,
      bannerImgLink: null,
    })
  )
}

function syncAuthUserFromRefresh(refreshRes: RefreshTokenResponse, dispatch: ReturnType<typeof useAppDispatch>) {
  syncAuthUser(extractAuthUser(refreshRes), dispatch)
}

export function useFindEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exists, setExists] = useState<boolean | null>(null)

  const findEmail = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    setExists(null)
    try {
      const res = await authService.findEmail({ email })
      setExists(res.data.data.exists)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { findEmail, loading, error, exists }
}

export function useLogin() {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await authService.login({ email, password })
      setSuccess(res.data.success ?? true)

      // sync whatever user data the login response includes
      syncAuthUser(extractAuthUser(res.data), dispatch)

      // refresh to fill in any missing fields the login response didn't include
      try {
        const refreshRes = await authService.refreshToken()
        syncAuthUserFromRefresh(refreshRes.data, dispatch)
      } catch {}

      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  return { login, loading, error, success }
}

export function useSignup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  // signup doesn't touch auth state — user still needs to verify email first
  const signup = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      dateOfBirth: string,
      gender: string,
    ) => {
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const res = await authService.signup({ email, password, displayName, dateOfBirth, gender })
        setSuccess(res.data.success)
        return res.data
      } catch (err: any) {
        const message = err.response?.data?.message || "Something went wrong"
        setError(message)
        setSuccess(false)
        return { success: false, message, data: {} }
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { signup, loading, error, success }
}

export function useForgetPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const forgetPassword = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await authService.forgetPassword({ email })
      setSuccess(res.data.success)
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }, [])

  return { forgetPassword, loading, error, success }
}

export function useResetPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const resetPassword = useCallback(
    async (token: string, newPassword: string, signOutEverywhere = false) => {
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const res = await authService.resetPassword({ token, newPassword, signOutEverywhere })
        setSuccess(true)
        return res.data
      } catch (err: any) {
        const message = err.response?.data?.message || "Something went wrong"
        setError(message)
        setSuccess(false)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { resetPassword, loading, error, success }
}

export function useLogout() {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await authService.logout()
      setSuccess(true)

      // single dispatch clears everything — replaces the 4 separate authStore calls
      dispatch(clearAuth())

      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  return { logout, loading, error, success }
}

export function useGoogleComplete() {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const completeGoogleSignup = useCallback(
    async (incompleteToken: string, dateOfBirth: string, gender: string) => {
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const res = await authService.googleComplete({ incompleteToken, dateOfBirth, gender })
        setSuccess(true)

        // Google complete doesn't return full user data so we rely on refresh
        try {
          const refreshRes = await authService.refreshToken()
          syncAuthUserFromRefresh(refreshRes.data, dispatch)
        } catch {}

        return res.data
      } catch (err: any) {
        const message = err.response?.data?.message || "Something went wrong"
        setError(message)
        setSuccess(false)
      } finally {
        setLoading(false)
      }
    },
    [dispatch],
  )

  return { completeGoogleSignup, loading, error, success }
}

export function useGoogleVerifyCode() {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const verifyGoogleCode = useCallback(
    async (pendingToken: string, code: string) => {
      setLoading(true)
      setError(null)
      setSuccess(null)
      try {
        const res = await authService.googleVerifyCode({ pendingToken, code })
        setSuccess(true)

        // same as googleComplete — refresh is the reliable source for user data
        try {
          const refreshRes = await authService.refreshToken()
          syncAuthUserFromRefresh(refreshRes.data, dispatch)
        } catch {}

        return res.data
      } catch (err: any) {
        const message = err.response?.data?.message || "Something went wrong"
        setError(message)
        setSuccess(false)
      } finally {
        setLoading(false)
      }
    },
    [dispatch],
  )

  return { verifyGoogleCode, loading, error, success }
}

export function useVerifyEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
  const [error, setError] = useState<string | null>(null)
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
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [expiresIn, setExpiresIn] = useState<number | null>(null)
  const [status, setStatus] = useState<"idle" | "waiting" | "success" | "expired">("idle")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const generateQR = useCallback(async () => {
    setLoading(true)
    setError(null)
    setStatus("idle")
    try {
      const res = await authService.generateQRcode()
      const qrPayload = res.data.pendingToken
      if (!qrPayload?.qrCode) throw new Error("QR payload missing from response")

      const { qrCode, expiresIn } = qrPayload
      setQrCode(qrCode)
      setExpiresIn(typeof expiresIn === "number" ? expiresIn : 120)
      setStatus("waiting")
      return res.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong"
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const startPolling = useCallback(() => {
    if (!qrCode) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    setError(null)

    intervalRef.current = setInterval(async () => {
      try {
        const res = await authService.loginWithQRcode({ qrCode })
        const message = res.data.message.toLowerCase()

        if (message.includes("successful")) {
          setStatus("success")
          setError(null)

          const user = res.data.data?.user
          if (user) {
            dispatch(
              setAuth({
                userId: user.id || null,
                displayName: user.displayName || null,
                profileImgLink: user.profileImg?.imgLink ?? null,
                bannerImgLink: null,
              })
            )
          }

          if (intervalRef.current) clearInterval(intervalRef.current)
        }

        if (message.includes("expired")) {
          setStatus("expired")
          setError(null)
          if (intervalRef.current) clearInterval(intervalRef.current)
        }
      } catch (err: any) {
        const message = (err.response?.data?.message || "Polling failed").toLowerCase()
        if (message.includes("expired")) {
          setStatus("expired")
          setError(null)
        } else {
          setError(err.response?.data?.message || "Polling failed")
        }
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }, 5000)
  }, [qrCode, dispatch])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  return { generateQR, startPolling, stopPolling, qrCode, expiresIn, status, loading, error }
}

export function useDeleteAccount() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async (onSuccess?: () => void) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.deleteAccount();
      dispatch(clearAuth());
      onSuccess?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleDeleteAccount, isLoading, error };
}

export function useForgotPasswordLoggedIn() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const forgotPasswordLoggedIn = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await authService.forgotPasswordLoggedIn()
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

  return { forgotPasswordLoggedIn, loading, error, success }
}

export function useResendVerificationCode() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean | null>(null)

  const resendVerificationCode = useCallback(async (pendingToken: string) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await authService.resendVerificationCode({ pendingToken })
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

  return { resendVerificationCode, loading, error, success }
}