import api from "@/lib/api";
import {
  FindEmailRequest, FindEmailResponse,
  LoginRequest, LoginResponse,
  SignupRequest, SignupResponse,
  ForgetPasswordRequest, ForgetPasswordResponse,
  ResetPasswordRequest, ResetPasswordResponse,
  LogoutResponse,
  GoogleCallbackRequest, GoogleCallbackResponse,
  GoogleCompleteRequest,
  GoogleVerifyCodeRequest,GoogleAuthFinalizeResponse,
  VerifyEmailRequest, VerifyEmailResponse,
  ResendVerificationEmailRequest, ResendVerificationEmailResponse,
  GenerateQRcodeResponse, LoginWithQRcodeRequest, LoginWithQRcodeResponse,
  RefreshTokenResponse
} from "@/types/auth.types";

export const authService = {

  refreshToken: () =>
    api.get<RefreshTokenResponse>("/api/auth/v1/refresh-token"),

  /* (1) */
  findEmail: (data: FindEmailRequest) =>
    api.post<FindEmailResponse>("/api/auth/v1/find-email", data),

  /* (2) */
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/api/auth/v1/login", data),

  /* (3) */
  signup: (data: SignupRequest) =>
    api.post<SignupResponse>("/api/auth/v1/sign-up", data),

  /* (4) */
  forgetPassword: (data: ForgetPasswordRequest) =>
    api.post<ForgetPasswordResponse>("/api/auth/v1/forgot-password", data),

  /* (5) */
  resetPassword: (data: ResetPasswordRequest) =>
    api.post<ResetPasswordResponse>("/api/auth/v1/reset-password", data),

  /* (6) */
  logout: () =>
    api.get<LogoutResponse>("/api/auth/v1/logout"),

  /* (7) */
  googleCallback: (params: GoogleCallbackRequest) =>
    api.get<GoogleCallbackResponse>("/api/auth/v1/google/callback", {params,}),

  /* (8) */
  googleComplete: (data: GoogleCompleteRequest) =>
    api.post<GoogleAuthFinalizeResponse>("/api/auth/v1/google/complete", data),

  /* (9) */
  googleVerifyCode: (data: GoogleVerifyCodeRequest) =>
    api.post<GoogleAuthFinalizeResponse>("/api/auth/v1/google/verify-code", data),

  /* (10) */
  verifyEmail: (token: string) =>
    api.get<VerifyEmailResponse>(`/api/auth/v1/verify-email?token=${token}`),

  /* (11) */
  resendVerificationEmail: (data: ResendVerificationEmailRequest) =>
    api.post<ResendVerificationEmailResponse>("/api/auth/v1/resend-verification-email", data),

  /* (12) */
  generateQRcode: () =>
    api.get<GenerateQRcodeResponse>("/api/auth/v1/cross/desktop",),

  /* (13) */
  loginWithQRcode: (data: LoginWithQRcodeRequest) =>
    api.post<LoginWithQRcodeResponse>("/api/auth/v1/cross/desktop/poll", data),
};
