"use client";

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Reorder, useDragControls } from "framer-motion";
import {
  BadgeCheck,
  GripVertical,
  Heart,
  ImagePlus,
  ListPlus,
  Lock,
  MoreHorizontal,
  Play,
  Repeat2,
  Share2,
  ShieldCheck,
  Trash2,
  User,
  AudioLines,
} from "lucide-react";


import {
  useAddPlaylistToHistory,
  useDeletePlaylist,
  useGetPlaylistById,
  useGetPlaylistCreator,
  useGetRecommendedPlaylists,
  useReorderPlaylistTracks,
  useRemoveTrackFromPlaylist,
  useUpdatePlaylist,
  useUpdatePlaylistImage,
} from "@/hooks/usePlaylists";
import { useAudioProgress } from "@/hooks/useAudioProgress";
import { useLikePlaylistOptimistic } from "@/hooks/useLikes";
import { useRepostPlaylist } from "@/hooks/useReposts";
import SausageWaveform from "@/components/ui/SausageWaveform";
import { TrackRow as PlaylistTrackRow } from "@/components/layout/track-cards/WaveformPlaylist";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { pause, play, playAudio, playNext } from "@/store/slices/playerSlice";
import type { Playlist, PlaylistTrack } from "@/types/playlists.types";
import { Avatar } from "antd";
import { usePlaylistLikesList } from "@/hooks/useLikes";
import { usePlaylistRepostsList } from "@/hooks/useReposts";
import ProfilePopover from "@/components/layout/track-cards/ProfilePopover";
import { profileService } from "@/services/profile.service";
import { GetProfileResponse } from "@/types/profile.types";
import { PopoverProvider } from "@/components/layout/track-cards/PopoverContext"
import GoMobile from "@/components/layout/GoMobile";
import DeletePlaylistModal from "@/components/artist-studio/DeletePlaylistModal";
import EditPlaylistModal from "@/components/playlists/EditPlaylistModal";
import DeleteTrackFromPlaylistModal from "@/components/playlists/DeleteTrackFromPlaylistModal";


const FALLBACK_COVER = "/test.jpg";

function formatCount(value?: number | null) {
  const count = value ?? 0;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return `${count}`;
}

