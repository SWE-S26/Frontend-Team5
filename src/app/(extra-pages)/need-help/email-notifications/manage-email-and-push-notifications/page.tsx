import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ManageEmailAndPushNotifications() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/need-help/email-notifications" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft size={12} />
          Email & Notifications
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-4">Manage Email & Push Notifications</h1>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          Use your Notifications Settings page on BeatZa to choose which updates you receive — including email
          notifications and push notifications on Android or iOS. Customize your preferences to stay informed about
          the activity that matters most to you.
        </p>

        {/* Notification Types */}
        <h2 className="text-black text-lg font-bold mb-4">Notification Types</h2>

        <h3 className="text-black text-sm font-semibold mb-2">Activity Notifications</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Artists may want to prioritize notifications that keep them informed about interactions with their content:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-6">
          <li><span className="font-medium text-black">New Follower</span> — Receive updates when someone follows you.</li>
          <li><span className="font-medium text-black">Reposts</span> — Get notified when someone reposts your track or playlist.</li>
          <li><span className="font-medium text-black">Likes and Comments</span> — Stay updated when someone likes or comments on your tracks or playlists.</li>
          <li><span className="font-medium text-black">Messages</span> — Be alerted when you receive a new message from fans or collaborators.</li>
        </ul>

        <h3 className="text-black text-sm font-semibold mb-2">BeatZa Updates</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Both artists and fans can benefit from staying informed about platform updates:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-8">
          <li><span className="font-medium text-black">New BeatZa Features</span> — Keep up with the latest product releases and features.</li>
          <li><span className="font-medium text-black">Surveys and Feedback</span> — Participate in feedback opportunities to shape future features.</li>
          <li><span className="font-medium text-black">Tips and Offers</span> — Learn about new ways to discover artists or improve your BeatZa experience.</li>
          <li><span className="font-medium text-black">BeatZa Newsletter</span> — Receive news and special offers from BeatZa and its partners.</li>
        </ul>

        {/* Managing mobile push */}
        <h2 className="text-black text-lg font-bold mb-3">Managing Mobile Push Notifications</h2>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Limit Notifications for Better Focus</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              BeatZa limits activity notifications to one every 24 hours. This helps prevent notification overload,
              especially for active artists.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Enable Push Notifications</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you've turned off push notifications in your mobile device's settings, you'll need to re-enable them
              to start receiving updates. Once enabled, return to your Notifications Settings to select which specific
              notifications you want on your mobile device.
            </p>
          </div>
        </div>

        {/* Not receiving */}
        <h2 className="text-black text-lg font-bold mb-3">Not Receiving Email Notifications?</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you're not receiving notifications from us, first check your Notifications Settings page to confirm
          your preferences are set correctly.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you are still having trouble, please check your spam folder. Adding BeatZa's notification email address
          to your address book will also help ensure our mail isn't identified as spam.
        </p>
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> It may still take a while for you to receive all
            mail consistently, as providers tend to leave notifications in blocking holds — often between one and six hours.
          </p>
        </div>
      </article>

    </div>
  )
}