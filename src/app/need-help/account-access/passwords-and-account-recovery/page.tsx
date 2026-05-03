import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PasswordsAndAccountRecovery() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link
          href="/need-help/account-access"
          className="hover:text-black transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={12} />
          Account Access
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-8">Passwords & Account Recovery</h1>

        {/* Reset password */}
        <h2 className="text-black text-lg font-bold mb-3">How to Reset Your Password</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          If you would like to reset your password, simply click the "Send password reset link"
          button in your Account Settings. The password reset link will be sent to all email
          addresses connected to your account.
        </p>
        <h3 className="text-black text-sm font-semibold mb-2">
          Tips for Creating a Secure Password
        </h3>
        <div className="space-y-3 mb-10">
          <div>
            <p className="text-black text-sm font-medium mb-0.5">Use a Strong Password</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Create a password that is difficult to guess by including a mix of uppercase and
              lowercase letters, numbers, and special characters. Avoid using easily guessable
              information like names or common words.
            </p>
          </div>
          <div>
            <p className="text-black text-sm font-medium mb-0.5">
              Unique Passwords for Each Service
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Do not reuse passwords across multiple services. Each account should have its own
              unique password to prevent a breach in one service from compromising your accounts on
              other platforms.
            </p>
          </div>
          <div>
            <p className="text-black text-sm font-medium mb-0.5">Consider a Password Manager</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Using a password manager can help you create and store strong, unique passwords for
              all your accounts without the need to remember each one individually.
            </p>
          </div>
        </div>

        {/* Missing reset email */}
        <h2 className="text-black text-lg font-bold mb-3">
          How to Troubleshoot Missing Password Reset Emails
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you don't receive a password reset email after requesting it, try these steps:
        </p>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-10">
          <li>Check your Spam or Junk folder.</li>
          <li>
            Look for an email from BeatZa with a subject like "Request to change BeatZa password."
          </li>
          <li>Wait at least five minutes for the email to arrive.</li>
          <li>Check any other email accounts you may have used when signing up.</li>
        </ol>

        {/* Prompted to reset */}
        <h2 className="text-black text-lg font-bold mb-3">
          Why You're Being Prompted to Reset Your Password
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you were shown a password reset message when signing in, you need to reset your
          password before you can access your account.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          BeatZa has introduced a security feature to protect users from unauthorized access,
          particularly following an increase in data leaks from other services that have exposed
          usernames, emails, and passwords. When BeatZa detects that your email address may have
          been part of a data leak, you will be required to reset your password as a precautionary
          measure — especially if you have reused the same password across multiple services.
        </p>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-10">
          <p className="text-gray-600 text-xs leading-relaxed">
            This is a precaution only, to protect users who may have reused passwords across
            multiple services.
          </p>
        </div>

        {/* Unrequested reset email */}
        <h2 className="text-black text-lg font-bold mb-3">
          What to Do If You Receive an Unrequested Password Reset Email
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you receive a password reset email that you didn't request, the safest course of action
          is to ignore it — this could be a phishing attempt. Remember, no one can reset your BeatZa
          password without access to your email account.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-10">
          If you're unsure whether the email is legitimate, do not click on any links or provide any
          information. Instead, manually navigate to beatza.me and check your account settings. As a
          security precaution, we recommend that you reset your BeatZa password. You may also want
          to reset your email password for extra protection.
        </p>

        {/* Shared account */}
        <h2 className="text-black text-lg font-bold mb-3">
          What to Do If You're Logged Out of a Shared Account
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you are involved in a conflict of ownership relating to an account on BeatZa which you
          previously shared with another individual or group, we are unfortunately not in a position
          to mediate personal disagreements.
        </p>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> The owner of a BeatZa account is
            considered to be the person who owns the email address used at sign up.
          </p>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you lose access to your shared email address as well as your shared BeatZa account, the
          first step is to attempt to regain access to the email address used at sign up. If you are
          unable to regain access to this email address, we are not in a position to pass access
          over to any other email address. If the account is hosting your copyrighted content, you
          can report this via our Report Form.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-10">
          This means that the individual who owns the sign-up email owns the associated BeatZa
          account and all related data.
        </p>

        {/* Someone else created your account */}
        <h2 className="text-black text-lg font-bold mb-3">
          What to Do If Someone Else Created Your Account
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          If the account was set up on your behalf, you'll need to get the person who created the
          account to add your email address to it. If there is a conflict regarding ownership, we
          must follow our account ownership policy — the owner of an account is the individual who
          controls the email address used at sign up.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          In such conflicts, the following options are available to you:
        </p>
        <div className="space-y-4">
          <div>
            <p className="text-black text-sm font-medium mb-1">
              1. Regain access to the original email
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Gain access to the email used to create the account and we can restore it.
            </p>
          </div>
          <div>
            <p className="text-black text-sm font-medium mb-2">
              2. Report the account for a Terms of Use violation
            </p>
            <div className="space-y-2 pl-4">
              <div>
                <p className="text-black text-sm font-medium mb-0.5">
                  Impersonation or misrepresentation
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  If the account is misrepresenting its affiliation with you or impersonating you,
                  please let us know. If we find evidence of a violation, we will be able to suspend
                  the reported account.
                </p>
              </div>
              <div>
                <p className="text-black text-sm font-medium mb-0.5">Copyright Infringement</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  If the account is hosting content you own the rights to, you can report this using
                  our Copyright infringement form to remove your content from BeatZa.
                </p>
              </div>
              <div>
                <p className="text-black text-sm font-medium mb-0.5">Trademark Violation</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  If the account is infringing your trademark rights, contact us with proof of your
                  registration. If we find evidence of trademark infringement, we can request that
                  the account owner change their URL or Display Name.
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-black text-sm font-medium mb-1">3. Follow due legal process</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you can obtain a court order or settlement agreement in your favour regarding this
              profile specifically, within 90 days of the reported account's suspension, this will
              be treated as a legal request and we can pass access over to you. Please contact us at
              legal@beatza.me with detailed documentation from your legal representative.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
