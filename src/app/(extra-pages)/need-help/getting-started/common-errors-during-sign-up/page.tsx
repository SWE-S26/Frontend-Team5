import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function CommonErrorsDuringSignUp() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/need-help/getting-started" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft size={12} />
          Getting Started
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-6">Common Errors During Sign Up</h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          Running into an issue while creating your account? Here are the most common errors and how to resolve them.
        </p>

        <div className="space-y-8">

          <div>
            <h2 className="text-black text-base font-semibold mb-2">"This email is already in use"</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              An account with this email address already exists. Try signing in instead, or use the forgot password
              flow to recover access. If you believe this is an error, contact support.
            </p>
          </div>

          <div>
            <h2 className="text-black text-base font-semibold mb-2">"Invalid email address"</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Double-check that your email is formatted correctly (e.g. name@example.com). Disposable or temporary
              email addresses are not accepted.
            </p>
          </div>

          <div>
            <h2 className="text-black text-base font-semibold mb-2">"Password does not meet requirements"</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-2">
              Your password must meet the following criteria:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5">
              <li>At least 8 characters long.</li>
              <li>Contains at least one uppercase letter.</li>
              <li>Contains at least one number.</li>
              <li>Contains at least one special character (e.g. !, @, #).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-black text-base font-semibold mb-2">"You must be at least 13 years old"</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              BeatZa requires users to be at least 13 years old to create an account in compliance with data
              protection laws. The date of birth entered does not meet this requirement.
            </p>
          </div>

          <div>
            <h2 className="text-black text-base font-semibold mb-2">Page not loading or form not submitting</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Try refreshing the page, clearing your browser cache, or using a different browser. If the issue
              persists, contact support with details about your device and browser.
            </p>
          </div>

        </div>
      </article>

    </div>
  )
}