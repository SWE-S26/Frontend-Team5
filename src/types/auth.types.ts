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

/* (1) "/api/auth/find-email" */
export interface FindEmailRequest {
  email: string
}
export interface FindEmailResponse {
  exists:  boolean
  message: string
}

/* (2) " " */