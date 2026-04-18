import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ManageCommunicationsSettings() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/need-help/email-notifications" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft size={12} />
          Email & Notifications
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-8">Manage Communications Settings</h1>

        {/* Managing preferences */}
        <h2 className="text-black text-lg font-bold mb-3">
          How can users manage their communication preferences on BeatZa?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          To manage your communication preferences on BeatZa:
        </p>
        <div className="space-y-4 mb-10">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Access the Communications tab in your profile settings</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Visit your Communications Settings on the BeatZa website or mobile app. Here, you can select your
              preferences for receiving personalized news, tips, and offers from BeatZa.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Web and Mobile Versions</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              You can update these settings on both the web and mobile versions of BeatZa.
            </p>
          </div>
        </div>

        {/* GDPR */}
        <h2 className="text-black text-lg font-bold mb-3">
          What should users understand about GDPR compliance on BeatZa?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          BeatZa complies with the General Data Protection Regulation (GDPR) to protect user data. For more detailed
          information about GDPR and how your data is managed, please refer to our Privacy Policy. For further
          information about how to manage your BeatZa account, visit your Account Settings.
        </p>
      </article>

    </div>
  )
}