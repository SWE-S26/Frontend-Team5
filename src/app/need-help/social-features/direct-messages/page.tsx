import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function DirectMessages() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/need-help/social-features" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft size={12} />
          Social Features
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-4">Direct Messages</h1>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          Direct messaging on BeatZa makes it simpler than ever to share what you've been working on or listening
          to, and talk with your fans or fellow artists.
        </p>

        {/* Write or reply */}
        <h2 className="text-black text-lg font-bold mb-4">How do I write or reply to a message?</h2>

        <h3 className="text-black text-sm font-semibold mb-2">Web</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Click on the envelope icon in the top right of your navigation bar to get to your messages. Clicking a
          conversation will expand it to show the full thread and any shared tracks. Messages are grouped into
          conversations ordered newest to oldest.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          To reply, write in the text box below the conversation. You can link to other BeatZa profiles by adding @
          before their Profile URL, or add a track or playlist. Start a new conversation by clicking the "Write new"
          button, or from the envelope icon on a user's profile. You can also share a track or playlist at any time
          via the Message tab in the Share button below the track's waveform.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">Android app</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          Click on the envelope icon on the top right of your Home screen to get to your messages. Clicking a message
          expands it to show the full conversation and any shared tracks. To reply, write in the text box below the
          conversation. You can send direct text messages or add a track or playlist.
        </p>

        {/* Mass message */}
        <h2 className="text-black text-lg font-bold mb-3">Can I send a message to all my followers at once?</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          We do not offer the ability to mass message on BeatZa. If you would like to share a track with all your
          followers, we recommend sharing it publicly — this guarantees it is pushed to everyone's Feed. Your
          followers can then repost your track to their own profile, helping new fans discover your music.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          You can share a track or playlist through a message at any time via the Share button.
        </p>

        {/* Share a track */}
        <h2 className="text-black text-lg font-bold mb-4">How do I share a track or playlist in a message?</h2>

        <h3 className="text-black text-sm font-semibold mb-2">Web</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Click the Share button below the track's waveform, go to the Message tab, and type in the recipient's
          Profile URL. If you follow them, their name will auto-fill. You can also share from your Messages section
          by clicking "Add track" to add one of your own tracks, or by pasting a track URL — the waveform will embed
          within the message.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">Android & iOS</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          You can share a track or playlist through a message at any time via the waveform button next to the text box.
        </p>

        {/* Delete */}
        <h2 className="text-black text-lg font-bold mb-4">How can I delete a message?</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          To archive a conversation, open the chat and click the small bin icon at the top right corner. You also
          have the option to report the message for spam, which helps our Trust & Safety team address spam on the platform.
        </p>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> If you delete a conversation and either you or
            the recipient writes again, the thread will reappear in its entirety.
          </p>
        </div>

        <h3 className="text-black text-sm font-semibold mb-2">Web</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Go to the message and click the trash can icon at the top. The conversation will only be deleted from your
          inbox and will still be visible from the other user's end.
        </p>

        <h3 className="text-black text-sm font-semibold mb-2">Deleting a single message within a conversation</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          It is not possible to delete a single message within a conversation. Make sure you're happy with what you
          want to say before pressing send.
        </p>

        {/* Can't send */}
        <h2 className="text-black text-lg font-bold mb-4">Can't send or reply to a message</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          There are a few reasons why you may not be able to send or reply to a message:
        </p>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Email needs to be confirmed</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              In order to send messages, your email must be confirmed. Check your Account Settings page to verify
              your email status. If needed, you can resend the confirmation email from there.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Recipient has chosen not to receive messages</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you receive an error, it may mean the user is not accepting messages from people they don't follow on BeatZa.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Recipient has blocked you</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              An error message may also indicate that the user has blocked you from contacting them on BeatZa.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Your message is too long</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Messages are limited to <span className="font-medium text-black">1,000 characters</span>.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">You have been temporarily blocked</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Sending a series of identical or nearly identical messages in a short period triggers our spam detection
              systems, resulting in a temporary block on the messaging feature. These blocks are fully automated and
              cannot be removed early — Artist Pro accounts receive no preferential treatment. The longer your history
              of spam warnings, the longer your resulting blocks will be. To avoid blocks, limit the number of messages
              you send in a row and keep each message as unique as possible.
            </p>
          </div>
        </div>

        {/* Controlling who messages you */}
        <h2 className="text-black text-lg font-bold mb-3">Controlling who messages you</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          You can control who can message you in your Privacy Settings page. You can choose to accept messages from
          anyone on BeatZa, or only from people you follow.
        </p>

        <h3 className="text-black text-sm font-semibold mb-3">
          What are the consequences of limiting who can message you?
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-black text-sm font-semibold mb-1">Impact on Communication</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Limiting messages to only people you follow reduces unwanted or spam messages, but may mean you miss
              opportunities to connect with new listeners, potential collaborators, or others interested in reaching out.
            </p>
          </div>
          <div>
            <h4 className="text-black text-sm font-semibold mb-1">Privacy Benefits</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Restricting messages to followers increases your privacy and control over interactions, helping protect
              you from unsolicited messages and ensuring only trusted users can contact you.
            </p>
          </div>
          <div>
            <h4 className="text-black text-sm font-semibold mb-1">Ease of Management</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Adjusting your message settings lets you tailor your communication experience to your needs — whether
              you want to be open to everyone or maintain contact with a select group.
            </p>
          </div>
        </div>
      </article>

    </div>
  )
}