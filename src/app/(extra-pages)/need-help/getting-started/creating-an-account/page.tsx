import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function CreatingAnAccount() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/need-help/getting-started" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft size={12} />
          Getting Started
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-6">Creating an Account on BeatZa</h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          Getting started on BeatZa is quick and free. Follow the steps below to create your account.
        </p>

        <h2 className="text-black text-base font-semibold mb-3">Sign up with email</h2>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-6">
          <li>Go to <span className="font-medium text-black">beatza.me</span> and click <span className="font-medium text-black">Create account</span>.</li>
          <li>Enter your email address and choose a password.</li>
          <li>Fill in your display name, date of birth, and gender.</li>
          <li>Check your inbox for a verification email and click the confirmation link.</li>
          <li>You're in — start exploring or upload your first track.</li>
        </ol>

        <h2 className="text-black text-base font-semibold mb-3">Sign up with Google</h2>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-6">
          <li>Click <span className="font-medium text-black">Continue with Google</span> on the sign-in screen.</li>
          <li>Select your Google account and grant the required permissions.</li>
          <li>Complete your profile by entering your date of birth and gender.</li>
          <li>Your account is ready immediately — no email verification needed.</li>
        </ol>

        <h2 className="text-black text-base font-semibold mb-3">Things to know</h2>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5">
          <li>You must be at least 13 years old to create an account.</li>
          <li>Each email address can only be linked to one BeatZa account.</li>
          <li>Your display name can be changed later in your account settings.</li>
        </ul>
      </article>

    </div>
  )
}