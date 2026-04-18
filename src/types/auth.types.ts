export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
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
  onSuccess?: () => void;
}

export interface RegisterDetailsFormProps {
  email: string;
  requireDisplayName?: boolean;
  submitError?: string | null;
  isSubmitting?: boolean;
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
  onSendAgain?: () => Promise<unknown> | unknown;
}
export interface RefreshTokenResponse {
  message: string
  data: {
    user: {
      id:           string
      displayName:  string
      role:         string
      profileLink:  string
      profileImg:   {
        imgLink:   string
        publicId:  string
      }
      subscription: {
        subscriptionType: string
        quota: {
          unlimited:   boolean
          usedSeconds: number
        }
      }
    }
  }
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
  data: null | {};
}

/* (5) "/api/auth/v1/reset-password" */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  signOutEverywhere?: boolean;
}

export interface ResetPasswordResponse {
  message: string
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
  data: {};
}

/* (10) "/api/auth/v1/verify-email" */
export interface VerifyEmailRequest {
  token: string  // sent as query param not body
}
export interface VerifyEmailResponse {
  message: string
}

/* (11) "/api/auth/v1/resend-verification-email" */
export interface ResendVerificationEmailRequest {
  email: string
}
export interface ResendVerificationEmailResponse {
  message: string
}

/* (12) "/api/auth/v1/cross/desktop" */
export interface GenerateQRcodeRequest {
}
export interface GenerateQRcodeResponse {
  success?: boolean,
  message: string;
  pendingToken?: {
    qrCode: string;
    expiresIn: number;
  };
}

/* (13) "/api/auth/v1/cross/desktop/poll" */
export interface LoginWithQRcodeRequest {
  qrCode: string;
}
export interface LoginWithQRcodeResponse {
  success?: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      displayName: string;
      role: string;
      profileLink: string;
      profileImg: {
        imgLink: string;
        publicId: string;
      };
      subscription: {
        subscriptionType: string;
        quota: {
          unlimited: boolean;
          usedSeconds: number;
        };
      };
    };
  };
}

/* (14) "/api/auth/v1/delete-account" */
export interface DeleteAccountResponse {
  message: string;
}

/* (15) "/api/auth/v1/google/resend-code" */
export interface ResendVerificationCodeRequest {
  pendingToken: string;
}
export interface ResendVerificationCodeResponse {
  message: string;
}