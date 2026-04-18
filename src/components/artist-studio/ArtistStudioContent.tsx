"use client";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { FiBarChart2, FiDollarSign, FiGift, FiUsers } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { IoHeartOutline } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { TbRepeat } from "react-icons/tb";
import { useGetPostedTracks } from "@/hooks/useTracks";
import { useAppSelector } from "@/store/hooks";
import { pause, play, playAudio } from "@/store/slices/playerSlice";
import { RootState } from "@/store/store";
import { TOTAL_MINUTES_LIMIT } from "@/types/upload.types";
import { useDispatch } from "react-redux";
import { IoIosGlobe } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { ImEqualizer2 } from "react-icons/im";
import { BsLightningChargeFill } from "react-icons/bs";
import Image from "next/image";


export type ArtistTab =
  | "tracks"
  | "distribution"
  | "vinyl"
  | "comments"
  | "promotions";

type ArtistStudioContentProps = {
  activeTab: ArtistTab;
  onChangeTab: (tab: ArtistTab) => void;
};

type ArtistTrackRow = {
  id: string;
  title: string;
  label: string;
  duration: string;
  date: string;
  plays: number;
  likes: number;
  comments: number;
  reposts: number;
  hd: boolean;
  cover: string;
  url: string;
  isPrivate: boolean;
};

const TABS: { id: ArtistTab; label: string }[] = [
  { id: "tracks", label: "BeatZa Tracks" },
  { id: "distribution", label: "Distribution" },
  { id: "vinyl", label: "Vinyl Records" },
  { id: "comments", label: "Comments" },
  { id: "promotions", label: "Promotions" },
];

// Now icon and label are separate and can be changed independently
const TRACK_ACTIONS = [
  { label: "+ Upload or drop tracks", icon: null, route: "/upload" },
  { label: "Distribute tracks", icon: <IoIosGlobe />, route: "/artistpro" },
  { label: "Monetize tracks", icon: <RiMoneyDollarCircleLine />, route: "/artistpro" },
  { label: "Master track audio", icon: <ImEqualizer2 />, route: "/upload" },
];

