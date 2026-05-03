import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AnatomyOfBeatZa() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link
          href="/need-help/getting-started"
          className="hover:text-black transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={12} />
          Getting Started
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-6">Anatomy of BeatZa</h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          BeatZa is built around a few core areas. Here's a quick tour of what you'll find and where
          to find it.
        </p>

        <h2 className="text-black text-base font-semibold mb-2">Home Feed</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          Your home feed surfaces new tracks and activity from artists you follow, trending content,
          and personalised recommendations. It's the fastest way to stay up to date with the music
          you care about.
        </p>

        <h2 className="text-black text-base font-semibold mb-2">Library</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          Your library holds everything you've saved — liked tracks, playlists, albums, and artists
          you follow. Access it any time from the main navigation.
        </p>

        <h2 className="text-black text-base font-semibold mb-2">Profile</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          Your public profile shows your uploaded tracks, playlists, followers, and following. You
          can customise your display name, profile image, header, bio, and links from the Settings
          page.
        </p>

        <h2 className="text-black text-base font-semibold mb-2">Upload</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">
          Artists can upload tracks directly from the upload button in the navigation bar. Supported
          formats include MP3, WAV, FLAC, AIFF, and more.
        </p>

        <h2 className="text-black text-base font-semibold mb-2">Settings</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Settings is where you manage your account — change your theme, update your date of birth
          and gender, manage privacy preferences, notification settings, and more.
        </p>
      </article>
    </div>
  );
}
