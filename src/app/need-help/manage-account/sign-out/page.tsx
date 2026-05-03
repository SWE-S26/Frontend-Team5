import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SignOut() {
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
        <h1 className="text-black text-2xl font-bold mb-8">Sign Out of Your Account</h1>

        <h2 className="text-black text-lg font-bold mb-3">On Web</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          To sign out of your account, click the three dots in the top navigation header, then
          select "Sign out." You will then be directed to a screen that confirms you have signed out
          successfully.
        </p>

        <h2 className="text-black text-lg font-bold mb-3">On Android</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          To sign out of your account from the Android app:
        </p>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-4">
          <li>
            Head to your Profile page by tapping the Library icon in the bottom right corner of the
            screen.
          </li>
          <li>Once on your Profile page, scroll to the bottom and tap "Sign Out."</li>
          <li>You'll see a pop-up message: "Signing out removes all downloaded tracks."</li>
        </ol>
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-gray-600 text-xs leading-relaxed">
            The pop-up is specifically relevant for Go or Go+ users — any music saved for offline
            listening will be removed from your device when you sign out. If you sign back into the
            same account later, your music and library will still be there, but you'll need to
            manually re-download any albums or playlists you want available offline.
          </p>
        </div>
      </article>
    </div>
  );
}
