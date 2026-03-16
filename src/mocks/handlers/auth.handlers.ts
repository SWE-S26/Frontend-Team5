import { http, HttpResponse } from "msw"

export const authHandlers = [
    /* (1) */
    http.post("/api/auth/v1/find-email", async ({ request }) => {
        const body = await request.json() as { email: string }

        // 400 - missing or invalid email
        if (!body.email || !body.email.includes("@")) {
        return HttpResponse.json(
            { message: "Email is required or invalid format" },
            { status: 400 }
        )
        }

        // 429 - too many requests (simulate by using specific test email)
        if (body.email === "ratelimit@test.com") {
        return HttpResponse.json(
            { message: "Too many requests, please try again later" },
            { status: 429 }
        )
        }

        // 500 - server error (simulate by using specific test email)
        if (body.email === "error@test.com") {
        return HttpResponse.json(
            { message: "Something went wrong on the server" },
            { status: 500 }
        )
        }

        // 200 - success
        const existingEmails = ["test@test.com", "omar@beatza.com"]
        const exists = existingEmails.includes(body.email)
        return HttpResponse.json(
        { exists, message: "Email exists in the system" },
        { status: 200 }
        )
    }),

    /* (2) */
]