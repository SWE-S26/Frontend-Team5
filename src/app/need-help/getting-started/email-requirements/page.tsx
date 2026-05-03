import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function EmailRequirements() {
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
        <h1 className="text-black text-2xl font-bold mb-6">Email Requirements</h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          Your email address is used to sign in, receive notifications, and recover your account.
          Make sure it meets the following requirements before signing up.
        </p>

        <h2 className="text-black text-base font-semibold mb-3">Requirements</h2>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-6">
          <li>Must be a valid, active email address you have access to.</li>
          <li>Cannot already be linked to another BeatZa account.</li>
          <li>
            Must be able to receive emails — check that BeatZa is not blocked by your email
            provider.
          </li>
          <li>Disposable or temporary email addresses are not accepted.</li>
        </ul>

        <h2 className="text-black text-base font-semibold mb-3">One account per email</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          Each email address can only be associated with one BeatZa account at a time. If you try to
          sign up with an email that already has an account, you will be prompted to sign in
          instead.
        </p>

        <h2 className="text-black text-base font-semibold mb-3">Changing your email</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Once your account is created, you can update your email address from Settings. You will
          need to verify the new address before the change takes effect.
        </p>
      </article>
    </div>
  );
}
