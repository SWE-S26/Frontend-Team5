"use client"
import RegisterDetailsForm from "@/components/auth/RegisterDetailsForm";

export default function SignIn() {
  return (
    <div>
      <div className="flex mt-30 mx-auto max-w-110">
        <RegisterDetailsForm
          email="test@test.com"
          onBack={() => {}}
          onComplete={(details) => console.log(details)}
        />
      </div>
    </div>
  )
}