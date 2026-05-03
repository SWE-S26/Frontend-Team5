import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ManagingEmailAddresses() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link
          href="/need-help/manage-account"
          className="hover:text-black transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={12} />
          Manage My Account
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-8">
          Managing Email Addresses in Your BeatZa Account
        </h1>

        <h2 className="text-black text-lg font-bold mb-3">
          How Do I Change My Primary Email Address?
        </h2>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-4">
          <li>Go to your Settings page.</li>
          <li>
            If you have more than one email associated with your account, click the "Make primary"
            button next to the email you want to set as primary.
          </li>
          <li>
            Verify your identity with a 6-digit One Time Password sent to your current email. Enter
            the code to confirm the change. If you don't receive the code, check your spam folder or
            request a new one.
          </li>
        </ol>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-8">
          <p className="text-gray-600 text-xs leading-relaxed">
            This verification step ensures only you can update your primary email address.
          </p>
        </div>

        <h2 className="text-black text-lg font-bold mb-3">
          How Do I Add a New Email Address to My Account?
        </h2>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-8">
          <li>Go to your Settings page.</li>
          <li>Enter the new email address in the "Add an email address" field.</li>
          <li>
            A confirmation email will be sent to the new address. Check your inbox and click the
            confirmation link to complete the process.
          </li>
        </ol>

        <h2 className="text-black text-lg font-bold mb-3">
          What should I do if I'm not receiving the confirmation email?
        </h2>
        <div className="space-y-3 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">
              Check your Spam or Junk folder
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Sometimes confirmation emails are filtered into spam or junk folders — check there
              first.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Resend the confirmation email</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you still don't see the email, go back to your BeatZa settings and resend the
              confirmation.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Verify email address accuracy</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Ensure the email address you entered is correct. A typo could prevent the email from
              being delivered.
            </p>
          </div>
        </div>

        <h2 className="text-black text-lg font-bold mb-3">
          How Do I Remove an Email Address from my account?
        </h2>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-4">
          <li>Go to your Settings page.</li>
          <li>Click "Remove address", then confirm by clicking "Delete."</li>
        </ol>
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> If you only have one email
            associated with your account, you won't be able to remove it. You must add another email
            address before deleting the existing one.
          </p>
        </div>
      </article>
    </div>
  );
}
