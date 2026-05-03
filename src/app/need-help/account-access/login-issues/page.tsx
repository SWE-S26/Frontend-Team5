import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function LoginIssues() {
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
        <h1 className="text-black text-2xl font-bold mb-8">Login Issues</h1>

        {/* Unable to Sign In */}
        <h2 className="text-black text-lg font-bold mb-4">Unable to Sign In to Your Account</h2>

        <h3 className="text-black text-sm font-semibold mb-2">I forgot my BeatZa profile URL</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you're unsure about your profile URL, don't worry. You can use BeatZa's search function
          to easily locate your account on your computer or mobile browser. Once you find it, you
          can sign in using your profile URL and password.
        </p>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-6">
          <li>
            Open beatza.me and enter the name associated with your profile in the search field, then
            press the search icon.
          </li>
          <li>
            Once you find your profile, click on it to open the profile page. In the browser's
            address bar, copy the part of the URL that comes after beatza.me/ (e.g.{" "}
            <span className="font-medium text-black">fontainesdublin</span>). This is your profile
            URL.
          </li>
          <li>Use your profile URL in the email field along with your password to sign in.</li>
        </ol>

        <h3 className="text-black text-sm font-semibold mb-2">I forgot my BeatZa password</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          If you don't remember your password, you can reset it by clicking "Forgot your password?"
          on the sign-in screen on iPhone and Android, or by going to the Forgot password page on
          the web.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">
          I didn't get the password reset email
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          If you requested a password reset but have not received an email, please check your spam
          or junk folder. If you still don't see the email, you can try requesting one again or
          contact BeatZa support for further assistance.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">
          I can't access the email linked to my BeatZa account
        </h3>

        <p className="text-gray-700 text-sm leading-relaxed mb-2 font-medium">
          Sign in with Facebook, Apple or Google
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          If you have connected your Facebook, Apple, or Google account to your BeatZa account, you
          can sign in by selecting the "Continue with Facebook / Google / Apple" option to regain
          access.
        </p>

        <p className="text-gray-700 text-sm leading-relaxed mb-2 font-medium">
          Recover your email address
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          If the email address connected to your BeatZa account is no longer active, please review
          the account recovery steps for your email provider directly. If you are able to reactivate
          your email, you can send a password recovery email to it by clicking "Don't know your
          password?" when signing in.
        </p>

        <p className="text-gray-700 text-sm leading-relaxed mb-2 font-medium">
          I can't recover my email address
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          We take account security seriously. If you've lost access to the email linked to your
          BeatZa account, we'll try to help. However, if we can't verify your ownership, we can't
          grant access. To recover your account, use our support chat and provide as much detail as
          possible:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-10">
          <li>Email address linked to the account</li>
          <li>Account creation date</li>
          <li>Last sign-in date</li>
          <li>Last IP address used (search "what is my IP" to find yours)</li>
          <li>Names or upload dates of any private tracks</li>
          <li>Names of deleted tracks, if any</li>
          <li>A new email to attach (must not be linked to another BeatZa account)</li>
        </ul>

        {/* Signed Out Repeatedly */}
        <h2 className="text-black text-lg font-bold mb-3">Why Am I Being Signed Out Repeatedly?</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Common issues for frequent sign-outs include browser caching problems, extensions or
          plug-ins causing interference, using a VPN, and specific device-related issues. We suggest
          trying the following steps:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-4">
          <li>Clear the browser's cache.</li>
          <li>Disable any extensions or plug-ins.</li>
          <li>Try a different browser.</li>
          <li>Disable your VPN connection.</li>
          <li>
            App users: check the app stores for any new updates and download the latest version.
          </li>
          <li>Log out and re-authenticate two-factor authentication (2FA).</li>
        </ul>

        <h3 className="text-black text-sm font-semibold mb-2">
          Are you using a Sony Xperia device?
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          We are currently experiencing sign-in issues on Sony Xperia devices. Please try updating
          the BeatZa app to the latest version and signing in again. There are two known
          workarounds:
        </p>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-10">
          <li>Do a full factory reset while not using an SD card.</li>
          <li>Log into a different account (does not always work).</li>
        </ol>

        {/* Blocked */}
        <h2 className="text-black text-lg font-bold mb-3">Blocked from Signing In or Signing Up</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Sometimes you may see a "Our robots think you're spam" or "Our robots think you're a
          robot" error message when trying to log in or sign up. We have systems in place to stop
          spammers from accessing BeatZa, and something about your attempt triggered these systems.
          To regain access, try these troubleshooting tips:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-4">
          <li>Reload or refresh the page.</li>
          <li>Use a different browser.</li>
          <li>Access through a different computer or device.</li>
          <li>Reset your router.</li>
          <li>Use a different internet connection.</li>
          <li>Make sure your OS and SSL certificates are up to date.</li>
          <li>Temporarily disable your VPN, ad-blocker, or privacy extension.</li>
        </ul>
        <p className="text-gray-700 text-sm leading-relaxed mb-10">
          If you're still trying to create an account, we recommend using a different email address,
          as there may be an issue with your email address or domain. Still need help? Contact us
          via our support team.
        </p>

        {/* CAPTCHA */}
        <h2 className="text-black text-lg font-bold mb-3">
          Why Am I Seeing Repeated CAPTCHA Requests?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          A CAPTCHA is an added security measure that asks you to complete a short test to confirm
          that you are not a robot. We introduced this to protect users' accounts from potential
          security breaches. If you are regularly signing in and out of your account on the same
          day, we will likely ask you to complete a CAPTCHA. To avoid this, we suggest keeping
          yourself signed in to your account.
        </p>
        <h3 className="text-black text-sm font-semibold mb-2">
          I need to sign into multiple accounts
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-10">
          If you manage multiple accounts on BeatZa, we recommend using incognito windows or
          multiple browsers for each profile. This helps reduce CAPTCHA requests.
        </p>

        {/* Frozen */}
        <h2 className="text-black text-lg font-bold mb-3">
          My Account Is Frozen and I Can't Sign In
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Accounts may be frozen for various reasons, such as policy violations, fraud, or security
          concerns requiring resolution. Before contacting support, check your emails and BeatZa
          messages for any notifications related to the issue, or review your account activity to
          identify potential reasons for the freeze. BeatZa will always inform users via email in
          these cases.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-10">
          If your account is frozen, please reach out to our support team. A support specialist will
          be in touch to assist you in resolving the issue and guide you through the necessary steps
          to regain access.
        </p>

        {/* Wrong account */}
        <h2 className="text-black text-lg font-bold mb-3">Signed In to the Wrong Account?</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          If you have signed in but aren't in your usual account — don't worry. Your regular profile
          likely still exists. Try searching for it on BeatZa, or type the Profile URL into your
          browser's address bar.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">Did you sign in with Facebook?</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          If you signed in through Facebook and created a new account, your regular profile may not
          be attached to Facebook. Please do the following: delete the new profile through your
          Account Settings page, then sign into your regular profile using your email or full
          Profile URL. If you created a new account on a mobile device, sign out of the new account
          on the app and into your normal profile. You can delete your duplicate account at any time
          by signing in via Facebook through a computer browser.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">
          Did you sign in with your email address?
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you signed in through your email and created a new account, your regular profile isn't
          attached to the email you think it is. Please do the following:
        </p>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-4">
          <li>Delete the new profile through your Account Settings page.</li>
          <li>
            Send a password reset link by inputting your Profile URL. This will send a password
            recovery link to the primary email registered to the BeatZa account.
          </li>
          <li>
            Search each of your email accounts for messages from BeatZa. The email that receives a
            password reset link is the one attached to your regular profile.
          </li>
        </ol>

        <h3 className="text-black text-sm font-semibold mb-2">Signing in on a mobile device</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          If you created a new account on a mobile device, account deletion is not available through
          the app at this time. Please sign out of the new account on the app and sign into your
          normal profile through the steps above. You can delete your duplicate account at any time
          by logging in with your email through a computer browser.
        </p>
      </article>
    </div>
  );
}
