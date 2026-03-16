import api from "@/lib/api"
import { FindEmailRequest, FindEmailResponse } from "@/types/auth.types"
import { LoginRequest, LoginResponse } from "@/types/auth.types"
import { SignupRequest, SignupResponse } from "@/types/auth.types"
import { VerifyEmailRequest, VerifyEmailResponse } from "@/types/auth.types"

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
    verifyEmail: (data: VerifyEmailRequest) =>
        api.get<VerifyEmailResponse>("/api/auth/v1/verify-email", { params: data }),
}