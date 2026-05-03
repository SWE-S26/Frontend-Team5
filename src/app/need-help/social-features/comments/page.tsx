import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Comments() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link
          href="/need-help/social-features"
          className="hover:text-black transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={12} />
          Social Features
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-8">Comments</h1>

        {/* Commenting Basics */}
        <h2 className="text-black text-lg font-bold mb-3">Commenting Basics</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          As a fan, give immediate feedback to your favourite creators. Creators, tell your
          followers how much you appreciate them. Comments drive creative connection for all users.
        </p>

        {/* Leaving a comment */}
        <h2 className="text-black text-lg font-bold mb-3">Leaving a comment</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          You can write a comment on a track through the text box below the waveform that says
          "Write a comment..." and press your return or enter key to send. You can also mention
          another user by adding @ before their Profile URL, like this:{" "}
          <span className="font-medium text-black">@alex</span>. The comment will appear at the
          point on the waveform where you first started typing. Alternatively, you can click any
          free space in the comment section to leave a comment at that specific point.
        </p>

        {/* Reply */}
        <h2 className="text-black text-lg font-bold mb-3">Reply to a comment</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          To reply to a comment you are viewing, click the user avatar on the waveform, or click
          "Reply" next to the comment on the track page. To cancel, click anywhere outside of the
          current waveform. You can visit a commenter's profile by clicking their Display Name.
        </p>

        {/* Delete a comment (as author) */}
        <h2 className="text-black text-lg font-bold mb-3">Delete a comment</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you are the author of the comment, you can view a list of all comments you have made by
          clicking "view all" on the right-hand side of your profile or adding{" "}
          <span className="font-medium text-black">/comments</span> to the end of your Profile URL.
          From there, click the trash can icon next to the comment you would like to delete.
        </p>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-8">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> There is no way to restore
            comments that have been deleted. Once a comment has been deleted, it is permanently
            removed from the track.
          </p>
        </div>

        {/* Manage Comments in Artist Studio */}
        <h2 className="text-black text-lg font-bold mb-3">Manage Comments in Artist Studio</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Artist Studio organizes all your track comments chronologically, making it easy to track
          and respond to fan feedback directly on the platform.
        </p>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> This feature is exclusive to
            Artist Pro subscribers.
          </p>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          Comments can be seen and replied to from either your Artist Studio dashboard or on BeatZa
          directly.
        </p>

        {/* Hide or disable */}
        <h2 className="text-black text-lg font-bold mb-3">Hide or disable a comment</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you would like to hide or disable your track's comments from being publicly available,
          you can do so with our <span className="font-medium text-black">Quiet Mode</span> feature,
          available with an Artist Pro subscription. Quiet Mode allows you to:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-8">
          <li>Choose if you'd like people to be able to comment on your tracks.</li>
          <li>Choose to have comments displayed.</li>
          <li>Choose if you'd like to have stats displayed.</li>
        </ul>

        {/* Delete from track */}
        <h2 className="text-black text-lg font-bold mb-3">Delete a comment from your track</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          To remove a comment from one of your tracks, go to the track's page and hover over the
          comment below the waveform. Click the trash can icon that appears — this will remove the
          comment and give you the option to report it as spam. Deleting comments is only available
          through our website.
        </p>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-8">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> There is no way to restore
            deleted comments. Once deleted, a comment is permanently removed from the track.
          </p>
        </div>

        {/* Why comments not appearing */}
        <h2 className="text-black text-lg font-bold mb-3">
          Why are comments not appearing on my track?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          There are a few reasons why comments may not be appearing on your track:
        </p>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Quiet Mode</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you have an Artist Pro subscription, check whether Quiet Mode is enabled on your
              track. If it is, comments will be hidden from the waveform and track page. You can
              check this in the track's edit page under the Permission tab.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">
              You replaced your track's file
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you recently replaced your track's file with a shorter version, comments that were
              on the previously longer portion will still appear in the comments section but won't
              show avatars on the waveform.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Comments were deleted</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you received a notification that someone left a comment but it's not visible on the
              track page, it means the commenter deleted it before you could read it.
            </p>
          </div>
        </div>

        {/* Can't make or reply */}
        <h2 className="text-black text-lg font-bold mb-3">Can't make or reply to a comment</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          If you're having trouble making or replying to a comment, it could be because you have
          been temporarily blocked from using this feature, or because you have not yet confirmed
          the email address on your account.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          We have spam detection systems that block users who post large numbers of similar or
          identical comments within 24 hours to people who haven't recently interacted with them. We
          can't remove these blocks early, and Artist Pro accounts don't receive preferential
          treatment. We recommend making each comment unique and reducing the total number of
          comments you make in a day.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          To confirm your email address, go to your account settings page. A confirmed address
          appears as <span className="font-medium text-black">example@email.com (Primary)</span>. If
          unconfirmed, it will show{" "}
          <span className="font-medium text-black">
            (Not confirmed — Resend confirmation email)
          </span>
          . Click the link to resend the confirmation email.
        </p>

        {/* Mobile */}
        <h2 className="text-black text-lg font-bold mb-3">Comments on mobile — Android and iOS</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          Mobile commenting lets the BeatZa community connect anytime, anywhere by sharing feedback
          and praise on exact moments within tracks, fostering conversation and collaboration.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">
          How do I leave a comment on mobile?
        </h3>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-6">
          <li>Click the mini-player to toggle to the full-screen player.</li>
          <li>
            Click the comment icon at the bottom of the full-screen player at the exact moment you'd
            like to comment.
          </li>
          <li>
            Click the "add comment" box, write your comment, and click the orange arrow icon to
            send.
          </li>
        </ul>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> Comments are displayed
            chronologically from top to bottom. When entering the comments section on mobile, you
            will be taken to the most recent comments at the bottom.
          </p>
        </div>

        <h3 className="text-black text-sm font-semibold mb-2">
          Is commenting different between Web and mobile?
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          On Web, comments are visible on the waveform. On mobile, comments are timestamped but not
          visible on the waveform.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">Can I report a comment for spam?</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Yes. To report a comment, long-press the comment and tap "Report comment." Our Trust &
          Safety team reviews and takes action against comments that violate our community
          guidelines.
        </p>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> After reporting, the comment may
            still be visible on Web. To fully remove it from all platforms, use the "Delete comment"
            option.
          </p>
        </div>

        <h3 className="text-black text-sm font-semibold mb-2">Can I delete a comment on mobile?</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          To delete a comment, long-press the comment and tap "Delete comment." Once deleted, the
          comment will no longer be visible to anyone on any platform.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">
          I can't open a link from a comment
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          For security reasons, links cannot be opened directly from a comment on mobile. You can
          always access a link through your comments on Web.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">
          Can I @mention someone in a comment?
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">Yes, you can either:</p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-3">
          <li>Tap a comment to reply to the user who posted it, or</li>
          <li>
            Use @ followed by a user's account permalink (not their display name), followed by your
            comment, so they get notified on Web about receiving a new comment from you.
          </li>
        </ul>
        <p className="text-gray-700 text-sm leading-relaxed">
          Example: To notify a user, comment{" "}
          <span className="font-medium text-black">@username Nice track!!</span> — not their display
          name. The placement of your @mention in the comment doesn't matter, and @mentioning
          without any other text will still notify the mentioned account.
        </p>
      </article>
    </div>
  );
}
