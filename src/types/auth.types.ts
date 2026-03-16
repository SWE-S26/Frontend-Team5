//* ======================== GUI Purposes ======================== */
export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  onSwitchToRegister: () => void;
}

export interface ForgotPasswordFormProps {
  email: string;
  setEmail: (val: string) => void;
  onBack: () => void;
}

export interface RegisterDetailsFormProps {
  email: string;
  onBack: () => void;
  onComplete: (details: { displayName: string; dob: string; gender: string }) => void;
}

export interface DetailsValidationFormProps {
  email: string;
  onBackToLogin: () => void;
  onSendAgain?: () => void;
}



//* ======================== API Integration ======================== */

/* (1) "/api/auth/v1/find-email" */
export interface FindEmailRequest {
  email: string
}
export interface FindEmailResponse {
  exists:  boolean
  message: string
}

/* (2) "/api/auth/v1/login" */
export interface LoginRequest {
  email: string,
  password: string
}
export interface LoginResponse {
  success: boolean,
  message: string,
  data: {}
}

/* (3) "/api/auth/v1/signup" */
export interface SignupRequest {
  email: string,
  password: string,
  displayName: string,
  dateOfBirth: string,
  gender: string
}
export interface SignupResponse {
  success: boolean,
  message: string,
  data: {}
}

/* (4) "/api/auth/v1/verify-email" */
export interface VerifyEmailRequest {
  token: string,
}
export interface VerifyEmailResponse {
  success: boolean,
  message: string,
  data: {}
}