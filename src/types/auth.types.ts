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
  onBack: () => void;
  onComplete: (details: { displayName: string; dob: string; gender: string }) => void;
}

export interface DetailsValidationFormProps {
  email: string;
  onBackToLogin: () => void;
  onSendAgain?: () => void;
}