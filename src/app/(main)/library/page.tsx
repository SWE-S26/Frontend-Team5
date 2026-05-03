"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";

import { useAppSelector } from "@/store/hooks";
import { useGetLikedTracks } from "@/hooks/useTracks";
import { useGetMyPlaylists } from "@/hooks/usePlaylists";
import { useGetFollowing } from "@/hooks/useSocial";
import { useGetPlaylistHistory } from "@/hooks/useHistory";

import TrackCard from "@/components/ui/TrackCard";
import PlaylistCard from "@/components/ui/PlaylistCard";
import EmptyCard from "@/components/social-graph/EmptyCard";
import UserCard from "@/components/social-graph/UserCard";

import { Track } from "@/types/tracks.types";
import { Playlist } from "@/types/playlists.types";
import { HistoryPlaylist } from "@/types/history.types";
import { SocialUser } from "@/types/social.types";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_PREVIEW = 5;
const GRID_COLS = 6;

// ─── View All Card ────────────────────────────────────────────────────────────

function ViewAllCard({ href, circular = false }: { href: string; circular?: boolean }) {
  return (
    <Link href={href} className="no-underline">
      <div
        className={`w-full aspect-square bg-off-black flex items-center justify-center cursor-pointer hover:bg-white-smoke/10 transition-colors ${
          circular ? "rounded-full" : "rounded"
        }`}
      >
        <span className="text-white-smoke font-bold text-sm">View all</span>
      </div>
    </Link>
  );
}

// ─── Section Skeleton ─────────────────────────────────────────────────────────

function SectionSkeleton({ circular = false }: { circular?: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 animate-pulse">
          <div
            className={`w-full aspect-square bg-white-smoke/10 ${
              circular ? "rounded-full" : "rounded"
            }`}
          />
          {!circular && (
            <>
              <div className="h-3 bg-white-smoke/10 rounded w-3/4" />
              <div className="h-3 bg-white-smoke/10 rounded w-1/2" />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
  loading,
  circular = false,
}: {
  title: string;
  children: React.ReactNode;
  loading: boolean;
  circular?: boolean;
}) {
  return (
    <div className="mb-10 sm:mb-12">
      <p className="font-bold text-sm sm:text-base text-white-smoke mb-3 sm:mb-4">{title}</p>
      {loading ? <SectionSkeleton circular={circular} /> : children}
    </div>
  );
}

// ─── Grid builder ─────────────────────────────────────────────────────────────
// Shows first MAX_PREVIEW items + ViewAll as 6th slot (if items exist),
// or all empty cards when empty.

function buildSlots<T>(
  items: T[],
  viewAllHref: string,
  renderItem: (item: T, index: number) => React.ReactNode,
  circular = false
): React.ReactNode[] {
  if (items.length === 0) {
    return Array.from({ length: GRID_COLS }, (_, i) => <EmptyCard key={`empty-${i}`} />);
  }

  const preview = items.slice(0, MAX_PREVIEW);
  const slots: React.ReactNode[] = preview.map((item, i) => renderItem(item, i));

  // 6th slot is always View all when there are items
  slots.push(<ViewAllCard key="view-all" href={viewAllHref} circular={circular} />);

  return slots;
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function LibraryFooter() {
  return (
    <div className="text-xs text-silver leading-6 mt-10">
      {[
        "Legal",
        "Privacy",
        "Cookie Policy",
        "Cookie Manager",
        "Imprint",
        "Artist Resources",
        "Newsroom",
        "Charts",
        "Transparency Reports",
      ].map((label, i, arr) => (
        <span key={label}>
          <span className="hover:text-white-smoke cursor-pointer">{label}</span>
          {i < arr.length - 1 && " · "}
        </span>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Overview() {
  const userId = useAppSelector((state) => state.auth.userId);

  const {
    getPlaylistHistory,
    playlists: historyPlaylists,
    loading: historyLoading,
  } = useGetPlaylistHistory();
  const { getLikedTracks, tracks: likedTracks, loading: likesLoading } = useGetLikedTracks();
  const { getMyPlaylists, playlists: myPlaylists, loading: playlistsLoading } = useGetMyPlaylists();
  const { getFollowing, following, loading: followingLoading } = useGetFollowing();

  useEffect(() => {
    void getPlaylistHistory();
    void getMyPlaylists();
    if (userId) {
      void getLikedTracks(userId);
      void getFollowing(userId);
    }
  }, [userId, getPlaylistHistory, getMyPlaylists, getLikedTracks, getFollowing]);

  // Dedupe history playlists
  const uniqueHistoryPlaylists = useMemo(() => {
    const seen = new Set<string>();
    return (historyPlaylists ?? []).filter((p) => {
      if (seen.has(p._id)) return false;
      seen.add(p._id);
      return true;
    });
  }, [historyPlaylists]);

  // Most-recently-liked first
  const orderedLikes = useMemo(() => (likedTracks ?? []).slice().reverse(), [likedTracks]);

  return (
    <div className="flex flex-col min-h-full px-4 sm:px-6 lg:px-0">
      {/* ── Recently Played ── */}
      <Section title="Recently played" loading={historyLoading}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-2">
          {buildSlots<HistoryPlaylist>(uniqueHistoryPlaylists, "/library/history", (p) => (
            <PlaylistCard
              key={p._id}
              playlistId={p._id}
              title={p.title}
              artist={p.description}
              img={p.image?.url || undefined}
              isLikedByUser={p.isLikedByUser}
              type={p.playlistType}
              artistId={p.artistId}
            />
          ))}
        </div>
      </Section>

      {/* ── Likes ── */}
      <Section title="Likes" loading={likesLoading}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-2">
          {buildSlots<Track>(orderedLikes, "/library/likes", (track) => (
            <TrackCard
              key={track.trackId}
              trackId={track.trackId}
              trackUrl={track.audio.audioLink}
              title={track.basicInfo.title}
              artist={track.basicInfo.mainArtists?.[0]}
              img={track.image?.imgLink}
              duration={track.durationInSeconds}
              isLikedByUser={track.isLikedByUser}
            />
          ))}
        </div>
      </Section>

      {/* ── Playlists ── */}
      <Section title="Playlists" loading={playlistsLoading}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-2">
          {buildSlots<Playlist>(myPlaylists ?? [], "/library/playlists", (p) => (
            <PlaylistCard
              key={p._id}
              playlistId={p._id}
              title={p.title}
              artist={p.description}
              img={p.image?.imgLink || undefined}
              isLikedByUser={p.isLiked}
              type={p.playlistType}
              artistId={p.artistId}
            />
          ))}
        </div>
      </Section>

      {/* ── Following ── */}
      <Section title="Following" loading={followingLoading} circular>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-2">
          {buildSlots<SocialUser>(
            following ?? [],
            "/library/following",
            (user) => (
              <UserCard key={user.userId} user={user} />
            ),
            true
          )}
        </div>
      </Section>

      <div className="mt-auto pt-4">
        <LibraryFooter />
      </div>
    </div>
  );
}
