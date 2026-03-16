import api from "@/lib/api"
import { FindEmailRequest, FindEmailResponse } from "@/types/auth.types"

export const authService = {
    /* (1) */
    findEmail: (data: FindEmailRequest) => 
        api.post<FindEmailResponse>("/api/auth/v1/find-email", data),
}