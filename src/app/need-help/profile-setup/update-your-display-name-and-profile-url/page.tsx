import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function UpdateYourDisplayNameAndProfileUrl() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link
          href="/need-help/profile-setup"
          className="hover:text-black transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={12} />
          Profile Setup & Customization
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-4">
          Update Your Display Name and Profile URL
        </h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          If other users are searching for you on BeatZa, make it as easy as possible for them to
          find your profile by keeping your display name and profile URL clear, correct, and
          concise.
        </p>

        {/* How to change */}
        <h2 className="text-black text-lg font-bold mb-3">How can I change my name or URL?</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          You can change your display name and profile URL by visiting your profile page via a web
          browser on your computer and clicking the Edit button under your profile header.
        </p>
        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> Changing your profile URL is not
            available through our mobile apps.
          </p>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          You can choose whichever display name you want. Be sure to display it as you would
          anywhere else, and feel free to include spaces and capital letters. You can also add your
          first and last name if you wish.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          To change your profile URL, click the little pen icon that appears beside your URL. Please
          note that you can only use numbers, lowercase letters, underscores, or hyphens in your
          URL.
        </p>

        {/* How often */}
        <h2 className="text-black text-lg font-bold mb-3">How often can I change my URL?</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          To reduce illicit activity on the platform, we have introduced limits on how many times
          users can change their URL within a given period. If you see an error, it likely means you
          have reached these limits. We suggest waiting until the following month and trying again,
          or reaching out to us via our support team.
        </p>

        {/* What happens */}
        <h2 className="text-black text-lg font-bold mb-3">
          What happens when you change your display name or profile URL?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Your new profile URL and display name will be immediately searchable on BeatZa, but may
          not appear in Google search right away. This depends on Google refreshing its cache, and
          BeatZa cannot influence it.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed">
          If you change your profile URL, this will affect all links and embedded players you might
          have posted previously. Embedded players posted after August 2010 will still play your
          tracks, but if the listener clicks through to the BeatZa page, they will be directed to an
          empty page. We do not offer redirect services when you change your profile URL.
        </p>
      </article>
    </div>
  );
}
