import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function IntroductionToBeatZa() {
  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link
          href="/need-help/getting-started"
          className="hover:text-black transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={12} />
          Getting Started
        </Link>
      </div>

      {/* Article */}
      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-6">Introduction to BeatZa</h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          Founded in 2007, BeatZa is an artist-first platform powered by a global community of
          artists and listeners on the pulse of what's new, now, and next in music culture. We
          empower independent artists with the tools, services, and resources they need to help them
          build and grow their careers. With 400+ million tracks from 40+ million artists from 193
          countries on BeatZa, we are the largest audio discovery platform in the world.
        </p>

        {/* Section: For Artists */}
        <h2 className="text-black text-lg font-bold mb-3">Who is BeatZa for?</h2>

        <h3 className="text-black text-base font-semibold mb-2">
          For Artists: Build Your Career on Your Terms
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          Whether you're just starting out or already growing your audience, BeatZa gives you the
          tools to own your journey.
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-4">
          <li>Upload and share your tracks instantly.</li>
          <li>Promote your releases and connect directly with your fans.</li>
          <li>Earn money when you're ready to monetize your music.</li>
        </ul>
        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          Start for free, or upgrade to Artist Pro to unlock advanced insights, promotional tools,
          and exclusive features designed to help you level up. Explore our Artist Resource Center
          for tips, tools, and inspiration to keep your career moving forward.
        </p>

        {/* Section: For Listeners */}
        <h3 className="text-black text-base font-semibold mb-2">
          For Listeners: Discover What's Next
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          BeatZa isn't just for streaming — it's for exploring. Dive into a world of new sounds
          before they hit the mainstream.
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-4">
          <li>Discover fresh music and rising artists.</li>
          <li>Support creators you love with likes, comments, and reposts.</li>
          <li>
            Go+ subscribers can save unlimited tracks and playlists for ad-free, offline listening —
            so the music never stops.
          </li>
        </ul>
        <p className="text-gray-700 text-sm leading-relaxed">
          Learn how to optimize your listening experience and make BeatZa your personal soundtrack
          to discovery.
        </p>
      </article>
    </div>
  );
}
