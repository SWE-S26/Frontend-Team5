import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function VerifyYourEmail() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link
          href="/need-help/getting-started"
          className="hover:text-black transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={12} />
          Getting Started
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-6">Verify Your Email</h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          After signing up with an email address, BeatZa will send you a verification email. You
          need to confirm your email before you can fully use your account.
        </p>

        <h2 className="text-black text-base font-semibold mb-3">How to verify</h2>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-6">
          <li>Check your inbox for an email from BeatZa.</li>
          <li>Open the email and click the verification link.</li>
          <li>You will be redirected to BeatZa and your email will be confirmed.</li>
        </ol>

        <h2 className="text-black text-base font-semibold mb-3">Didn't receive the email?</h2>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-6">
          <li>Check your spam or junk folder.</li>
          <li>Make sure the email address you entered is correct.</li>
          <li>Wait a few minutes — delivery can sometimes be delayed.</li>
          <li>
            Use the <span className="font-medium text-black">Resend verification email</span> option
            from the sign-in screen.
          </li>
        </ul>

        <h2 className="text-black text-base font-semibold mb-3">Verification link expired</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Verification links expire after 24 hours. If your link has expired, request a new one by
          signing in and choosing to resend the verification email.
        </p>
      </article>
    </div>
  );
}
