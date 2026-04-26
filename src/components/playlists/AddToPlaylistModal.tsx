"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, X } from "lucide-react";
import {
  useAddTrackToPlaylist,
  useCreatePlaylist,
  useGetMyPlaylists,
} from "@/hooks/usePlaylists";
import { Playlist } from "@/types/playlists.types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle?: string;
  artistName?: string;
  trackImage?: string;
};

function broadcastPlaylistUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("playlist-updated"));
  }
}

export default function AddToPlaylistModal({
  isOpen,
  onClose,
  trackId,
  trackTitle,
  artistName,
  trackImage,
}: Props) {
  const [activeTab, setActiveTab] = useState<"add" | "create">("add");
  const [search, setSearch] = useState("");
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [createdPlaylist, setCreatedPlaylist] = useState<Playlist | null>(null);
  const [busyPlaylistId, setBusyPlaylistId] = useState<string | null>(null);
  const [addedPlaylistIds, setAddedPlaylistIds] = useState<Set<string>>(new Set());

  const { getMyPlaylists, playlists, loading: loadingPlaylists } =
    useGetMyPlaylists();
  const { addTrackToPlaylist, loading: addingTrack } = useAddTrackToPlaylist();
  const { createPlaylist, loading: creatingPlaylist } = useCreatePlaylist();

  useEffect(() => {
    if (!isOpen) return;
    void getMyPlaylists(20, 1);
  }, [isOpen, getMyPlaylists]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setActiveTab("add");
      setCreatedPlaylist(null);
      setNewPlaylistTitle("");
      setIsPrivate(false);
      setBusyPlaylistId(null);
      setAddedPlaylistIds(new Set());
    }
  }, [isOpen]);

  const filteredPlaylists = useMemo(() => {
    if (!playlists?.length) return [];
    const q = search.trim().toLowerCase();
    if (!q) return playlists;
    return playlists.filter((playlist) =>
      playlist.title.toLowerCase().includes(q)
    );
  }, [playlists, search]);

  if (!isOpen) return null;

  const handleAddTrack = async (playlistId: string) => {
    try {
      setBusyPlaylistId(playlistId);
      await addTrackToPlaylist(playlistId, trackId);
      setAddedPlaylistIds((prev) => new Set(prev).add(playlistId));
      broadcastPlaylistUpdate();
      await getMyPlaylists(20, 1);
    } catch {
      // Hook handles error state.
    } finally {
      setBusyPlaylistId(null);
    }
  };

  const handleCreatePlaylist = async () => {
    const title = newPlaylistTitle.trim();
    if (!title) return;

    try {
      const res = await createPlaylist({
        playlistName: title,
        tracks: [trackId],
        isPrivate,
      });

      const maybeCreated = res?.data?.playlists?.[0] as Playlist | undefined;
      if (maybeCreated) {
        setCreatedPlaylist(maybeCreated);
      }

      setNewPlaylistTitle("");
      await getMyPlaylists(20, 1);
      broadcastPlaylistUpdate();
    } catch {
      // Hook handles error state.
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-200 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-210 w-140 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d0d] text-white shadow-2xl">
        {/* Tab header */}
        <div className="flex items-end border-b border-[#2c2c2c] px-6 pt-5">
          <button
            type="button"
            onClick={() => setActiveTab("add")}
            className={`mr-6 pb-3 text-[22px] font-bold leading-none transition-colors cursor-pointer ${
              activeTab === "add"
                ? "text-white border-b-2 border-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Add to playlist
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`pb-3 text-[22px] font-bold leading-none transition-colors cursor-pointer ${
              activeTab === "create"
                ? "text-white border-b-2 border-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Create a playlist
          </button>
        </div>

        {/* ── ADD TO PLAYLIST TAB ── */}
        {activeTab === "add" && (
          <div className="px-6 py-4">
            {/* Filter input */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter playlists"
              className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-sm px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none focus:border-white/50 mb-4"
            />

            {/* Playlist rows */}
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {loadingPlaylists && (
                <p className="text-white/50 text-sm py-4">Loading playlists...</p>
              )}
              {!loadingPlaylists && filteredPlaylists.length === 0 && (
                <p className="text-white/50 text-sm py-4">No playlists found.</p>
              )}

              {filteredPlaylists.map((playlist) => (
                <div
                  key={playlist._id}
                  className="flex items-center gap-3 py-2"
                >
                  {/* Thumbnail */}
                  <div className="relative w-11 h-11 shrink-0 overflow-hidden bg-white/10">
                    {playlist.image?.imgLink ? (
                      <Image
                        src={playlist.image.imgLink}
                        alt={playlist.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {playlist.title}
                    </p>
                    <p className="text-xs text-white/50">
                      {playlist.listOfTracks?.length ?? 0}
                    </p>
                  </div>

                  {/* Private badge */}
                  {playlist.isPrivate && (
                    <span className="text-xs text-white/60 font-semibold tracking-widest uppercase shrink-0">
                      PRIVATE
                    </span>
                  )}

                  {/* Add / Added button */}
                  <button
                    onClick={() => void handleAddTrack(playlist._id)}
                    disabled={addingTrack && busyPlaylistId === playlist._id}
                    className={`shrink-0 px-4 py-1.5 text-sm font-semibold rounded-sm border transition cursor-pointer disabled:opacity-60 ${
                      addedPlaylistIds.has(playlist._id)
                        ? "bg-[#222] text-[#ff5500] border-[#333] hover:bg-[#2a2a2a]"
                        : "bg-[#222] text-white border-[#333] hover:bg-[#2a2a2a]"
                    }`}
                  >
                    {busyPlaylistId === playlist._id
                      ? "Adding..."
                      : addedPlaylistIds.has(playlist._id)
                      ? "Added"
                      : "Add"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CREATE A PLAYLIST TAB ── */}
        {activeTab === "create" && (
          <div className="px-6 py-5">
            {/* Title field */}
            <label className="block text-sm font-semibold mb-1">
              Playlist title{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              value={newPlaylistTitle}
              onChange={(e) => setNewPlaylistTitle(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-sm px-3 py-2.5 text-sm text-white outline-none focus:border-white/50 mb-4"
            />

            {/* Privacy + Save row */}
            <div className="flex items-center gap-6 mb-5">
              <span className="text-sm font-semibold text-white">Privacy:</span>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  checked={!isPrivate}
                  onChange={() => setIsPrivate(false)}
                  className="accent-white"
                />
                Public
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                  className="accent-white"
                />
                Private
              </label>

              <button
                onClick={() => void handleCreatePlaylist()}
                disabled={creatingPlaylist || !newPlaylistTitle.trim()}
                className="ml-auto px-5 py-1.5 text-sm font-semibold bg-white text-black rounded-sm hover:bg-white/90 disabled:opacity-50 transition cursor-pointer"
              >
                {creatingPlaylist ? "Saving..." : "Save"}
              </button>
            </div>

            {/* Track being added */}
            <div className="flex items-center gap-3 py-3 border-t border-[#2c2c2c]">
              <div className="relative w-11 h-11 shrink-0 overflow-hidden bg-white/10">
                {trackImage ? (
                  <Image
                    src={trackImage}
                    alt={trackTitle ?? "Track"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white/60 truncate">
                  {artistName ?? "Unknown artist"}
                </p>
                <p className="text-sm font-semibold text-white truncate">
                  {trackTitle ?? "Untitled track"}
                </p>
              </div>
              <button className="text-white/40 hover:text-white shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* "Looking for more tracks" section — existing playlists */}
            {!createdPlaylist && filteredPlaylists.length > 0 && (
              <>
                <p className="text-sm text-white/70 mt-4 mb-3">
                  Looking for more tracks? Add some of your own.
                </p>
                <div className="space-y-1 max-h-50 overflow-y-auto">
                  {filteredPlaylists.map((playlist) => (
                    <div
                      key={playlist._id}
                      className="flex items-center gap-3 py-2"
                    >
                      <div className="relative w-11 h-11 shrink-0 overflow-hidden bg-white/10">
                        {playlist.image?.imgLink ? (
                          <Image
                            src={playlist.image.imgLink}
                            alt={playlist.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/10" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/60 truncate">
                          {playlist.artistId}
                        </p>
                        <p className="text-sm font-semibold text-white truncate">
                          {playlist.title}
                        </p>
                      </div>
                      <button
                        onClick={() => void handleAddTrack(playlist._id)}
                        disabled={addingTrack && busyPlaylistId === playlist._id}
                        className="shrink-0 px-4 py-1.5 text-sm font-semibold bg-[#222] text-white border border-[#444] rounded-sm hover:bg-[#2a2a2a] disabled:opacity-60 transition cursor-pointer"
                      >
                        {addingTrack && busyPlaylistId === playlist._id
                          ? "Adding..."
                          : "Add to playlist"}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Created playlist confirmation */}
            {createdPlaylist && (
              <div className="flex items-center gap-3 mt-4 py-3 border-t border-[#2c2c2c]">
                <div className="relative w-11 h-11 shrink-0 overflow-hidden bg-white/10">
                  {createdPlaylist.image?.imgLink ? (
                    <Image
                      src={createdPlaylist.image.imgLink}
                      alt={createdPlaylist.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/60 truncate">
                    {createdPlaylist.artistId}
                  </p>
                  <p className="text-sm font-semibold text-white truncate">
                    {createdPlaylist.title}
                  </p>
                </div>
                {createdPlaylist.isPrivate && (
                  <Lock className="w-4 h-4 text-white/40 shrink-0" />
                )}
                <Link
                  href={`/playlist/${createdPlaylist._id}`}
                  className="text-sm font-semibold text-[#4a90e2] hover:underline shrink-0"
                >
                  Go to playlist
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}