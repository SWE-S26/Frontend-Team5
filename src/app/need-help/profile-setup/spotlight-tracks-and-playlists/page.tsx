import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SpotlightTracksAndPlaylists() {
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
        <h1 className="text-black text-2xl font-bold mb-6">Spotlight Tracks & Playlists</h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          If you wish to highlight one of your particularly noteworthy tracks you'd like others to
          enjoy first, we highly recommend using the Spotlight feature, which comes with the Artist
          (×1 track) and Artist Pro (up to 5 tracks) subscriptions. Sign up today to utilize this
          premium feature.
        </p>

        {/* Strategic use */}
        <h2 className="text-black text-lg font-bold mb-3">
          How can artists strategically use the Spotlight feature to maximize visibility and
          engagement?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          To make the most of the Spotlight feature:
        </p>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">
              Select Key Tracks and Playlists
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Use Spotlight to pin up to 5 tracks or playlists at the top of your profile. Choose
              tracks that best represent your brand or recent successful releases to draw immediate
              attention from visitors. Consider featuring a mix of popular tracks and new releases
              to keep your audience engaged.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">
              Reorder Spotlight Items for Maximum Impact
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              The Spotlight will be ordered from the most recent addition to the oldest. Arrange the
              order of tracks and playlists by dragging and dropping them within the Spotlight. This
              allows you to strategically place your most important content first.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Update Regularly</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Regularly refresh your Spotlight selection to keep your profile dynamic. This can help
              maintain engagement by showcasing new content or seasonal highlights that reflect your
              current artistic direction.
            </p>
          </div>
        </div>

        {/* Steps */}
        <h2 className="text-black text-lg font-bold mb-3">
          How do I add and manage tracks and playlists in Spotlight?
        </h2>

        <h3 className="text-black text-sm font-semibold mb-2">Using a computer</h3>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-4">
          <li>Click the "Edit Spotlight" button at the top of your public profile.</li>
          <li>
            Search for one of your tracks or playlists (within the latest 200 tracks and playlists
            on your profile) by typing the title or selecting from the drop-down menu.
          </li>
          <li>
            The drop-down menu shows the latest 15 publicly available tracks or playlists uploaded
            to your account.
          </li>
          <li>Once your items are selected, click the "Save" button.</li>
        </ol>

        <h3 className="text-black text-sm font-semibold mb-2">Using iOS</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          You can also edit your Spotlight directly from your iOS device by accessing the Spotlight
          edit mode, selecting your tracks or playlists, and saving your changes.
        </p>

        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-8">
          <p className="text-gray-600 text-xs leading-relaxed">
            <span className="font-semibold text-black">Note:</span> Private tracks and playlists
            cannot be added to the Spotlight feature.
          </p>
        </div>

        {/* Removing */}
        <h2 className="text-black text-lg font-bold mb-3">Removing from your Spotlight</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          To remove an item from Spotlight, go back into the Spotlight edit mode and click on the
          "X" at the top right-hand corner of the track or playlist. Click "Save" again to confirm.
        </p>

        {/* Can't find track */}
        <h2 className="text-black text-lg font-bold mb-3">
          What should you do if you can't find a track or playlist you want to add?
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Search by Title</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If the track or playlist doesn't appear in the drop-down menu, try searching for it by
              typing the exact title into the search bar.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Check for Restrictions</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Spotlight only includes the last 200 items uploaded to your account and does not
              support private tracks or playlists. If the content you're looking for is older or
              private, it won't be available for Spotlight.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
