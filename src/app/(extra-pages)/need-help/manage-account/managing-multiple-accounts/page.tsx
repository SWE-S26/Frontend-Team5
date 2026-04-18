import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ManagingMultipleAccounts() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/need-help/manage-account" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft size={12} />
          Manage My Account
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-8">Managing Multiple BeatZa Accounts</h1>

        <h2 className="text-black text-lg font-bold mb-3">
          What strategies can I use for managing multiple BeatZa accounts?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          It is not possible to merge two BeatZa accounts into a single account. However, if you need to consolidate
          your content:
        </p>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Keep accounts separate for different purposes</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Consider keeping multiple accounts for different purposes — for example, one for personal projects and
              another for collaborations. This lets you maintain distinct profiles and content without losing important
              data like stats and comments.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Delete one account and re-upload content</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              You can delete one of your accounts and re-upload the tracks from the deleted account to the active
              account you wish to keep. However, the stats, comments, and interactions associated with those tracks
              will not carry over — any engagement such as followers' comments and play counts will be lost.
            </p>
          </div>
        </div>

        <h2 className="text-black text-lg font-bold mb-3">
          What should I consider before deleting one of my accounts?
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Loss of followers and interactions</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              When you delete an account, you lose all the followers, likes, comments, and other interactions tied to
              it. Re-uploading tracks to a new account will not restore this data, which could impact your overall
              presence and engagement on the platform.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Impact on brand consistency</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If your accounts are part of a broader brand or project, consider how deleting one might affect your
              brand's consistency and reach. In some cases it may be more beneficial to maintain both accounts rather
              than consolidate them, to avoid losing valuable engagement data.
            </p>
          </div>
        </div>
      </article>

    </div>
  )
}