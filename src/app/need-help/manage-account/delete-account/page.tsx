import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function DeleteAccount() {
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
        <h1 className="text-black text-2xl font-bold mb-8">How Can I Delete My Account?</h1>

        <h2 className="text-black text-lg font-bold mb-3">BeatZa Web</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you're logged into your BeatZa account on web, here's how you can delete it:
        </p>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-8">
          <li>Go to your Account Settings.</li>
          <li>Click the "Delete account" button at the bottom of the page.</li>
        </ol>

        <h2 className="text-black text-lg font-bold mb-3">Android & iOS Apps</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          You can delete your account while signed in by going to your account settings and tapping
          "Delete account":
        </p>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-4">
          <li>Go to your avatar from the library screen.</li>
          <li>Go to "Settings."</li>
          <li>Then go to "Account."</li>
          <li>Click "Delete account."</li>
          <li>Confirm the account deletion.</li>
        </ol>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-8">
          <p className="text-gray-600 text-xs leading-relaxed">
            To delete your account, you must be signed in. If you are experiencing trouble signing
            in, please visit the Login Issues article for help first.
          </p>
        </div>

        <h2 className="text-black text-lg font-bold mb-3">Deletion Policy</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Protecting our users and their data is our first priority. If you delete your account, all
          data associated with it — including the sounds you have uploaded and the usage data
          associated with those sounds — will be deleted and may not be recoverable.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          If our Trust & Safety Team is contacted with a request to manually delete an account, we
          will always establish that we are being contacted by the account's verified owner before
          assisting. Our deletion policy upholds a user's right to remove their own account data,
          while protecting against account fraud and deletion without an account owner's consent.
        </p>

        <h2 className="text-black text-lg font-bold mb-3">Google Search Results</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          We don't have control over a deleted account link showing up in Google's search results.
          Google should catch up and recognize the deletion soon, but as they cache search results
          for faster loading times, they may keep your information if enough people have clicked on
          it in the past. To fully remove your profile from Google, you will need to contact Google
          directly by filling in their public removal form.
        </p>

        <h2 className="text-black text-lg font-bold mb-3">
          I tried to delete my account but it isn't going away
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          If you deleted your account, it will be put into a deletion queue. If you try to sign back
          in and get an error message saying that you are frozen, this means your deletion attempt
          has timed out and the account was not deleted properly. Please reach out to our support
          team to have a ticket created for you — a support agent will be in touch shortly after.
        </p>
      </article>
    </div>
  );
}
