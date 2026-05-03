"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSearch from "@/hooks/useSearch";
import WaveformCard from "@/components/layout/track-cards/WaveformCard";
import PlaylistWaveformCard from "@/components/layout/track-cards/WaveformPlaylist";
import User from "@/components/layout/User";
import { tracksService } from "@/services/tracks.service";
import { profileService } from "@/services/profile.service";
import { playlistsService } from "@/services/playlists.service";
import { Track as ApiTrack } from "@/types/tracks.types";
import { PlaylistDetail } from "@/types/playlists.types";
import { GetProfileResponse } from "@/types/profile.types";
import { SocialUser } from "@/types/social.types";

const PAGE_SIZE = 20;

interface SearchResult {
  id: string;
  type: string;
  title?: string;
  userId?: string;
  displayName?: string;
  profileImgLink?: string | null;
  followersCount?: number;
  trackCount?: number;
  isFollowed?: boolean;
  isFollowing?: boolean;
  followed?: boolean;
  following?: boolean;
  isFollowedByMe?: boolean;
}

interface SearchCounts {
  tracks?: number;
  users?: number;
  playlists?: number;
  albums?: number;
}

interface SearchData {
  counts: SearchCounts;
  results: SearchResult[];
}

interface ResolvedResult {
  id: string;
  type: string;
  track?: ApiTrack;
  profile?: GetProfileResponse;
  user?: SocialUser;
  playlist?: PlaylistDetail;
  artist?: string;
  title?: string;
  isRepost?: boolean;
  reposterId?: string;
  reposterName?: string;
}

const isTrackType = (type: string) => type === "track";
const isPlaylistType = (type: string) => type === "playlist";
const isUserType = (type: string) =>
  !isTrackType(type) && !isPlaylistType(type) && type !== "album" && type !== "albums";

const normalizeFollowFlag = (item: Partial<SearchResult>): boolean =>
  item.isFollowed ??
  item.isFollowing ??
  item.followed ??
  item.following ??
  item.isFollowedByMe ??
  false;

const extractTrackData = (payload: any): ApiTrack | null => {
  const track = payload?.data?.data ?? payload?.data ?? payload;
  return track ?? null;
};

const fetchTrackByIdWithFallback = async (id: string): Promise<ApiTrack | null> => {
  try {
    const res = await tracksService.getTrackById(id);
    return extractTrackData(res);
  } catch (error) {
    try {
      const res = await tracksService.getPublicTrackById(id);
      return extractTrackData(res);
    } catch {
      return null;
    }
  }
};

const buildUserFromSearchItem = (item: SearchResult): SocialUser | null => {
  const userId = item.userId ?? item.id;
  const displayName = item.displayName ?? item.title;
  if (!userId || !displayName) return null;
  return {
    userId,
    displayName,
    profileImgLink: item.profileImgLink ?? null,
    trackCount: item.trackCount ?? 0,
    followersCount: item.followersCount ?? 0,
    isFollowed: normalizeFollowFlag(item),
  };
};

const FILTER_TABS = [
  { label: "Everything", value: "everything" },
  { label: "Tracks", value: "tracks" },
  { label: "People", value: "users" },
  { label: "Playlists", value: "playlists" },
];

const DATE_RANGE_OPTIONS = [
  { label: "Past hour", value: "hour" },
  { label: "Past day", value: "day" },
  { label: "Past week", value: "week" },
  { label: "Past month", value: "month" },
  { label: "Past year", value: "year" },
  { label: "Any time", value: "all" },
];

const DURATION_OPTIONS = [
  { label: "< 2 min", value: "lt2" },
  { label: "2-10 min", value: "2to10" },
  { label: "10-30 min", value: "10to30" },
  { label: "> 30 min", value: "gt30" },
  { label: "Any length", value: "all" },
];

const USAGE_OPTIONS = [
  { label: "To modify commercially", value: "modify" },
  { label: "To use commercially", value: "commercial" },
  { label: "To share", value: "share" },
  { label: "To listen to", value: "listen" },
];