const formatDuration = (durationInSeconds?: number | null) => {
  if (!durationInSeconds || durationInSeconds <= 0) return "--";
  const mins = Math.floor(durationInSeconds / 60);
  const secs = Math.floor(durationInSeconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const formatDate = (date?: string) => {
  if (!date) return "--";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const InsightsIcon = ({ className = "" }: { className?: string }) => (
  <Image
    src="/artists-icons/insights.svg"
    alt="Insights"
    width={24}
    height={24}
    className={`invert w-12 h-12 text-white-smoke ${className}`}
  />
);

const CoinIcon = ({ className = "" }: { className?: string }) => (
  <Image
    src="/artists-icons/coin.svg"
    alt="Insights"
    width={24}
    height={24}
    className={`invert w-12 h-12 text-white-smoke ${className}`}
  />
);

const GoldenHeartIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative w-12 h-12 ${className}`}>
    {/* Main icon */}
    <Image
      src="/artists-icons/heart-listening.svg"
      alt="Heart"
      width={48}
      height={48}
      className="invert w-12 h-12"
    />

    {/* Small overlay icon */}
    <Image
      src="/artists-icons/golden-star.svg"
      alt="Star"
      width={16}
      height={16}
      className="absolute top-0 ml-11 w-4 h-4"
    />
  </div>
);

const PurpleHeartIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative w-12 h-12 ${className}`}>
    {/* Main icon */}
    <Image
      src="/artists-icons/heart.svg"
      alt="Heart"
      width={48}
      height={48}
      className="invert w-12 h-12"
    />

    {/* Small overlay icon */}
    <Image
      src="/artists-icons/purple-star.svg"
      alt="Star"
      width={16}
      height={16}
      className="absolute top-0 ml-11 w-4 h-4"
    />
  </div>
);


function TrackRow({ track, isMobile }: { track: ArtistTrackRow; isMobile: boolean }) {
  const dispatch = useDispatch();
  const { currentTrackId, isPlaying } = useAppSelector((state: RootState) => state.player);
  const [isHovered, setIsHovered] = useState(false);
  const rowIsPlaying = String(currentTrackId) === String(track.id) && isPlaying;

  const togglePlay = () => {
    if (!track.url) return;
    if (rowIsPlaying) {
      dispatch(pause());
      return;
    }

    dispatch(
      playAudio({
        tracks: [
          {
            id: track.id,
            url: track.url,
            title: track.title,
            artist: track.label,
            img: track.cover,
          },
        ],
        startId: track.id,
      })
    );

    setTimeout(() => dispatch(play()), 0);
  };

  const trackCover = (
    <button
      type="button"
      onClick={togglePlay}
      className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-[#222]"
      aria-label={rowIsPlaying ? "Pause track" : "Play track"}
    >
      <img
        src={track.cover || "/test.jpg"}
        alt={track.title}
        className="h-full w-full object-cover"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.endsWith("/test.jpg")) return;
          target.src = "/test.jpg";
        }}
      />
      {(isHovered || rowIsPlaying) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          {rowIsPlaying ? (
            <div className="h-4 w-4 animate-pulse rounded-full bg-white" />
          ) : (
            <div className="h-4 w-4 rounded-full border-2 border-white" />
          )}
        </div>
      )}
    </button>
  );

  if (isMobile) {
    return (
      <div
        className={`border-b border-[#1e1e1e] px-3 py-2.5 ${
          isHovered || rowIsPlaying ? "bg-[#1a1a1a]" : "bg-transparent"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          {trackCover}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[13px] font-medium text-white">{track.title}</span>
              {track.hd && (
                <span className="shrink-0 rounded bg-[#555] px-1 py-px text-[9px] font-bold text-white">
                  HD
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#888]">{track.label}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid items-center border-b border-[#1e1e1e] px-3 py-2 transition-colors ${
        isHovered || rowIsPlaying ? "bg-[#1a1a1a]" : "bg-transparent"
      }`}
      style={{ gridTemplateColumns: "32px 1fr 80px 120px 220px 80px 130px 30px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      <div className="flex items-center">
        <input type="checkbox" className="accent-[#ff5500] h-3.5 w-3.5" />
      </div>

      {/* Track info */}
      <div className="flex min-w-0 items-center gap-3">
        {trackCover}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[13px] font-medium text-white">{track.title}</span>
            {track.hd && (
              <span className="shrink-0 rounded bg-[#555] px-1 py-px text-[9px] font-bold text-white">
                HD
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#888]">{track.label}</p>
        </div>
      </div>

      {/* Duration */}
      <div className="text-center text-[12px] text-[#aaa]">{track.duration}</div>

      {/* Date */}
      <div className="text-center text-[12px] text-[#aaa]">{track.date}</div>

      {/* Engagements */}
      <div className="flex items-center justify-center gap-3 text-[11px] text-[#777]">
        <span className="inline-flex items-center gap-1">
          <IoHeartOutline /> {track.likes > 0 ? track.likes : "-"}
        </span>
        <span className="inline-flex items-center gap-1">
          <FiMessageSquare /> {track.comments > 0 ? track.comments : "-"}
        </span>
        <span className="inline-flex items-center gap-1">
          <TbRepeat /> {track.reposts > 0 ? track.reposts : "-"}
        </span>
        <span className="inline-flex items-center gap-1">
          <FaRegClock /> -
        </span>
      </div>

      {/* Plays */}
      <div className="text-right text-[13px] font-semibold text-[#aaa]">{track.plays}</div>

      {/* Amplify button */}
      <div className="flex justify-center">
        <button
          type="button"
          className="flex items-center gap-1 rounded-full bg-linear-to-br from-[#7b4fff] to-[#5533ff] px-3 py-1 text-[11px] font-bold text-white"
        >
            <BsLightningChargeFill />
            Amplify
        </button>
      </div>

      {/* More options */}
      <div className="flex justify-center">
        <button type="button" className="text-[18px] text-[#666] hover:text-[#aaa]" aria-label="Track actions">
          ⋮
        </button>
      </div>
    </div>
  );
}

/* ── ARTIST PRO MEMBERSHIP BENEFITS ── */
const BENEFITS = [
  {
    img: "/artists-icons/man-headphones.svg",
    title: "Get 2 free months of Splice Sounds+ royalty-free samples",
    save: "Save $25.98",
    fallback: "Splice",
  },
  {
    img: "/artists-icons/send-campaign.svg",
    title: "Get 20% off all campaigns on Groover.co and free hype add-on",
    save: "Save $21",
    fallback: "Groover",
  },
  {
    img: "/artists-icons/dg-set.svg",
    title: "Get 1 month free of Native Instrument's 360 Pro suite",
    save: "Save $50",
    fallback: "Native Instruments",
  },
  {
    img: "/artists-icons/edit-tracks.svg",
    title: "Get 3 free months of Output's Arcade plug-in and samples",
    save: "Save $39",
    fallback: "Arcade",
  },
];

function ArtistProBenefits() {
  return (
    <div className="mt-8 rounded-lg border border-[#2a2a2a] bg-[#161616] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-white">Artist Pro Membership Benefits</h3>
          <p className="mt-1 text-[13px] text-[#888]">
            Jump start your music career with Artist Pro and immediately unlock $100+ in premium music tools and services.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full border border-white px-5 py-2 text-[13px] font-bold text-white hover:bg-white hover:text-black transition-colors"
        >
          See all
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {BENEFITS.map((b) => (
          <div key={b.title} className="overflow-hidden rounded-lg bg-[#1a1a1a]">
            <div className="relative h-36 w-full bg-linear-to-br from-[#2b2b2b] via-[#1d1d1d] to-[#111] object-cover overflow-hidden">
              <img
                src={b.img}
                alt={b.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
              {/* Half-diagonal overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                aria-label="Black cover"
                style={{
                  width: '100%',
                  height: '100%',
                  clipPath: 'polygon(0 0, 60% 0, 40% 100%, 0% 100%)',
                  background: 'rgba(0,0,0,0.7)',
                }}
              ></div>
              <span className="pointer-events-none absolute bottom-3 left-3 text-[18px] font-bold text-white/85 z-20">
                {b.fallback}
              </span>
            </div>
            <div className="p-3">
              <p className="text-[12px] font-semibold leading-tight text-white">{b.title}</p>
              <span className="mt-2 inline-block rounded bg-[#2a7a2a] px-2 py-0.5 text-[11px] font-bold text-white">
                {b.save}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TRACKS TAB ── */
function TracksTab({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.userId);
  const { getPostedTracks, tracks: postedTracks, loading } = useGetPostedTracks();
  const [filter, setFilter] = useState<"public" | "private">("public");
  const [search, setSearch] = useState("");
  const [durationById, setDurationById] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!userId) return;
    void getPostedTracks(userId);
  }, [userId, getPostedTracks]);

  const rows = useMemo<ArtistTrackRow[]>(() => {
    const source = postedTracks ?? [];
    return source
      .map((track) => ({
        id: track._id,
        title: track.basicInfo.title,
        label: track.basicInfo.mainArtists?.length
          ? track.basicInfo.mainArtists.join(", ")
          : "Unknown Artist",
        duration: formatDuration((track as { durationInSeconds?: number }).durationInSeconds),
        date: formatDate(track.releaseDate),
        plays: track.numPlays ?? 0,
        likes: track.numLikes ?? 0,
        comments: track.numComments ?? 0,
        reposts: track.numReposts ?? 0,
        hd: false,
        cover: track.image?.imgLink || "/test.jpg",
        url: track.audio?.audioLink || track.audioLink || "",
        isPrivate: Boolean(track.basicInfo.isPrivate),
      }))
      .filter((row) => (filter === "public" ? !row.isPrivate : row.isPrivate))
      .filter((row) => row.title.toLowerCase().includes(search.toLowerCase()));
  }, [postedTracks, filter, search]);

  useEffect(() => {
    rows.forEach((row) => {
      if (!row.url || row.duration !== "--" || durationById[row.id]) return;

      const audio = new Audio(row.url);
      const onLoadedMetadata = () => {
        setDurationById((prev) => ({
          ...prev,
          [row.id]: formatDuration(audio.duration),
        }));
      };
      audio.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    });
  }, [rows, durationById]);

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {TRACK_ACTIONS.map((action, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => router.push(action.route)}
            className="flex items-center gap-2 rounded-md border border-[#3a3a3a] bg-transparent px-5 py-3 text-[18px] font-semibold text-white transition-colors hover:border-[#555]"
          >
            {action.icon && <span>{action.icon}</span>}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Filter + search bar */}
      <div className={`mb-0 flex flex-wrap items-center gap-2.5`}>
        <div className={`relative ${isMobile ? "w-full" : "w-72"}`}>
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#666] text-[14px]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracks"
            className="w-full rounded-full border border-[#333] bg-transparent py-1.5 pl-9 pr-3 text-[13px] text-white outline-none placeholder:text-[#666] focus:border-[#555]"
          />
        </div>

        <button
          type="button"
          onClick={() => setFilter("public")}
          className={`rounded-full border px-5 py-1.5 text-[13px] transition-colors ${
            filter === "public"
              ? "border-white text-white"
              : "border-[#444] text-[#888] hover:border-[#666]"
          }`}
        >
          Public
        </button>

        <button
          type="button"
          onClick={() => setFilter("private")}
          className={`rounded-full border px-5 py-1.5 text-[13px] transition-colors ${
            filter === "private"
              ? "border-white text-white"
              : "border-[#444] text-[#888] hover:border-[#666]"
          }`}
        >
          Private
        </button>

        <div className={`flex items-center gap-2 text-[13px] ${isMobile ? "w-full justify-between" : "ml-auto"}`}>
          <span className="font-semibold text-white">{rows.length} tracks</span>
          <button type="button" className="flex items-center gap-1 text-[#888] hover:text-white">
            <span>↕</span>
            <span>Date</span>
          </button>
        </div>
      </div>

      {/* Table header */}
      {!isMobile && (
        <div
          className="mt-4 grid border-b border-[#2a2a2a] px-3 pb-2"
          style={{ gridTemplateColumns: "32px 1fr 80px 120px 220px 80px 130px 30px" }}
        >
          <div className="flex items-center">
            <input type="checkbox" className="accent-[#ff5500] h-3.5 w-3.5" />
          </div>
          <div className="text-[11px] font-bold tracking-[0.8px] text-[#888]">TRACKS</div>
          <div className="text-center text-[11px] font-bold tracking-[0.8px] text-[#888]">DURATION</div>
          <div className="text-center text-[11px] font-bold tracking-[0.8px] text-[#888]">DATE</div>
          <div className="text-center text-[11px] font-bold tracking-[0.8px] text-[#888]">ENGAGEMENTS</div>
          <div className="text-right text-[11px] font-bold tracking-[0.8px] text-[#888]">PLAYS</div>
          <div />
          <div />
        </div>
      )}

      {loading && <div className="px-3 py-6 text-[13px] text-[#888]">Loading tracks…</div>}
      {!loading && rows.length === 0 && (
        <div className="px-3 py-6 text-[13px] text-[#888]">No tracks found.</div>
      )}

      {!loading &&
        rows.map((track) => (
          <TrackRow
            key={track.id}
            track={{ ...track, duration: durationById[track.id] || track.duration }}
            isMobile={isMobile}
          />
        ))}

      {/* Artist Pro benefits section at bottom */}
      <ArtistProBenefits />
    </div>
  );
}

/* ── DISTRIBUTION TAB ── */
const STREAMING_PLATFORMS = [
  { name: "Spotify", mark: "Spotify", className: "font-bold" },
  { name: "Apple Music", mark: "Apple Music", className: "font-medium" },
  { name: "Deezer", mark: "DEEZER", className: "font-semibold tracking-[1px]" },
  { name: "Amazon Music", mark: "amazon music", className: "font-semibold lowercase" },
  { name: "TikTok", mark: "TikTok", className: "font-bold" },
  { name: "Instagram", mark: "Instagram", className: "font-medium" },
  { name: "YouTube", mark: "YouTube", className: "font-bold" },
  { name: "TIDAL", mark: "TIDAL", className: "font-semibold tracking-[2px]" },
  { name: "Pandora", mark: "pandora", className: "font-semibold lowercase" },
];

function DistributionTab() {
  const router = useRouter();

  return (
    <div className="space-y-10">
      {/* Hero section */}
      <div className="flex flex-col gap-6 border-b border-[#262626] pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-[28px] font-bold leading-tight text-white">
            Distribute your music to Spotify, Apple Music, YouTube, and more
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#aaa]">
            As an Artist Pro subscriber, you get unlimited music distribution to all the major streaming
            platforms like Spotify, YouTube Music, Apple Music, TIDAL, and more all around the world. You'll
            also be able to get your music on to social media like Instagram, TikTok, Facebook and others —
            extending your reach and audience.
          </p>
          <button
            type="button"
            onClick={() => router.push("/artistpro")}
            className="mt-4 rounded-full bg-white px-7 py-2.5 text-[14px] font-bold text-black hover:bg-[#eee] transition-colors"
          >
            Get Artist Pro
          </button>
        </div>

        {/* Decorative platform orb */}
        <div className="hidden lg:flex shrink-0">
          <div className="relative h-64 w-80">
            <div className="absolute right-14 top-7 h-40 w-40 rounded-full bg-[#c5b1e4]" />
            <div className="absolute right-4 top-2 h-12 w-12 rounded-xl bg-[#7b3cff]" />
            <div className="absolute right-0 top-28 h-12 w-12 rounded-xl bg-[#7b3cff]" />
            <div className="absolute right-20 top-50 h-12 w-12 rounded-xl bg-[#7b3cff]" />
            <div className="absolute right-16 top-8 h-40 w-40 rounded-full border-12 border-[#7c40ff]" />
            <div className="absolute right-24 top-16 h-24 w-24 rotate-12 border-[5px] border-[#925dff]" />
          </div>
        </div>
      </div>

      {/* Platform logos */}
      <div className="mt-2 grid grid-cols-3 gap-x-8 gap-y-6 border-b border-[#262626] pb-8 md:grid-cols-5 lg:grid-cols-9">
        {STREAMING_PLATFORMS.map((platform) => (
          <div key={platform.name} className="flex min-h-8 items-center justify-center text-[#f0f0f0] opacity-90">
            <span className={`text-[18px] ${platform.className}`}>{platform.mark}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="mt-2 border-t border-[#262626] pt-8">
        <h3 className="mb-6 text-[18px] font-bold text-white">How it works</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              num: "1",
              title: "Select your membership",
              body: "Choose the membership plan that works best for you. Get started with distribution for as little as $3.25 a month.",
            },
            {
              num: "2",
              title: "Create your release",
              body: "We'll guide you through the simple steps to add credits and release information to make sure you get paid for your plays.",
            },
            {
              num: "3",
              title: "We'll deliver your tracks",
              body: "We'll double-check your release to help ensure it is successfully delivered to Spotify, Apple Music, TIDAL and so many more.",
            },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-4">
              <span className="shrink-0 text-[60px] font-black leading-none text-[#2a2a2a]">
                {step.num}
              </span>
              <div className="pt-3">
                <h4 className="text-[15px] font-bold text-white">{step.title}</h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#888]">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── VINYL TAB ── */
function VinylTab() {
  const router = useRouter();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="flex flex-col gap-6 border-b border-[#262626] pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded bg-[#333] px-2 py-0.5 text-[10px] font-bold text-yellow-400">
              ★ ARTIST PRO
            </span>
          </div>
          <h2 className="text-[28px] font-bold leading-tight text-white">
            Your music. On vinyl. On demand
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-[#aaa]">
            We're partnering with elasticStage to{" "}
            <span className="font-semibold text-white">
              release your albums on vinyl, on-demand, with no up-front cost to you.
            </span>
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#aaa]">
            You and your fans can purchase just one record or a thousand. Either way, you get paid for every sale.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/artistpro")}
              className="rounded-full bg-white px-7 py-2.5 text-[14px] font-bold text-black hover:bg-[#eee] transition-colors"
            >
              Get Artist Pro
            </button>
            <button
              type="button"
              className="rounded-full border border-[#444] bg-transparent px-7 py-2.5 text-[14px] font-bold text-white hover:border-[#666] transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Vinyl record visual */}
        <div className="hidden lg:flex shrink-0 items-center justify-center">
          <div className="relative h-64 w-80">
            <div className="absolute right-0 top-4 h-52 w-52 rounded-full border-[5px] border-[#333] bg-[#111] shadow-2xl" />
            <div className="absolute right-20 top-24 h-12 w-12 rounded-full border-2 border-[#999] bg-[#f2f2f2]" />
            <div className="absolute left-2 top-8 h-48 w-48 overflow-hidden border border-[#333] bg-[#171717]">
              <div className="p-4">
                <p className="text-[30px] font-black leading-none text-white">YOUR</p>
                <p className="text-[36px] font-black leading-none text-white">MUSIC</p>
                <p className="mt-1 text-[10px] font-semibold text-white">ON VINYL ON DEMAND</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No upfront cost section */}
      <div className="mt-10 border-t border-[#262626] pt-8">
        <h3 className="mb-5 text-[18px] font-bold text-white">No upfront cost to you</h3>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex items-start gap-5">
            <span className="shrink-0 text-[92px] font-black leading-none text-transparent [-webkit-text-stroke:2px_#8c8c8c]">
              $0
            </span>
            <div>
              <p className="text-[16px] font-bold text-white">You pay nothing to create a record.</p>
              <p className="mt-1 text-[13px] text-[#888]">
                Your fans pay for every purchase, and we pass the royalties on to you.
              </p>
            </div>
          </div>

          <div className="shrink-0 space-y-2">
            {[
              { label: "Your upfront cost", value: "$0" },
              { label: "Sales price for fan", value: "$39*" },
              { label: "Royalties you earn", value: "$11*" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-16">
                <span className="text-[14px] font-semibold text-white">{row.label}</span>
                <span className="text-[16px] font-black text-white">{row.value}</span>
              </div>
            ))}
            <p className="pt-1 text-[11px] text-[#666]">*Prices vary slightly due to currency conversions.</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-10 border-t border-[#262626] pt-8">
        <h3 className="mb-6 text-[18px] font-bold text-white">How it works</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              num: "1",
              title: "Create your new record from your tracks.",
              body: "Just pick your tracks on SoundCloud, add credits, upload artwork, and submit your new record for review.",
            },
            {
              num: "2",
              title: "We create a web page and list your record for sale.",
              body: "No need to worry about out-of-pocket fees or leftover stock. Each album will cost your fans around $39 plus shipping and handling. Learn more about pricing.",
            },
            {
              num: "3",
              title: "We print and ship your record. You get paid.",
              body: "Records are shipped to fans within weeks of their order. And every record sold means you get paid. Learn more about splits",
            },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-4">
              <span className="shrink-0 text-[60px] font-black leading-none text-[#2a2a2a]">
                {step.num}
              </span>
              <div className="pt-3">
                <h4 className="text-[15px] font-bold text-white">{step.title}</h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#888]">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── COMMENTS TAB ── */
const SAMPLE_COMMENTS = [
  { text: "Addicted 😍", color: "#ff6b6b" },
  { text: "I need a 10hr version", color: "#ff8c42" },
  { text: "nah this is sick 🔥", color: "#ff6b6b" },
];

function CommentsTab() {
  const router = useRouter();

  return (
    <div className="min-h-100 border-[#262626] pt-8">
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded bg-[#333] px-2 py-0.5 text-[10px] font-bold text-yellow-400">
              ★ ARTIST PRO
            </span>
          </div>
          <h2 className="mb-6 text-[32px] font-bold text-white">Every comment in one place</h2>
          <p className="max-w-xl text-[14px] leading-relaxed text-[#aaa]">
            With Artist Pro, you get access to Comments Hub which brings together every comment across all of your tracks,
            so you can easily see what fans are saying about you. Read, moderate and respond to your comments, all in one place.
          </p>

          <button
            type="button"
            onClick={() => router.push("/artistpro")}
            className="mt-6 rounded-full bg-white px-7 py-2.5 text-[14px] font-bold text-black hover:bg-[#eee] transition-colors"
          >
            Get Artist Pro
          </button>
        </div>

        <div className="relative h-56 w-full">
          {SAMPLE_COMMENTS.map((c, i) => (
            <div
              key={i}
              className="absolute rounded-full px-5 py-2 text-[14px] font-semibold text-[#1b1b1b] shadow-lg"
              style={{
                backgroundColor: "#f39f86",
                right: `${i * 32}px`,
                top: `${i * 52}px`,
              }}
            >
              {c.text}
              <div
                className="absolute -bottom-2 right-5 h-4 w-4 rotate-45"
                style={{ backgroundColor: "#f39f86" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── PROMOTIONS TAB ── */
const PROMOTION_CARDS = [
  {
    id: "spotify",
    bg: "#1a1a1a",
    logoBg: "#1DB954",
    title: "Pitch your track to Spotify",
    body: "Use Spotify for Artists to pitch an upcoming, unreleased song to their playlist editors. Pitching your song will also make it eligible to your followers' Release Radar playlists.",
    requirements: ["You can only pitch one track per release."],
    cta: "Visit Page",
    ctaStyle: "border",
  },
  {
    id: "amazon",
    bg: "#1a1a1a",
    logoBg: "#00A8E1",
    title: "Pitch your track to Amazon Music",
    body: "Use Amazon Music for Artists to pitch a new song to their playlist editors. You can pitch up to 14 days past release.",
    requirements: [
      "You can only pitch one track per release.",
      "If you do not have access to AMFA, you must first claim your account.",
    ],
    cta: "Visit Page",
    ctaStyle: "border",
  },
  {
    id: "groover",
    bg: "#1a1a1a",
    logoBg: "#FF4500",
    title: "Groover",
    body: "Promote your music, get listened to and receive GUARANTEED feedback. Groover connects artists who want to promote their music with the best curators, radios and labels seeking emerging talents.\n\nWith SoundCloud Artist Pro, you get 20% off your first Groover campaign and a free Hype add-on.",
    requirements: [],
    cta: "Get Started",
    ctaStyle: "border",
  },
];

function PromotionsTab() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {PROMOTION_CARDS.map((card) => (
        <article
          key={card.id}
          className="flex min-h-132.5 flex-col overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#161616]"
        >
          {/* Logo area */}
          <div className="flex h-48 items-center justify-center" style={{ backgroundColor: card.bg }}>
            {card.id === "spotify" && (
              <div className="text-[48px] font-bold" style={{ color: card.logoBg }}>
                Spotify®
              </div>
            )}
            {card.id === "amazon" && (
              <div className="text-center">
                <div className="text-[32px] font-bold text-white">amazon</div>
                <div className="text-[20px] font-bold text-white">music</div>
              </div>
            )}
            {card.id === "groover" && (
              <div className="text-center">
                <div className="text-[48px] font-bold" style={{ color: card.logoBg }}>
                  |||
                </div>
                <div className="text-[24px] font-bold" style={{ color: card.logoBg }}>
                  Groover
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col p-5">
            <h3 className="mb-3 text-[16px] font-bold text-white">{card.title}</h3>
            <p className="text-[13px] leading-relaxed text-[#aaa]">{card.body}</p>

            {card.requirements.length > 0 && (
              <div className="mt-3">
                <p className="mb-1 text-[12px] font-bold text-white">Eligibility requirements</p>
                <ul className="space-y-1">
                  {card.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-[#888]">
                      <span className="mt-0.5 text-[#666]">✦</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto flex justify-end pt-5">
              <button
                type="button"
                className="rounded-full bg-white px-5 py-2 text-[13px] font-bold text-black hover:bg-[#eee] transition-colors"
              >
                {card.cta}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ── ARTIST STUDIO STATS HEADER ── */
const STAT_ITEMS = [
  { label: "SC plays", value: "0" },
  { label: "Reposts", value: "0" },
  { label: "Downloads", value: "0" },
  { label: "Likes", value: "0" },
  { label: "Comments", value: "0" },
];

const ICON_ITEMS = [
  { label: "Insights", icon: InsightsIcon },
  { label: "Earnings", icon: CoinIcon },
  { label: "Fans", icon: GoldenHeartIcon },
  { label: "Benefits", icon: PurpleHeartIcon },
];

function ArtistStudioHeader() {
  return (
    <div className="w-full mb-6 rounded-lg border border-[#2a2a2a] bg-[#111] p-6">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-[24px] font-bold text-white">Artist Studio</h2>
        <span className="text-[12px] text-[#666]">All time stats updated daily.</span>
      </div>
      <div className="flex">
        <div className="flex flex-wrap items-center gap-19">
            {STAT_ITEMS.map((stat, i) => (
            <div
                key={stat.label}
                className={`flex flex-col gap-0.5 px-5 ${i > 0 ? "border-l border-[#2a2a2a]" : ""}`}
            >
                <span className="text-[22px] font-black text-white">{stat.value}</span>
                <span className="text-[11px] text-[#666]">{stat.label}</span>
            </div>
            ))}
        </div>
        <div className="flex flex-wrap items-center gap-22">
            {ICON_ITEMS.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 px-5">
                <item.icon className="text-[24px] text-[#d6d6d6]" />
                <span className="text-[11px] text-[#666]">{item.label}</span>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ── ROOT EXPORT ── */
export default function ArtistStudioContent({ activeTab, onChangeTab }: ArtistStudioContentProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 1024);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const totalMinutesUsed = 0;
  const usagePercent = Math.min(100, (totalMinutesUsed / TOTAL_MINUTES_LIMIT) * 100);

  const showHeader = true;

  return (
    <section className="min-h-screen bg-[#111] px-6 pb-4 pt-0">
      {/* Upload quota banner */}
      <div className="mb-6 rounded-lg border border-[#2a2a2a] bg-[#1f2023] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CloudUploadOutlined style={{ fontSize: 22, color: "#d0d0d0" }} />
            <span className="text-[15px] font-semibold text-white">{Math.round(usagePercent)}% of uploads used</span>
            <div className="relative h-1.5 w-48 rounded-full bg-[#474747]">
              <div
                className="absolute left-0 top-0 h-0.75 rounded-full bg-[#8f8f8f] transition-all duration-500"
                style={{ width: `${usagePercent || 1}%` }}
              />
            </div>
            <span className="text-[15px] text-[#d0d0d0]">
              {Math.round(totalMinutesUsed)} of {TOTAL_MINUTES_LIMIT} minutes
            </span>
          </div>
          <button
            type="button"
            className="rounded-full border border-[#444] bg-[#0e0e10] px-5 py-1.5 text-[14px] font-bold text-white hover:border-[#666] transition-colors"
          >
            Get unlimited uploads
          </button>
        </div>
      </div>

      {/* Artist Studio stats header */}
      {showHeader && <ArtistStudioHeader />}

      {/* Tab bar */}
      <div className="sticky top-11.5 z-100 flex overflow-x-auto overflow-y-hidden border-b border-[#222] bg-[#111] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-[13px] transition-colors ${
              activeTab === tab.id
                ? "border-white font-semibold text-white"
                : "border-transparent text-[#888] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-5">
        {activeTab === "tracks" && <TracksTab isMobile={isMobile} />}
        {activeTab === "distribution" && <DistributionTab />}
        {activeTab === "vinyl" && <VinylTab />}
        {activeTab === "comments" && <CommentsTab />}
        {activeTab === "promotions" && <PromotionsTab />}
      </div>
    </section>
  );
}