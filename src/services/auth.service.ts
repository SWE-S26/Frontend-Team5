import api from "@/lib/api";
import {
  FindEmailRequest,
  FindEmailResponse,
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  LogoutResponse,
  GoogleAuthFinalizeResponse,
  GoogleCallbackRequest,
  GoogleCallbackResponse,
  GoogleCompleteRequest,
  GoogleVerifyCodeRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/auth.types";
import { LoginRequest, LoginResponse } from "@/types/auth.types";
import { SignupRequest, SignupResponse } from "@/types/auth.types";

export const authService = {
  /* (1) */
  findEmail: (data: FindEmailRequest) =>
    api.post<FindEmailResponse>("/api/auth/v1/find-email", data),

  /* (2) */
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/api/auth/v1/login", data),

  /* (3) */
  signup: (data: SignupRequest) =>
    api.post<SignupResponse>("/api/auth/v1/signup", data),

  /* (4) */
  forgetPassword: (data: ForgetPasswordRequest) =>
    api.post<ForgetPasswordResponse>("/api/auth/v1/forget-password", data),

  /* (5) */
  resetPassword: (data: ResetPasswordRequest) =>
    api.post<ResetPasswordResponse>("/api/auth/v1/reset-password", data),

  /* (6) */
  logout: () => api.post<LogoutResponse>("/api/auth/v1/logout"),

  /* (6) */
  googleCallback: (params: GoogleCallbackRequest) =>
    api.get<GoogleCallbackResponse>("/api/auth/v1/google/callback"),

  /* (7) */
  googleComplete: (data: GoogleCompleteRequest) =>
    api.post<GoogleAuthFinalizeResponse>("/api/auth/v1/google/complete", data),

  /* (8) */
  googleVerifyCode: (data: GoogleVerifyCodeRequest) =>
    api.post<GoogleAuthFinalizeResponse>("/api/auth/v1/google/verify-code", data),
};