function ExpandableFilter({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === selected);
  const hasValue = selected !== "all" && selected !== "listen";

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between py-2 px-2.5 rounded-md text-sm transition-colors hover:bg-white-smoke/5 ${
          hasValue ? "text-white-smoke font-medium" : "text-silver"
        }`}
      >
        <span>{selectedOption?.label ?? label}</span>
        <span
          className="text-[10px] text-silver/60 transition-transform duration-150"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="pl-2.5 pb-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`block w-full text-left py-1.5 px-2.5 text-[13px] rounded-md transition-colors ${
                selected === opt.value
                  ? "text-white-smoke font-medium bg-white-smoke/10"
                  : "text-silver hover:text-white-smoke hover:bg-white-smoke/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TagFilter({
  tags,
  selectedTag,
  onSelect,
}: {
  tags: string[];
  selectedTag: string | null;
  onSelect: (tag: string) => void;
}) {
  return (
    <div className="mt-3">
      <p className="text-[11px] font-medium uppercase tracking-widest text-silver/50 mb-2 px-1">
        Tags
      </p>
      <div className="flex flex-wrap gap-1.5 px-1">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className={`text-[12px] px-2.5 py-1 rounded-full border transition-colors ${
              selectedTag === tag.toLowerCase()
                ? "bg-white text-black border-white font-medium"
                : "border-silver/40 text-silver hover:border-white-smoke/60 hover:text-white-smoke"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function LocationFilter({
  locations,
  selectedLocation,
  onSelect,
}: {
  locations: string[];
  selectedLocation: string | null;
  onSelect: (loc: string) => void;
}) {
  return (
    <div className="mt-3">
      <p className="text-[11px] font-medium uppercase tracking-widest text-silver/50 mb-2 px-1">
        Location
      </p>
      <div className="flex flex-col">
        {locations.map((loc) => (
          <button
            key={loc}
            onClick={() => onSelect(loc)}
            className={`text-left py-1.5 px-2.5 text-[13px] rounded-md transition-colors ${
              selectedLocation === loc
                ? "text-white-smoke font-medium bg-white-smoke/10"
                : "text-silver hover:text-white-smoke hover:bg-white-smoke/5"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileTabStrip({
  type,
  onTabClick,
}: {
  type: string;
  onTabClick: (value: string) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 md:hidden">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabClick(tab.value)}
          className={`shrink-0 px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap transition-colors border ${
            type === tab.value
              ? "bg-white-smoke text-chinese-black border-white-smoke"
              : "border-silver/30 text-silver hover:border-white-smoke/50 hover:text-white-smoke"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function MobileFilterDrawer({
  type,
  dateRange,
  onDateRangeChange,
  duration,
  onDurationChange,
  usage,
  onUsageChange,
  availableTags,
  selectedTag,
  onTagSelect,
  availableLocations,
  selectedLocation,
  onLocationSelect,
}: {
  type: string;
  dateRange: string;
  onDateRangeChange: (v: string) => void;
  duration: string;
  onDurationChange: (v: string) => void;
  usage: string;
  onUsageChange: (v: string) => void;
  availableTags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string) => void;
  availableLocations: string[];
  selectedLocation: string | null;
  onLocationSelect: (loc: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const hasActiveFilters =
    (type === "tracks" &&
      (dateRange !== "all" || duration !== "all" || usage !== "listen" || selectedTag !== null)) ||
    (type === "users" && selectedLocation !== null) ||
    ((type === "albums" || type === "playlists") && selectedTag !== null);

  const showFilters =
    type === "tracks" ||
    (type === "users" && availableLocations.length > 0) ||
    ((type === "albums" || type === "playlists") && availableTags.length > 0);

  if (!showFilters) return null;

  return (
    <div className="md:hidden mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] border transition-colors ${
          hasActiveFilters
            ? "border-white-smoke text-white-smoke"
            : "border-silver/30 text-silver hover:border-white-smoke/50 hover:text-white-smoke"
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
          <path
            d="M1 2.5h11M3 6.5h7M5 10.5h3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Filters
        {hasActiveFilters && (
          <span className="w-1.5 h-1.5 rounded-full bg-white-smoke inline-block" />
        )}
        <span
          className="text-[9px] text-silver/60 transition-transform duration-150"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="mt-3 p-4 rounded-xl border border-white-smoke/10 bg-white-smoke/5 space-y-4">
          {type === "tracks" && (
            <>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-silver/50 mb-2">
                  Date added
                </p>
                <div className="flex flex-wrap gap-2">
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onDateRangeChange(opt.value)}
                      className={`px-3 py-1 rounded-full text-[13px] border transition-colors ${
                        dateRange === opt.value
                          ? "bg-white-smoke text-chinese-black border-white-smoke font-medium"
                          : "border-silver/30 text-silver hover:border-white-smoke/50 hover:text-white-smoke"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-silver/50 mb-2">
                  Duration
                </p>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onDurationChange(opt.value)}
                      className={`px-3 py-1 rounded-full text-[13px] border transition-colors ${
                        duration === opt.value
                          ? "bg-white-smoke text-chinese-black border-white-smoke font-medium"
                          : "border-silver/30 text-silver hover:border-white-smoke/50 hover:text-white-smoke"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-silver/50 mb-2">
                  Usage
                </p>
                <div className="flex flex-wrap gap-2">
                  {USAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onUsageChange(opt.value)}
                      className={`px-3 py-1 rounded-full text-[13px] border transition-colors ${
                        usage === opt.value
                          ? "bg-white-smoke text-chinese-black border-white-smoke font-medium"
                          : "border-silver/30 text-silver hover:border-white-smoke/50 hover:text-white-smoke"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {type === "tracks" && availableTags.length > 0 && (
            <TagFilter tags={availableTags} selectedTag={selectedTag} onSelect={onTagSelect} />
          )}

          {type === "users" && availableLocations.length > 0 && (
            <LocationFilter
              locations={availableLocations}
              selectedLocation={selectedLocation}
              onSelect={onLocationSelect}
            />
          )}

          {(type === "albums" || type === "playlists") && availableTags.length > 0 && (
            <TagFilter tags={availableTags} selectedTag={selectedTag} onSelect={onTagSelect} />
          )}
        </div>
      )}
    </div>
  );
}

function SearchSidebar({
  type,
  onTabClick,
  dateRange,
  onDateRangeChange,
  duration,
  onDurationChange,
  usage,
  onUsageChange,
  availableTags,
  selectedTag,
  onTagSelect,
  availableLocations,
  selectedLocation,
  onLocationSelect,
}: {
  type: string;
  onTabClick: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (v: string) => void;
  duration: string;
  onDurationChange: (v: string) => void;
  usage: string;
  onUsageChange: (v: string) => void;
  availableTags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string) => void;
  availableLocations: string[];
  selectedLocation: string | null;
  onLocationSelect: (loc: string) => void;
}) {
  return (
    <div className="hidden md:block w-44 lg:w-52 shrink-0 pr-2 border-r border-white-smoke/5">
      <nav className="mb-2">
        <p className="text-[11px] font-medium uppercase tracking-widest text-silver/50 mb-2 px-1">
          Browse
        </p>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabClick(tab.value)}
            className={`flex items-center w-full py-2 px-2.5 mb-0.5 text-[15px] rounded-md font-medium transition-colors ${
              type === tab.value
                ? "bg-white-smoke/10 text-white-smoke"
                : "text-silver hover:text-white-smoke hover:bg-white-smoke/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {type === "tracks" && (
        <>
          <div className="h-px bg-white-smoke/5 my-3" />
          <p className="text-[11px] font-medium uppercase tracking-widest text-silver/50 mb-2 px-1">
            Filter results
          </p>
          <ExpandableFilter
            label="Added any time"
            options={DATE_RANGE_OPTIONS}
            selected={dateRange}
            onSelect={onDateRangeChange}
          />
          <ExpandableFilter
            label="Any length"
            options={DURATION_OPTIONS}
            selected={duration}
            onSelect={onDurationChange}
          />
          <ExpandableFilter
            label="To listen to"
            options={USAGE_OPTIONS}
            selected={usage}
            onSelect={onUsageChange}
          />
          {availableTags.length > 0 && (
            <TagFilter tags={availableTags} selectedTag={selectedTag} onSelect={onTagSelect} />
          )}
        </>
      )}

      {type === "users" && availableLocations.length > 0 && (
        <>
          <div className="h-px bg-white-smoke/5 my-3" />
          <LocationFilter
            locations={availableLocations}
            selectedLocation={selectedLocation}
            onSelect={onLocationSelect}
          />
        </>
      )}

      {(type === "albums" || type === "playlists") && availableTags.length > 0 && (
        <>
          <div className="h-px bg-white-smoke/5 my-3" />
          <TagFilter tags={availableTags} selectedTag={selectedTag} onSelect={onTagSelect} />
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={<div className="max-w-4xl mx-auto px-4 py-8 text-silver">Loading search...</div>}
    >
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "everything";
  const { search, loading, error } = useSearch();

  const [results, setResults] = useState<SearchData | null>(null);
  const [resolvedResults, setResolvedResults] = useState<ResolvedResult[]>([]);
  const [resolving, setResolving] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const DATE_RANGE_DEFAULT = "all";
  const DURATION_DEFAULT = "all";
  const USAGE_DEFAULT = "listen";

  const [dateRange, setDateRange] = useState(
    () => searchParams.get("dateRange") ?? DATE_RANGE_DEFAULT
  );
  const [duration, setDuration] = useState(() => searchParams.get("duration") ?? DURATION_DEFAULT);
  const [usage, setUsage] = useState(() => searchParams.get("usage") ?? USAGE_DEFAULT);
  const [selectedTag, setSelectedTag] = useState<string | null>(
    () => searchParams.get("tag")?.toLowerCase() ?? null
  );
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    () => searchParams.get("location") ?? null
  );

  const MOCK_TRACK_TAGS = [
    "Pop",
    "Folk & singer-songwriter",
    "Electronic",
    "Dance & edm",
    "Alternative rock",
    "Rock",
    "Indie",
    "R&b & soul",
    "Hip-hop & rap",
  ];
  const MOCK_ALBUM_TAGS = [
    "Rock",
    "Pop",
    "Alternative",
    "Electronic",
    "Dance",
    "House",
    "Dance & edm",
    "Alternative rock",
    "Hip-hop & rap",
  ];
  const MOCK_PLAYLIST_TAGS = [
    "Rock",
    "Pop",
    "World",
    "Dance & edm",
    "Alternative rock",
    "Hip hop",
    "Hip-hop & rap",
    "R&b",
    "Electronic",
  ];
  const MOCK_LOCATIONS = [
    "Abu dhabi",
    "Tennessee",
    "Denver",
    "London",
    "Amsterdam",
    "Toronto",
    "Batna city",
    "Chico",
    "Abington",
  ];

  const availableTags =
    type === "tracks"
      ? MOCK_TRACK_TAGS
      : type === "albums"
        ? MOCK_ALBUM_TAGS
        : type === "playlists"
          ? MOCK_PLAYLIST_TAGS
          : [];

  const availableLocations = type === "users" ? MOCK_LOCATIONS : [];

  const sentinelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef(search);
  const nextOffsetRef = useRef(0);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const totalCountForType = useCallback(
    (counts: SearchCounts | undefined, selectedType: string) => {
      if (!counts) return null;
      if (selectedType === "tracks") return counts.tracks ?? 0;
      if (selectedType === "users") return counts.users ?? 0;
      if (selectedType === "playlists") return counts.playlists ?? 0;
      if (selectedType === "albums") return counts.albums ?? 0;
      return (
        (counts.tracks ?? 0) + (counts.users ?? 0) + (counts.playlists ?? 0) + (counts.albums ?? 0)
      );
    },
    []
  );

  const resolveResults = useCallback(async (items: SearchResult[]) => {
    if (!items.length) return [];

    const trackIds = items.filter((it) => isTrackType(it.type)).map((it) => it.id);
    const playlistIds = items.filter((it) => isPlaylistType(it.type)).map((it) => it.id);

    const userItems = items.filter((it) => isUserType(it.type));
    const directUserMap = new Map<string, SocialUser>();
    userItems.forEach((item) => {
      const directUser = buildUserFromSearchItem(item);
      if (directUser) directUserMap.set(item.id, directUser);
    });

    const userIds = userItems
      .filter((item) => !directUserMap.has(item.id))
      .map((item) => item.userId ?? item.id);

    const [trackResults, playlistResults, profileResults] = await Promise.all([
      trackIds.length
        ? Promise.allSettled(trackIds.map((id) => fetchTrackByIdWithFallback(id)))
        : Promise.resolve([]),
      playlistIds.length
        ? Promise.allSettled(playlistIds.map((id) => playlistsService.getPlaylistById(id)))
        : Promise.resolve([]),
      userIds.length
        ? Promise.allSettled(userIds.map((id) => profileService.getProfile(id)))
        : Promise.resolve([]),
    ]);

    const trackMap = new Map<string, ApiTrack>();
    (trackResults as PromiseSettledResult<any>[]).forEach((r, i) => {
      if (r.status === "fulfilled" && r.value) trackMap.set(trackIds[i], r.value);
    });

    const playlistMap = new Map<string, PlaylistDetail>();
    (playlistResults as PromiseSettledResult<any>[]).forEach((r, i) => {
      if (r.status === "fulfilled") {
        const pl = r.value.data?.data?.playlist;
        const detail = Array.isArray(pl) ? pl[0] : pl;
        if (detail) playlistMap.set(playlistIds[i], detail);
      }
    });

    const profileMap = new Map<string, GetProfileResponse>();
    (profileResults as PromiseSettledResult<any>[]).forEach((r, i) => {
      if (r.status !== "fulfilled") return;
      const payload = r.value?.data;
      const profile = payload?.data ?? payload;
      if (profile?.userId) profileMap.set(userIds[i], profile);
    });

    const playlistArtistIds = new Set<string>();
    (playlistResults as PromiseSettledResult<any>[]).forEach((r) => {
      if (r.status === "fulfilled") {
        const pl = r.value.data?.data?.playlist;
        const detail = Array.isArray(pl) ? pl[0] : pl;
        if (detail?.artistId) playlistArtistIds.add(detail.artistId);
      }
    });

    const creatorMap = new Map<string, string>();
    const missingArtistIds = Array.from(playlistArtistIds).filter((id) => !creatorMap.has(id));
    if (missingArtistIds.length) {
      const creatorResults = await Promise.allSettled(
        missingArtistIds.map((id) => playlistsService.getPlaylistCreator(id))
      );
      (creatorResults as PromiseSettledResult<any>[]).forEach((r, i) => {
        if (r.status === "fulfilled") {
          const artist = r.value.data?.data?.artist;
          const creator = Array.isArray(artist) ? artist[0] : artist;
          if (creator?.displayName) creatorMap.set(missingArtistIds[i], creator.displayName);
        }
      });
    }

    return items.map((it) => {
      if (isTrackType(it.type))
        return {
          id: it.id,
          type: "track",
          track: trackMap.get(it.id),
          isRepost: (it as any).isRepost ?? (it as any).is_repost ?? false,
          reposterId: (it as any).actorId ?? (it as any).reposterId ?? (it as any).userId,
          reposterName: (it as any).displayName ?? (it as any).reposterName ?? undefined,
        };
      if (isPlaylistType(it.type)) {
        const playlist = playlistMap.get(it.id);
        return {
          id: it.id,
          type: "playlist",
          playlist,
          artist: playlist?.artistId ? creatorMap.get(playlist.artistId) : undefined,
          isRepost: (it as any).isRepost ?? (it as any).is_repost ?? false,
          reposterId: (it as any).actorId ?? (it as any).reposterId ?? (it as any).userId,
          reposterName: (it as any).displayName ?? (it as any).reposterName ?? undefined,
        };
      }

      const directUser = directUserMap.get(it.id);
      const fallbackProfile = profileMap.get(it.userId ?? it.id);
      const userFromProfile: SocialUser | undefined = fallbackProfile
        ? {
            userId: fallbackProfile.userId,
            displayName: fallbackProfile.displayName,
            profileImgLink: fallbackProfile.profileImgLink,
            trackCount: fallbackProfile.trackCount,
            followersCount: fallbackProfile.followersCount,
            isFollowed: fallbackProfile.isFollowed ?? normalizeFollowFlag(it),
          }
        : undefined;

      return {
        id: it.id,
        type: "user",
        profile: fallbackProfile,
        user: directUser ?? userFromProfile,
        title: it.title,
      };
    });
  }, []);

  const loadPage = useCallback(
    async (replace: boolean) => {
      if (!q.trim()) return;
      if (loadingMoreRef.current) return;

      loadingMoreRef.current = true;
      setLoadingMore(true);

      try {
        const currentOffset = replace ? 0 : nextOffsetRef.current;
        const res = await searchRef.current({
          q,
          type,
          dateRange,
          duration,
          usage,
          offset: currentOffset,
          limit: PAGE_SIZE,
        });

        const page = res ?? null;
        const pageResults = page?.results ?? [];
        const resolvedPageResults = await resolveResults(pageResults);

        if (replace) {
          setResults(page);
          setResolvedResults(resolvedPageResults);
        } else {
          setResults((prev) =>
            prev ? { ...prev, results: [...prev.results, ...pageResults] } : page
          );
          setResolvedResults((prev) => [...prev, ...resolvedPageResults]);
        }

        const loadedCount = replace ? pageResults.length : currentOffset + pageResults.length;
        nextOffsetRef.current = loadedCount;

        const totalExpected = totalCountForType(page?.counts, type);
        if (totalExpected !== null) {
          setHasMore(loadedCount < totalExpected);
        } else {
          setHasMore(pageResults.length === PAGE_SIZE);
        }
      } finally {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    },
    [q, type, dateRange, duration, usage, resolveResults, totalCountForType]
  );

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setResults(null);
      setResolvedResults([]);
      setHasMore(true);
      nextOffsetRef.current = 0;
      loadingMoreRef.current = false;
      setLoadingMore(false);
      if (!q.trim()) return;
      setResolving(true);
      try {
        const res = await searchRef.current({
          q,
          type,
          dateRange,
          duration,
          usage,
          offset: 0,
          limit: PAGE_SIZE,
        });
        if (cancelled) return;
        const page = res ?? null;
        setResults(page);
        const pageResults = page?.results ?? [];
        setResolvedResults(await resolveResults(pageResults));
        nextOffsetRef.current = pageResults.length;
        const totalExpected = totalCountForType(page?.counts, type);
        if (totalExpected !== null) {
          setHasMore(pageResults.length < totalExpected);
        } else {
          setHasMore(pageResults.length === PAGE_SIZE);
        }
      } finally {
        if (!cancelled) setResolving(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [q, type, dateRange, duration, usage, resolveResults, totalCountForType]);

  useEffect(() => {
    if (!hasMore || loading || loadingMore || resolving || !results?.results?.length) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadPage(false);
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, resolving, results?.results?.length, loadPage]);

  const handleTabClick = (tabValue: string) => {
    setSelectedTag(null);
    setSelectedLocation(null);
    setDateRange("all");
    setDuration("all");
    setUsage("listen");
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q);
    params.set("type", tabValue);
    router.push(`/search?${params.toString()}`);
  };

  const foundText = (() => {
    if (!results?.counts) return "";
    const counts = results.counts;
    if (type === "everything") {
      const parts: string[] = [];
      if ((counts.playlists ?? 0) > 0) parts.push(`${counts.playlists}+ playlists`);
      if ((counts.tracks ?? 0) > 0) parts.push(`${counts.tracks}+ tracks`);
      if ((counts.users ?? 0) > 0) parts.push(`${counts.users} people`);
      if ((counts.albums ?? 0) > 0) parts.push(`${counts.albums}+ albums`);
      return parts.join(", ");
    }
    if (type === "tracks") return `${counts.tracks ?? 0}+ tracks`;
    if (type === "users") return `${counts.users ?? 0} people`;
    if (type === "albums") return `${counts.albums ?? 0}+ albums`;
    if (type === "playlists") return `${counts.playlists ?? 0}+ playlists`;
    return "";
  })();

  const pushWithParams = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams();
    const qVal = q.trim();
    if (qVal) params.set("q", qVal);
    if (type) params.set("type", type);

    const current = Object.fromEntries(Array.from(searchParams.entries()));
    const merged = { ...current, ...updates };

    if (merged.dateRange && merged.dateRange !== DATE_RANGE_DEFAULT)
      params.set("dateRange", merged.dateRange);
    if (merged.duration && merged.duration !== DURATION_DEFAULT)
      params.set("duration", merged.duration);
    if (merged.usage && merged.usage !== USAGE_DEFAULT) params.set("usage", merged.usage);
    if (merged.tag) params.set("tag", String(merged.tag).toLowerCase());
    if (merged.location) params.set("location", merged.location);

    router.push(`/search?${params.toString()}`);
  };

  const sharedFilterProps = {
    dateRange,
    onDateRangeChange: (v: string) => {
      setDateRange(v);
      pushWithParams({ dateRange: v });
    },
    duration,
    onDurationChange: (v: string) => {
      setDuration(v);
      pushWithParams({ duration: v });
    },
    usage,
    onUsageChange: (v: string) => {
      setUsage(v);
      pushWithParams({ usage: v });
    },
    availableTags,
    selectedTag,
    onTagSelect: (tag: string) => {
      const tagLower = tag.toLowerCase();
      const newTag = selectedTag === tagLower ? null : tagLower;
      setSelectedTag(newTag);
      pushWithParams({ tag: newTag ?? null });
    },
    availableLocations,
    selectedLocation,
    onLocationSelect: (loc: string) => {
      const newLoc = selectedLocation === loc ? null : loc;
      setSelectedLocation(newLoc);
      pushWithParams({ location: newLoc ?? null });
    },
  };

  useEffect(() => {
    const nextDate = searchParams.get("dateRange") ?? DATE_RANGE_DEFAULT;
    const nextDuration = searchParams.get("duration") ?? DURATION_DEFAULT;
    const nextUsage = searchParams.get("usage") ?? USAGE_DEFAULT;
    const nextTag = searchParams.get("tag") ?? null;
    const nextLocation = searchParams.get("location") ?? null;

    const changed =
      nextDate !== dateRange ||
      nextDuration !== duration ||
      nextUsage !== usage ||
      nextTag !== selectedTag ||
      nextLocation !== selectedLocation;

    setDateRange(nextDate);
    setDuration(nextDuration);
    setUsage(nextUsage);
    setSelectedTag(nextTag ? nextTag.toLowerCase() : null);
    setSelectedLocation(nextLocation);

    if (changed) {
      nextOffsetRef.current = 0;
      void loadPage(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-8">
      {/* Mobile: tab strip + filter drawer sit above results */}
      <div className="md:hidden mb-4">
        <MobileTabStrip type={type} onTabClick={handleTabClick} />
        <MobileFilterDrawer type={type} {...sharedFilterProps} />
      </div>

      {/* Desktop: sidebar + content side by side */}
      <div className="flex gap-6 lg:gap-8">
        <SearchSidebar type={type} onTabClick={handleTabClick} {...sharedFilterProps} />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {foundText && <p className="text-silver text-sm mb-4">Found {foundText}</p>}

          {loading && !results && <div className="text-silver">Loading…</div>}
          {error && <div className="text-anger">{error}</div>}

          {!error && results && (
            <div>
              {resolving && resolvedResults.length === 0 ? (
                <div className="text-silver">Loading results…</div>
              ) : resolvedResults.length === 0 ? (
                <div className="text-silver">No results found.</div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {resolvedResults.map((r) => (
                    <ResultCard key={r.id} result={r} />
                  ))}
                  {hasMore && <div ref={sentinelRef} className="h-10" />}
                  {loadingMore && <div className="text-silver">Loading more…</div>}
                </div>
              )}
            </div>
          )}

          {!loading && !error && !results && q.trim() && (
            <div className="text-silver">No results found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ result }: { result: ResolvedResult }) {
  if (result.type === "track") {
    if (!result.track)
      return <div className="p-4 bg-off-black text-silver rounded-lg">Track data unavailable</div>;
    return (
      <WaveformCard
        trackId={result.track.trackId ?? ""}
        title={result.track.basicInfo?.title}
        artist={result.track.basicInfo?.mainArtists?.[0]}
        img={result.track.image?.imgLink}
        trackUrl={result.track.audio?.audioLink}
        wfLink={result.track.audio?.waveformLink}
        duration={result.track.durationInSeconds}
        tag={result.track.basicInfo?.tags?.[0]}
        audioClipStart={result.track.audioClip?.start}
        audioClipEnd={result.track.audioClip?.end}
        likeCount={result.track.numLikes}
        repostCount={result.track.numReposts}
        commentsCount={result.track.numComments}
        playsCount={result.track.numPlays}
        isLikedByUser={result.track.isLikedByUser}
        isRepostedByUser={result.track.isRepostedByUser}
        isRepost={result.isRepost}
        reposterId={result.reposterId}
        reposterName={result.reposterName}
        enableDirectDownload={result.track.permissions?.enableDirectDownload ?? false}
      />
    );
  }

  if (result.type === "playlist") {
    if (!result.playlist)
      return (
        <div className="p-4 bg-off-black text-silver rounded-lg">Playlist data unavailable</div>
      );
    return (
      <PlaylistWaveformCard
        playlistId={result.playlist._id}
        title={result.playlist.title}
        artist={result.artist || "Unknown Artist"}
        img={result.playlist.image?.imgLink}
        tag={result.playlist.genre}
        likeCount={result.playlist.numOfLikes}
        repostCount={result.playlist.numOfReposts}
        isLikedByUser={result.playlist.isLiked}
        isRepostedByUser={result.playlist.isReposted}
        preloadedTracks={(result.playlist.tracks ?? []).map((track, index) => {
          const playlistTrack = track as any;
          return {
            _id: playlistTrack?._id ?? `${result.playlist?._id ?? result.id}-track-${index}`,
            basicInfo: playlistTrack?.basicInfo ?? {
              title: playlistTrack?.title ?? "Unknown Title",
              mainArtists: playlistTrack?.basicInfo?.mainArtists ?? [
                playlistTrack?.artist ?? "Unknown Artist",
              ],
              permalink: playlistTrack?.basicInfo?.permalink ?? "",
            },
            audio: playlistTrack?.audio ?? {
              audioLink: playlistTrack?.trackUrl ?? playlistTrack?.audioLink ?? "",
              waveformLink:
                playlistTrack?.audio?.waveformLink ?? playlistTrack?.wfLink ?? "/waveform.json",
            },
            image: playlistTrack?.image ?? { imgLink: playlistTrack?.img ?? undefined },
            durationInSeconds: playlistTrack?.durationInSeconds ?? playlistTrack?.duration ?? 0,
            numOfPlays: playlistTrack?.numOfPlays ?? 0,
            numOfLikes: playlistTrack?.numOfLikes ?? 0,
            isLiked: playlistTrack?.isLiked ?? playlistTrack?.isLikedByUser ?? false,
            isReposted: playlistTrack?.isReposted ?? playlistTrack?.isRepostedByUser ?? false,
          };
        })}
        totalTracks={result.playlist.totalTracks}
        isRepost={result.isRepost}
        reposterId={result.reposterId}
        reposterName={result.reposterName}
      />
    );
  }

  if (result.type === "user") {
    const user: SocialUser = result.user ?? {
      userId: result.profile?.userId ?? result.id,
      displayName: result.profile?.displayName ?? result.title ?? "Unknown User",
      profileImgLink: result.profile?.profileImgLink ?? null,
      trackCount: result.profile?.trackCount ?? 0,
      followersCount: result.profile?.followersCount ?? 0,
      isFollowed: result.profile?.isFollowed ?? false,
    };
    return <User user={user} />;
  }

  return (
    <div className="p-4 bg-off-black text-silver rounded-lg">
      Unknown result type: {result.type}
    </div>
  );
}
