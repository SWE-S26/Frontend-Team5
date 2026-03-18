export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  onSwitchToRegister: () => void;
}

export interface RegisterFormProps {
  email: string;
  onSwitchToLogin: () => void;
}

export interface ForgotPasswordFormProps {
  email: string;
  setEmail: (val: string) => void;
  onBack: () => void;
}

export interface RegisterDetailsFormProps {
  email: string;
  requireDisplayName?: boolean;
  onBack: () => void;
  onComplete: (details: {
    displayName: string;
    dob: string;
    gender: string;
  }) => void;
}

export interface DetailsValidationFormProps {
  email: string;
  onBackToLogin: () => void;
  onSendAgain?: () => void;
}

//* ======================== API Integration ======================== */

/* (1) "/api/auth/v1/find-email" */
export interface FindEmailRequest {
  email: string;
}
export interface FindEmailResponse {
  data: {
    exists: boolean;
  }
  message: string;
}

/* (2) "/api/auth/v1/login" */
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {};
}

/* (3) "/api/auth/v1/signup" */
export interface SignupRequest {
  email: string;
  password: string;
  displayName: string;
  dateOfBirth: string;
  gender: string;
}
export interface SignupResponse {
  success: boolean;
  message: string;
  data: {};
}

/* (4) "/api/auth/v1/forget-password" */
export interface ForgetPasswordRequest {
  email: string;
}
export interface ForgetPasswordResponse {
  success: boolean;
  message: string;
  data: {};
}

/* (5) "/api/auth/v1/reset-password" */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: {};
}

/* (6) "/api/auth/v1/logout" */
export interface LogoutResponse {
  success: boolean;
  message: string;
  data: {};
}

/* (7) "/api/auth/v1/google/callback" */
export interface GoogleCallbackRequest {
  code: string;
  scope?: string;
}

export interface GoogleCallbackResponse {
  status: string;
  incompleteToken?: string;
  email?: string;
  displayName?: string;
}

/* (8) "/api/auth/v1/google/complete" */
export interface GoogleCompleteRequest {
  incompleteToken: string;
  dateOfBirth: string;
  gender: string;
}

/* (9) "/api/auth/v1/google/verify-code" */
export interface GoogleVerifyCodeRequest {
  pendingToken: string;
  code: string;
}

export interface GoogleAuthFinalizeResponse {
  message: string;
  data?: {
    user?: {
      id?: string;
      displayName?: string;
      role?: string;
      profileLink?: string;
    };
  };
}