function formatDuration(seconds?: number | null) {
  const safeSeconds = Math.max(0, Math.floor(seconds ?? 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function mapTracksForPlayer(tracks: PlaylistTrack[]) {
  return tracks
    .filter((track) => track.audio?.audioLink)
    .map((track) => ({
      id: track._id,
      url: track.audio.audioLink,
      title: track.basicInfo.title,
      artist: track.basicInfo.mainArtists?.[0] ?? "Unknown artist",
      img: track.image?.imgLink ?? FALLBACK_COVER,
      duration: track.durationInSeconds,
    }));
}

function getFeaturedArtists(tracks: PlaylistTrack[]) {
  const artists = new Map<
    string,
    { name: string; tracks: number; plays: number; image: string }
  >();

  tracks.forEach((track) => {
    const names = track.basicInfo.mainArtists?.length
      ? track.basicInfo.mainArtists
      : ["Unknown artist"];

    names.forEach((name) => {
      const existing = artists.get(name);
      artists.set(name, {
        name,
        tracks: (existing?.tracks ?? 0) + 1,
        plays: (existing?.plays ?? 0) + (track.numOfPlays ?? 0),
        image: existing?.image ?? track.image?.imgLink ?? FALLBACK_COVER,
      });
    });
  });

  return [...artists.values()].sort((a, b) => b.plays - a.plays).slice(0, 3);
}

function RecommendedPlaylist({ playlist }: { playlist: Playlist }) {
  return (
    <Link
      href={`/playlist/${playlist._id}`}
      className="flex items-center gap-3 rounded-sm p-2 no-underline transition-colors hover:bg-white-smoke/5"
    >
      <img
        src={playlist.image?.imgLink || FALLBACK_COVER}
        alt=""
        className="h-12 w-12 shrink-0 rounded-sm object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white-smoke">
          {playlist.title}
        </p>
        <p className="truncate text-xs text-silver">
          {playlist.listOfTracks?.length ?? 0} tracks
        </p>
      </div>
    </Link>
  );
}

function ReorderableTrackRow({
  track,
  index,
  isOwner,
  isCurrent,
  isPlaying,
  onPlay,
  onReorderStart,
  onReorderEnd,
  onRemove,
}: {
  track: PlaylistTrack;
  index: number;
  isOwner: boolean;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onReorderStart: (trackId: string) => void;
  onReorderEnd: (trackId: string) => void;
  onRemove?: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={track}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={() => onReorderEnd(track._id)}
      className="list-none"
      whileDrag={{
        scale: 1.01,
        zIndex: 20,
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
      }}
      transition={{ type: "spring", stiffness: 450, damping: 34 }}
    >
      <div className="group/reorder flex items-center rounded-sm transition-colors hover:bg-white-smoke/5">
        {isOwner && (
          <button
            type="button"
            aria-label="Drag to reorder track"
            onPointerDown={(event) => {
              onReorderStart(track._id);
              dragControls.start(event);
            }}
            className="flex h-13 w-8 shrink-0 cursor-grab items-center justify-center text-silver opacity-50 transition-opacity hover:text-white-smoke hover:opacity-100 active:cursor-grabbing group-hover/reorder:opacity-100"
          >
            <GripVertical className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <PlaylistTrackRow
            track={track}
            index={index}
            isCurrent={isCurrent}
            isPlaying={isPlaying}
            onPlay={onPlay}
            showArtist
            onAddToPlaylist={() => void 0}
            onRemoveFromPlaylist={onRemove}
          />
        </div>
      </div>
    </Reorder.Item>
  );
}

export default function PlaylistPage() {
  const { playlistid } = useParams<{ playlistid: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { currentTrackId, isPlaying } = useAppSelector((state) => state.player);
  const authUserId = useAppSelector((state) => (state.auth as any).userId);
  const {
    progress,
    currentTime,
    seekToPercentage,
    dragStart,
    dragMove,
    dragEnd,
  } = useAudioProgress();

  const { getPlaylistById, playlist, loading, error } = useGetPlaylistById();
  const { getPlaylistCreator, creator } = useGetPlaylistCreator();
  const { getRecommendedPlaylists, playlists: recommended } =
    useGetRecommendedPlaylists();
  const { addPlaylistToHistory } = useAddPlaylistToHistory();
  const { updatePlaylist, loading: updatingPlaylist } = useUpdatePlaylist();
  const { updatePlaylistImage, loading: updatingImage } =
    useUpdatePlaylistImage();
  const { deletePlaylist, loading: deletingPlaylist } = useDeletePlaylist();
  const { reorderPlaylistTracks, loading: reorderingTracks } =
    useReorderPlaylistTracks();
  const { removeTrackFromPlaylist, loading: removingTrack } =
    useRemoveTrackFromPlaylist();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isReposted, setIsReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [localTracks, setLocalTracks] = useState<PlaylistTrack[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showRemoveTrackModal, setShowRemoveTrackModal] = useState(false);
  const [removeTrackError, setRemoveTrackError] = useState<string | null>(null);
  const [removeTrackTarget, setRemoveTrackTarget] = useState<PlaylistTrack | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const dragStartRef = useRef<{
    trackId: string;
    apiTrackId: string;
    oldPosition: number;
    previousTracks: PlaylistTrack[];
  } | null>(null);
  const localTracksRef = useRef<PlaylistTrack[]>([]);

  const { likePlaylist } = useLikePlaylistOptimistic(playlistid ?? "");
  const { repostPlaylist } = useRepostPlaylist(
    playlistid ?? "",
    Boolean(playlistid),
    playlist?.numOfReposts,
  );

  const { users: likeUsers,   total: LikesCount,   loadLikes   } = usePlaylistLikesList(playlistid ?? "");
  const { users: repostUsers, total: RepostsCount, loadReposts } = usePlaylistRepostsList(playlistid ?? "");

  const [userProfiles,    setUserProfiles]   = useState<Record<string, GetProfileResponse>>({});
  const [followOverrides, setFollowOverrides] = useState<Record<string, boolean>>({});
  const inFlightIdsRef = useRef<Set<string>>(new Set());

  const sidebarUserIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...likeUsers.map((u) => u.userId),
          ...repostUsers.map((u) => u.userId),
        ].filter(Boolean)),
      ),
    [likeUsers, repostUsers],
  );

  const tracks = localTracks;
  const mappedTracks = useMemo(() => mapTracksForPlayer(tracks), [tracks]);
  const featuredArtists = useMemo(() => getFeaturedArtists(tracks), [tracks]);
  const isOwner = Boolean(authUserId && playlist?.artistId === authUserId);
  const isPlaylistPlaying =
    isPlaying && tracks.some((track) => track._id === currentTrackId);
  const waveformTrack =
    tracks.find((track) => track._id === currentTrackId) ?? tracks[0];


  useEffect(() => {
    const missingIds = sidebarUserIds.filter(
      (id) => !userProfiles[id] && !inFlightIdsRef.current.has(id),
    );
    if (missingIds.length === 0) return;

    missingIds.forEach((id) => inFlightIdsRef.current.add(id));
    let cancelled = false;

    void (async () => {
      const BATCH_SIZE = 3;
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
      for (let start = 0; start < missingIds.length; start += BATCH_SIZE) {
        const batch = missingIds.slice(start, start + BATCH_SIZE);
        const results = await Promise.all(
          batch.map(async (id) => {
            try   { return await profileService.getProfileAuthCached(id); }
            catch { return null; }
          }),
        );
        if (cancelled) return;
        setUserProfiles((prev) => {
          const next = { ...prev };
          batch.forEach((id, i) => {
            const profile = results[i];
            if (profile) next[id] = profile;
            inFlightIdsRef.current.delete(id);
          });
          return next;
        });
        if (start + BATCH_SIZE < missingIds.length) await delay(250);
      }
    })();

    return () => { cancelled = true; };
  }, [sidebarUserIds, userProfiles]);


  useEffect(() => {
    if (!playlistid) return;
    loadLikes();
    loadReposts();
  }, [playlistid]);



  useEffect(() => {
    localTracksRef.current = localTracks;
  }, [localTracks]);

  useEffect(() => {
    if (!playlistid) return;
    void getPlaylistById(playlistid);
    void addPlaylistToHistory(playlistid).catch(() => undefined);
  }, [playlistid, getPlaylistById, addPlaylistToHistory]);

  useEffect(() => {
    if (!playlist) return;
    setIsLiked(playlist.isLiked);
    setLikeCount(playlist.numOfLikes ?? 0);
    setIsReposted(playlist.isReposted);
    setRepostCount(playlist.numOfReposts ?? 0);
    setIsPrivate(playlist.isPrivate);
    setLocalTracks(playlist.tracks ?? []);
  }, [playlist]);

  useEffect(() => {
    if (!playlist?.artistId) return;
    void getPlaylistCreator(playlist.artistId);
    void getRecommendedPlaylists(playlist._id, playlist.artistId, false, 4);
  }, [playlist, getPlaylistCreator, getRecommendedPlaylists]);

  function handlePlaylistPlay() {
    if (!mappedTracks.length) return;

    if (isPlaylistPlaying) {
      dispatch(pause());
      return;
    }

    dispatch(playAudio({ tracks: mappedTracks, startId: mappedTracks[0].id }));
    setTimeout(() => dispatch(play()), 0);
  }

  function handleTrackPlay(trackId: string) {
    if (!mappedTracks.length) return;

    if (currentTrackId === trackId && isPlaying) {
      dispatch(pause());
      return;
    }

    dispatch(playAudio({ tracks: mappedTracks, startId: trackId }));
    setTimeout(() => dispatch(play()), 0);
  }

  function promptRemoveTrack(track: PlaylistTrack) {
    if (!isOwner) return;
    setRemoveTrackError(null);
    setRemoveTrackTarget(track);
    setShowRemoveTrackModal(true);
  }

  async function confirmRemoveTrack() {
    if (!playlist || !removeTrackTarget || removingTrack) return;

    setRemoveTrackError(null);
    try {
      await removeTrackFromPlaylist(playlist._id, removeTrackTarget._id);
      setLocalTracks((current) =>
        current.filter((track) => track._id !== removeTrackTarget._id),
      );
      setShowRemoveTrackModal(false);
      setRemoveTrackTarget(null);
      setStatusMessage("Track removed from playlist");
    } catch {
      setRemoveTrackError("Could not remove track from playlist");
    }
  }

  function handleWaveformPlay(seekPercentage?: number) {
    if (!waveformTrack || !mappedTracks.length) return;

    const shouldStartTrack = currentTrackId !== waveformTrack._id || !isPlaying;
    if (shouldStartTrack) {
      dispatch(playAudio({ tracks: mappedTracks, startId: waveformTrack._id }));
      setTimeout(() => {
        dispatch(play());
        if (seekPercentage !== undefined) seekToPercentage(seekPercentage);
      }, 0);
      return;
    }

    if (seekPercentage !== undefined) seekToPercentage(seekPercentage);
  }

  function handleLikePlaylist() {
    void likePlaylist();
    setLikeCount((count) => Math.max(0, count + (isLiked ? -1 : 1)));
    setIsLiked((liked) => !liked);
  }

  function handleRepostPlaylist() {
    void repostPlaylist();
    setRepostCount((count) => Math.max(0, count + (isReposted ? -1 : 1)));
    setIsReposted((reposted) => !reposted);
  }

  async function handlePrivacyToggle() {
    if (!playlist || updatingPlaylist) return;

    const nextPrivate = !isPrivate;
    setIsPrivate(nextPrivate);
    setStatusMessage(null);

    try {
      await updatePlaylist(playlist._id, { isPrivate: nextPrivate });
      setStatusMessage(
        nextPrivate ? "Playlist set to private" : "Playlist set to public",
      );
      void getPlaylistById(playlist._id);
    } catch {
      setIsPrivate(!nextPrivate);
      setStatusMessage("Could not update playlist privacy");
    }
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!playlist || !file) return;

    setStatusMessage(null);
    try {
      await updatePlaylistImage(playlist._id, file);
      setStatusMessage("Playlist artwork updated");
      void getPlaylistById(playlist._id);
    } catch {
      setStatusMessage("Could not update playlist artwork");
    } finally {
      event.target.value = "";
    }
  }

  async function handleDeletePlaylist() {
    if (!playlist || deletingPlaylist) return;
    setDeleteError(null);
    setShowDeleteModal(true);
  }

  async function confirmDeletePlaylist() {
    if (!playlist || deletingPlaylist) return;
    setDeleteError(null);
    try {
      await deletePlaylist(playlist._id);
      setShowDeleteModal(false);
      router.push("/library/playlists");
    } catch {
      setDeleteError("Could not delete playlist");
    }
  }

  function handleReorderStart(trackId: string) {
    const oldPosition = localTracksRef.current.findIndex(
      (t) => t._id === trackId,
    );
    if (oldPosition < 0) return;

    dragStartRef.current = {
      trackId,
      apiTrackId: trackId,
      oldPosition,
      previousTracks: [...localTracksRef.current],
    };
  }

  function handleReorderChange(nextTracks: PlaylistTrack[]) {
    if (!isOwner) return;
    localTracksRef.current = nextTracks;
    setLocalTracks(nextTracks);
  }

  async function handleReorderEnd(trackId: string) {
    if (!playlist || !isOwner || !dragStartRef.current) return;

    const { apiTrackId, oldPosition, previousTracks } = dragStartRef.current;
    if (!apiTrackId) return;
    dragStartRef.current = null;
    const newPosition = localTracksRef.current.findIndex(
      (track) => track._id === trackId,
    );
    if (newPosition < 0 || oldPosition === newPosition) return;

    setStatusMessage(null);

    try {
      await reorderPlaylistTracks(playlist._id, {
        trackId: apiTrackId,
        oldPosition,
        newPosition,
      });
      setStatusMessage("Playlist order saved");
    } catch {
      setLocalTracks(previousTracks);
      setStatusMessage("Could not save playlist order");
    }
  }

  if (loading && !playlist) {
    return (
      <div className="min-h-[70vh] animate-pulse px-1 py-4">
        <div className="h-120 bg-off-black" />
        <div className="mt-8 h-80 bg-off-black/60" />
      </div>
    );
  }

  if (error) {
    return <div className="px-4 py-16 text-center text-anger">{error}</div>;
  }

  if (!playlist) {
    return (
      <div className="px-4 py-16 text-center text-silver">
        Playlist not found.
      </div>
    );
  }

  const cover = playlist.image?.imgLink || FALLBACK_COVER;
  const creatorName = creator?.displayName ?? "Unknown creator";
  const trackCount = playlist.totalTracks ?? tracks.length;

  return (
    <div className="w-full pb-14 text-white-smoke">
      <DeletePlaylistModal
        isOpen={showDeleteModal}
        playlistTitle={playlist.title}
        isLoading={deletingPlaylist}
        error={deleteError}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeletePlaylist}
      />

      <DeleteTrackFromPlaylistModal
        isOpen={showRemoveTrackModal}
        playlistTitle={playlist.title}
        trackTitle={removeTrackTarget?.basicInfo.title}
        isLoading={removingTrack}
        error={removeTrackError}
        onClose={() => {
          setShowRemoveTrackModal(false);
          setRemoveTrackTarget(null);
        }}
        onConfirm={confirmRemoveTrack}
      />

      <EditPlaylistModal
        isOpen={showEditModal}
        playlist={playlist}
        isSaving={updatingPlaylist}
        error={editError}
        onClose={() => setShowEditModal(false)}
        onSave={async (data?: any) => {
          try {
            setEditError(null);
            if (!playlist) return;

            // Build payload with only defined values — undefined fields are omitted
            // so the server doesn't receive empty/null overrides.
            const payload: Record<string, any> = {};

            if (data?.title)       payload.title       = data.title;
            if (data?.permalink)   payload.permalink   = data.permalink;
            if (data?.playlistType) payload.playlistType = data.playlistType;
            if (data?.releaseDate) {
              // API expects full ISO datetime string
              const rd = data.releaseDate;
              payload.releaseDate = rd.includes("T") ? rd : `${rd}T00:00:00.000Z`;
            }
            if (data?.genre)       payload.genre       = data.genre;
            if (data?.description !== undefined) payload.description = data.description;
            payload.isPrivate = typeof data?.privacy === "string"
              ? data.privacy === "private"
              : playlist.isPrivate;
            if (data?.buyLink)     payload.buyLink     = data.buyLink;
            if (data?.recordLabel) payload.recordLabel = data.recordLabel;

            // Tags → sent as additionalTags array (API field name)
            if (data?.tags) {
              payload.additionalTags = data.tags
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean);
            }

            // Always send the full track list to avoid accidental deletions
            payload.listOfTracks = Array.isArray(data?.listOfTracks)
              ? data.listOfTracks
              : (playlist.tracks ?? []).map((t: any) => t._id);

            // PUT — metadata + tracks (no image)
            console.log("[EditPlaylist] PUT payload:", JSON.stringify(payload, null, 2));
            await updatePlaylist(playlist._id, payload);

            // PATCH — image only, sent separately
            if (data?.image instanceof File) {
              await updatePlaylistImage(playlist._id, data.image);
            }

            void getPlaylistById(playlist._id);
            setShowEditModal(false);
          } catch (e: any) {
            const errData = e?.response?.data;
            console.error("[EditPlaylist] 400 response:", JSON.stringify(errData, null, 2));
            const msg = errData?.message ?? e?.message ?? "Could not save playlist";
            const fieldErrors = errData?.errors?.map((err: any) => `${err.field}: ${err.message}`).join(", ");
            setEditError(fieldErrors ? `${msg} — ${fieldErrors}` : msg);
          }
        }}
      />
      <section className="mx-1 min-h-120 bg-chinese-black p-4 sm:p-6 lg:p-10">
        <div className="flex min-h-92 flex-col gap-6 border-white-smoke lg:flex-row lg:gap-8">
          <button
            type="button"
            onClick={handlePlaylistPlay}
            aria-label={isPlaylistPlaying ? "Pause playlist" : "Play playlist"}
            className="mt-0 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-chinese-black text-white-smoke transition-transform hover:scale-105 self-start"
          >
            <Play className="h-10 w-10 fill-current" />
          </button>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="inline-block max-w-full bg-chinese-black/90 px-3 py-2 sm:max-w-165">
                <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
                  {playlist.title}
                </h1>
              </div>
              <div className="mt-3">
                {playlist.isPrivate && (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-off-black px-2 py-1 text-xs font-bold uppercase tracking-wide text-silver">
                    <Lock className="h-3 w-3" />
                    Private
                  </span>
                )}
                {isOwner && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-sm bg-chinese-black/80 px-2 py-1 text-xs font-bold uppercase tracking-wide text-silver">
                    <ShieldCheck className="h-3 w-3" />
                    Owner tools
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {isPlaylistPlaying ? (
                <div className="h-20 w-full max-w-full lg:max-w-lg">
                  <SausageWaveform
                    trackId={waveformTrack?._id}
                    samplesUrl={
                      waveformTrack?.audio.waveformLink ?? "/waveform.json"
                    }
                    externalProgress={progress}
                    currentTime={currentTime}
                    duration={waveformTrack?.durationInSeconds ?? 0}
                    isPlaying={isPlaying}
                    onSeek={seekToPercentage}
                    onDragStart={dragStart}
                    onDragMove={dragMove}
                    onDragEnd={dragEnd}
                    onPlay={handleWaveformPlay}
                    enabled
                  />
                </div>
              ) : (
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white-smoke text-center">
                  <div className="text-3xl font-bold text-chinese-black leading-none">
                    {trackCount}
                  </div>
                  <div className="mt-1 text-xs font-bold text-chinese-black uppercase tracking-wide">
                    Tracks
                  </div>
                  <div className="mt-1 text-sm font-bold text-chinese-black">
                    {formatDuration(playlist.playlistLengthInSeconds)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative ml-auto hidden h-100 w-100 shrink-0 overflow-hidden rounded-lg bg-off-black lg:block">
            <img
              src={cover}
              alt={`${playlist.title} cover`}
              className="h-full w-full object-cover"
            />
            {isOwner && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={updatingImage}
                className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-sm bg-chinese-black/80 px-3 py-2 text-sm font-bold hover:opacity-80 disabled:opacity-50"
              >
                <ImagePlus className="h-4 w-4" />
                {updatingImage ? "Updating" : "Artwork"}
              </button>
            )}
          </div>
        </div>
      </section>

      {isOwner && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      )}

      <section className="mt-8 grid gap-8 px-1 sm:px-0 lg:grid-cols-[minmax(0,1fr)_410px]">
        <div className="min-w-0">
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {}}
              aria-label="Share"
              className="flex h-10 w-10 items-center justify-center rounded-sm bg-off-black text-white-smoke transition-opacity hover:opacity-70"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleRepostPlaylist}
              aria-label="Repost"
              className={`flex h-10 w-10 items-center justify-center rounded-sm bg-off-black transition-opacity hover:opacity-70 ${
                isReposted ? "text-inferno" : "text-white-smoke"
              }`}
            >
              <Repeat2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              aria-label="Edit playlist"
              className="flex h-10 w-10 items-center justify-center rounded-sm bg-off-black text-white-smoke transition-opacity hover:opacity-70"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => dispatch(playNext({ tracks: mappedTracks }))}
              disabled={!mappedTracks.length}
              aria-label="Add to next up"
              className="flex h-10 w-10 items-center justify-center rounded-sm bg-off-black text-white-smoke transition-opacity hover:opacity-70 disabled:opacity-30"
            >
              <ListPlus className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={deletingPlaylist}
              aria-label="Delete playlist"
              className="flex h-10 w-10 items-center justify-center rounded-sm bg-off-black text-anger transition-opacity hover:opacity-70 disabled:opacity-30"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            {isOwner && (
              <button
                type="button"
                onClick={handlePrivacyToggle}
                disabled={updatingPlaylist}
                aria-label={isPrivate ? "Make public" : "Make private"}
                className="flex h-10 w-10 items-center justify-center rounded-sm bg-off-black text-white-smoke transition-opacity hover:opacity-70 disabled:opacity-30"
              >
                <Lock className="h-4 w-4" />
              </button>
            )}
          </div>

          {(statusMessage || (isOwner && reorderingTracks)) && (
            <div className="mb-5 text-sm font-bold text-silver">
              {reorderingTracks ? "Saving playlist order..." : statusMessage}
            </div>
          )}

          {tracks.length > 0 ? (
            <Reorder.Group
              axis="y"
              values={tracks}
              onReorder={handleReorderChange}
              className="space-y-1"
            >
              {tracks.map((track, index) => (
                <ReorderableTrackRow
                  key={track._id}
                  track={track}
                  index={index}
                  isOwner={isOwner}
                  isCurrent={currentTrackId === track._id}
                  isPlaying={currentTrackId === track._id && isPlaying}
                  onPlay={() => handleTrackPlay(track._id)}
                  onReorderStart={handleReorderStart}
                  onReorderEnd={handleReorderEnd}
                  onRemove={isOwner ? () => promptRemoveTrack(track) : undefined}
                />
              ))}
            </Reorder.Group>
          ) : (
            <div className="py-16 text-center text-silver">
              This playlist has no tracks yet.
            </div>
          )}
        </div>

        <aside className="min-w-0 space-y-8 pr-0 lg:pr-4">
          <div className="text-base font-bold leading-6 wrap-break-word">
            Based on {tracks[0]?.basicInfo.title ?? playlist.title}
          </div>

          {featuredArtists.length > 0 && (
            <section>
              <h2 className="mb-5 text-sm font-bold uppercase tracking-wide">
                Artists Featured
              </h2>
              <div className="space-y-6">
                {featuredArtists.map((artist) => (
                  <div key={artist.name} className="flex flex-col gap-4 rounded-md bg-white-smoke/0 sm:flex-row sm:items-center">
                    <img
                      src={artist.image}
                      alt=""
                      className="h-15 w-15 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-lg font-bold">
                          {artist.name}
                        </span>
                        <BadgeCheck className="h-5 w-5 fill-[#5797ff] text-white-smoke" />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-silver">
                        <span className="inline-flex items-center gap-1">
                          <User className="h-4 w-4 fill-current" />
                          {formatCount(artist.plays)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <AudioLines className="h-4 w-4" />
                          {artist.tracks}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="h-10 rounded-sm bg-white-smoke px-5 text-sm font-bold text-chinese-black hover:opacity-80 self-start sm:self-auto"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {recommended && recommended.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide">
                Recommended
              </h2>
              <div className="space-y-1">
                {recommended.map((item) => (
                  <RecommendedPlaylist key={item._id} playlist={item} />
                ))}
              </div>
            </section>
          )}

          <PopoverProvider>
          {/* Likes */}
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-bold uppercase text-white-smoke">
              {LikesCount} Likes
            </h2>
            {likeUsers.length === 0 ? (
              <p className="text-xs text-silver">No likes yet</p>
            ) : (
              <Avatar.Group className="w-full max-w-full overflow-x-auto">
                {likeUsers.map((user) => {
                  const profile     = userProfiles[user.userId];
                  const isFollowing = followOverrides[user.userId] ?? profile?.isFollowed ?? false;
                  return (
                    <ProfilePopover
                      key={user.userId}
                      id={`like-${user.userId}`}
                      artistName={user.displayName}
                      followCount={user.followersCount}
                      profileImgLink={user.avatarUrl}
                      userId={user.userId}
                      isFollowing={isFollowing}
                      onFollowChange={(next) =>
                        setFollowOverrides((prev) => ({ ...prev, [user.userId]: next }))
                      }
                    >
                      <Avatar src={user.avatarUrl} size={48} style={{ cursor: "pointer" }} />
                    </ProfilePopover>
                  );
                })}
              </Avatar.Group>
            )}
          </section>

          {/* Reposts */}
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-bold uppercase text-white-smoke">
              {RepostsCount} Reposts
            </h2>
            {repostUsers.length === 0 ? (
              <p className="text-xs text-silver">No reposts yet</p>
            ) : (
              <Avatar.Group className="w-full max-w-full overflow-x-auto">
                {repostUsers.map((user) => {
                  const profile     = userProfiles[user.userId];
                  const isFollowing = followOverrides[user.userId] ?? profile?.isFollowed ?? false;
                  return (
                    <ProfilePopover
                      key={user.userId}
                      id={`repost-${user.userId}`}
                      artistName={user.displayName}
                      followCount={user.followersCount}
                      profileImgLink={user.avatarUrl}
                      userId={user.userId}
                      isFollowing={isFollowing}
                      onFollowChange={(next) =>
                        setFollowOverrides((prev) => ({ ...prev, [user.userId]: next }))
                      }
                    >
                      <Avatar src={user.avatarUrl} size={48} style={{ cursor: "pointer" }} />
                    </ProfilePopover>
                  );
                })}
              </Avatar.Group>
            )}
          </section>
          </PopoverProvider>

      <GoMobile />

      <div className="text-xs text-silver leading-6 wrap-break-word">
        {[
          "Legal", "Privacy", "Cookie Policy", "Cookie Manager",
          "Imprint", "Artist Resources", "Newsroom", "Charts",
          "Transparency Reports",
        ].map((label, i, arr) => (
          <span key={label}>
            <span className="hover:text-white-smoke cursor-pointer">{label}</span>
            {i < arr.length - 1 && " · "}
          </span>
        ))}
      </div>
        </aside>
      </section>
    </div>
  );
}