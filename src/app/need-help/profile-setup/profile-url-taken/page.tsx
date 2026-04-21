import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ProfileUrlTaken() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/need-help/profile-setup" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft size={12} />
          Profile Setup & Customization
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-6">The Profile URL I Want Is Taken</h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          If you encounter errors when trying to claim a URL, first ensure that the URL you want is unique, as BeatZa
          profile URLs are one of a kind. If the desired URL is already taken, try adding words like "music" or "band,"
          or use separators like <span className="font-medium text-black">-</span> or <span className="font-medium text-black">_</span> to
          create a unique URL. If you still get an error message or cannot save changes after following these steps,
          the URL may have been suspended and cannot be released.
        </p>

        <h2 className="text-black text-lg font-bold mb-3">
          How can I obtain an inactive URL from an existing user?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          Our support team is not currently able to manually transfer an inactive URL. We suggest messaging the profile
          owner to request a URL change. If they decline or don't respond, we cannot assist further. Some URLs may seem
          available but aren't, which you'll notice if the change fails. We cannot manually verify this as it's a
          self-serve process.
        </p>

        <h2 className="text-black text-lg font-bold mb-3">
          How can users report impersonation or trademark infringement?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          If you believe your desired Profile URL is in use by somebody impersonating you, you can report it to our
          support team. Additionally, if you own the live registered trademark to this name, you can contact us to find
          out more about what you can do. Evidence such as proof of trademark ownership or documentation of
          impersonation may be required for the report.
        </p>
      </article>

    </div>
  )
}