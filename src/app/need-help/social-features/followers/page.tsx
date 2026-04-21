import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function Followers() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/need-help/social-features" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft size={12} />
          Social Features
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-8">Followers</h1>

        {/* Follower basics */}
        <h2 className="text-black text-lg font-bold mb-3">Follower Basics</h2>

        <h3 className="text-black text-sm font-semibold mb-2">Following other people on BeatZa</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          You can follow anyone on BeatZa by clicking the "Follow" button on the right-hand side underneath their
          Profile Header image. By following another user, you will get their latest uploads in your Feed so you can
          listen to new music as it is released.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Artists can share music exclusively with their followers, giving them early access to upcoming tracks,
          work-in-progress demos, or releases before anyone else. Non-followers can see that the track exists but
          will be prompted to follow the artist to unlock it.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          You can review who you are following at any time by going to Following in your Library page.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">Suggested Follows</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          BeatZa app users on iOS and Android can find recommended people in their network to follow on the homepage.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">Your Followers</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Anytime you get a new follower on BeatZa, you will be notified in your Notifications tab on web or on the
          BeatZa app. You can see everyone that follows you on your profile page under "Followers."
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          If you have over 1,000 followers, the number will be rounded. You can hover over the rounded figure at any
          time to view the exact follower count.
        </p>

        {/* Block and Unblock */}
        <h2 className="text-black text-lg font-bold mb-4">How to Block and Unblock Users</h2>

        <h3 className="text-black text-sm font-semibold mb-2">How can I block someone on BeatZa?</h3>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-4">
          <li>Visit the profile of the user you wish to block.</li>
          <li>Click the three dots (…) in the top right corner.</li>
          <li>Select "Block" from the menu.</li>
        </ol>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          When you block a user, you will have the option to remove any reposts, likes, and comments they have made
          on your account, cleaning up their past interactions with your content.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">What are the consequences of blocking a user?</h3>
        <div className="space-y-3 mb-6">
          <div>
            <p className="text-black text-sm font-medium mb-0.5">Will they know they've been blocked?</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              The user does not receive a notification. Instead, they encounter an error message that reads "Something went wrong when trying to perform this action."
            </p>
          </div>
          <div>
            <p className="text-black text-sm font-medium mb-0.5">What happens to their interactions?</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              You can choose to remove all their reposts, likes, and comments from your account when blocking them.
            </p>
          </div>
          <div>
            <p className="text-black text-sm font-medium mb-0.5">How do I manage my blocked users?</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              You can view and manage blocked users in your Privacy Settings page, where you can also unblock them.
            </p>
          </div>
        </div>

        <h3 className="text-black text-sm font-semibold mb-2">How can I unblock someone?</h3>
        <div className="space-y-3 mb-4">
          <div>
            <p className="text-black text-sm font-medium mb-0.5">From Privacy Settings</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Go to your Privacy Settings page to see a list of all users you have blocked. You can unblock any user from this list.
            </p>
          </div>
          <div>
            <p className="text-black text-sm font-medium mb-0.5">From the user's profile</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Visit the profile of the blocked user and select the option to unblock them directly from their profile page.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-8">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> Unblocking a user does not automatically restore
            their previous interactions (likes, comments, reposts) on your account.
          </p>
        </div>

        {/* Follower count stuck */}
        <h2 className="text-black text-lg font-bold mb-3">Follower count is stuck and won't increase</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          You receive notifications when people follow you, but not when users unfollow you. This means that in the
          same period when people follow you, others may have unfollowed you, leading your follower count not to
          increase by the amount you were notified for. People can unfollow for a few reasons:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-4">
          <li>People choose to unfollow you.</li>
          <li>People remove their accounts.</li>
          <li>Batches of spam accounts in your followers have been removed from the platform.</li>
        </ul>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-8">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> Due to caching, displayed follower counts won't
            re-adjust until an action is made on your account — such as uploading a track, following someone new, or
            editing your profile.
          </p>
        </div>

        {/* Follower count dropping */}
        <h2 className="text-black text-lg font-bold mb-3">Follower count suddenly dropping</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Every time you take an action on your BeatZa account (signing in, uploading a track, following an account),
          your cache resets. This can cause jumps in follower counts. Your follower count can drop for two reasons:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-4">
          <li>People are unfollowing you.</li>
          <li>Batches of spam accounts in your followers have been removed from the platform — in cases of sudden drops, this is most likely the cause.</li>
        </ul>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          Our Trust & Safety team regularly detects and removes spam accounts. When these accounts are removed, any
          likes, reposts, or comments they previously made are also removed. Spam accounts interact widely across the
          community to appear more "real" — this is why you may notice sudden drops in these activities on your account.
        </p>

        {/* Can't follow */}
        <h2 className="text-black text-lg font-bold mb-4">Can't follow other users</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          If you are having problems following other users, it may be for a few different reasons:
        </p>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">You've hit the 2,000 following limit</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              The overall limit is 2,000 and applies to all subscriptions. This is a measure designed to reduce
              stability issues related to following a large number of accounts, such as problems loading your Stream
              or following page.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">You've been put in a temporary block</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              There are limits on the number of follow actions you can make within 24 hours and on re-following the
              same accounts within a short period. If you are repeatedly flagged for these activities, your account
              may be temporarily blocked from following or unfollowing. The duration of these blocks increases each
              subsequent time you hit these limits.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">422 — Unprocessable entity error</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-2">
              If you see a "422 — unprocessable entity" message, you may be experiencing a known caching issue. Here's how to work around it:
            </p>
            <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-1.5">
              <li>Choose any other user profile and follow them.</li>
              <li>Briefly afterward, unfollow that user to reset the cache.</li>
              <li>Return to the profile that was giving you the error. You should now be able to follow or unfollow as usual.</li>
            </ol>
          </div>
        </div>

        {/* Email notifications */}
        <h2 className="text-black text-lg font-bold mb-3">Not receiving email notifications about new followers</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          We no longer send new follower email notifications. This is to ensure that all emails are successfully
          delivered from BeatZa's email services — many of these emails were not being opened or were being reported
          as spam, which risked damaging our reputation with email providers.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed">
          You will still be notified about new followers via push notifications on the BeatZa Android app, as well
          as on-site notifications on your BeatZa profile.
        </p>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mt-4">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> We do not currently offer push notifications on iPhone or iPad apps.
          </p>
        </div>
      </article>

    </div>
  )
}