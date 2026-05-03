"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, X } from "lucide-react";
import { useAddTrackToPlaylist, useCreatePlaylist, useGetMyPlaylists } from "@/hooks/usePlaylists";
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
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "create">("add");
  const [search, setSearch] = useState("");
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [createdPlaylist, setCreatedPlaylist] = useState<Playlist | null>(null);
  const [busyPlaylistId, setBusyPlaylistId] = useState<string | null>(null);
  const [addedPlaylistIds, setAddedPlaylistIds] = useState<Set<string>>(new Set());

  const { getMyPlaylists, playlists, loading: loadingPlaylists } = useGetMyPlaylists();
  const { addTrackToPlaylist, loading: addingTrack } = useAddTrackToPlaylist();
  const { createPlaylist, loading: creatingPlaylist } = useCreatePlaylist();

  const getPlaylistTitle = (playlist: Playlist & { playlistName?: string; name?: string }) =>
    playlist.title ?? playlist.playlistName ?? playlist.name ?? "";

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 20);
      return () => clearTimeout(timer);
    }
    setAnimate(false);
    const timer = setTimeout(() => setShouldRender(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

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
    return playlists.filter((playlist) => getPlaylistTitle(playlist).toLowerCase().includes(q));
  }, [playlists, search]);

  if (!shouldRender) return null;

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
    } catch {}
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-1001 flex items-start sm:items-center justify-center overflow-y-auto p-4 sm:p-0 bg-login transition-opacity duration-500 ease-in-out ${
          animate ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          data-testid="add-to-playlist-modal-close"
          className={`fixed top-6 right-6 z-1010 w-10 h-10 rounded-full flex items-center justify-center text-white-smoke hover:text-gray-400 bg-chinese-black transition-all duration-500 cursor-pointer ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
          }`}
          aria-label="Close modal"
        >
          <X size={28} />
        </button>

        {/* Modal */}
        <div
          className={`relative mt-6 sm:mt-0 w-full max-w-140 max-h-[95vh] overflow-y-auto bg-chinese-black text-white-smoke shadow-2xl transform transition-transform duration-500 ${
            animate ? "translate-y-0" : "-translate-y-[150vh]"
          }`}
        >
          {/* Tab header */}
          <div className="flex items-end border-b border-[#2c2c2c] px-6 pt-5">
            <button
              type="button"
              onClick={() => setActiveTab("add")}
              data-testid="add-to-playlist-modal-tab-add"
              className={`mr-6 pb-3 text-[22px] font-bold leading-none transition-colors cursor-pointer ${
                activeTab === "add"
                  ? "text-white-smoke border-b-2 border-white"
                  : "text-white-smoke/50 hover:text-white-smoke/80"
              }`}
            >
              Add to playlist
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              data-testid="add-to-playlist-modal-tab-create"
              className={`pb-3 text-[22px] font-bold leading-none transition-colors cursor-pointer ${
                activeTab === "create"
                  ? "text-white-smoke border-b-2 border-white"
                  : "text-white-smoke/50 hover:text-white=smoke/80"
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
                data-testid="add-to-playlist-modal-filter-input"
                placeholder="Filter playlists"
                className="w-full bg-chinese-black border border-white-smoke rounded-sm px-4 py-2.5 text-sm text-white-smoke placeholder-white-smoke/40 outline-none focus:border-white/50 mb-4"
              />

              {/* Playlist rows */}
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {loadingPlaylists && (
                  <p className="text-white-smoke/50 text-sm py-4">Loading playlists...</p>
                )}
                {!loadingPlaylists && filteredPlaylists.length === 0 && (
                  <p className="text-white-smoke/50 text-sm py-4">No playlists found.</p>
                )}

                {filteredPlaylists.map((playlist) => (
                  <div key={playlist._id} className="flex items-center gap-3 py-2">
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
                      <p className="text-sm font-semibold text-white-smoke truncate">
                        {getPlaylistTitle(playlist)}
                      </p>
                      <p className="text-xs text-white-smoke/50">
                        {playlist.listOfTracks?.length ?? 0}
                      </p>
                    </div>

                    {/* Private badge */}
                    {playlist.isPrivate && (
                      <span className="text-xs text-white-smoke/60 font-semibold tracking-widest uppercase shrink-0">
                        PRIVATE
                      </span>
                    )}

                    {/* Add / Added button */}
                    <button
                      onClick={() => void handleAddTrack(playlist._id)}
                      disabled={addingTrack && busyPlaylistId === playlist._id}
                      data-testid={`add-to-playlist-modal-add-btn-${playlist._id}`}
                      className={`shrink-0 px-4 py-1.5 text-sm font-semibold rounded-sm border transition cursor-pointer disabled:opacity-60 ${
                        addedPlaylistIds.has(playlist._id)
                          ? "bg-chinese-black text-[#ff5500] border-[#333] hover:bg-[#2a2a2a]"
                          : "bg-chinese-black text-white-smoke border-[#333] hover:bg-[#2a2a2a]"
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
                Playlist title <span className="text-red-500">*</span>
              </label>
              <input
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                data-testid="add-to-playlist-modal-create-title"
                className="w-full bg-chinese-black border border-[#3a3a3a] rounded-sm px-3 py-2.5 text-sm text-white-smoke outline-none focus:border-white/50 mb-4"
              />

              {/* Privacy + Save row */}
              <div className="flex items-center gap-6 mb-5">
                <span className="text-sm font-semibold text-white-smoke">Privacy:</span>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                    data-testid="add-to-playlist-modal-create-privacy-public"
                    className="accent-white-smoke"
                  />
                  Public
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                    data-testid="add-to-playlist-modal-create-privacy-private"
                    className="accent-white-smoke"
                  />
                  Private
                </label>

                <button
                  onClick={() => void handleCreatePlaylist()}
                  disabled={creatingPlaylist || !newPlaylistTitle.trim()}
                  data-testid="add-to-playlist-modal-create-save"
                  className="ml-auto px-5 py-1.5 text-sm font-semibold bg-white-smoke text-chinese-black rounded-sm hover:bg-white/90 disabled:opacity-50 transition cursor-pointer"
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
                  <p className="text-sm text-white/60 truncate">{artistName ?? "Unknown artist"}</p>
                  <p className="text-sm font-semibold text-white-smoke truncate">
                    {trackTitle ?? "Untitled track"}
                  </p>
                </div>
                <button className="text-white/40 hover:text-white-smoke shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* "Looking for more tracks" section — existing playlists */}
              {!createdPlaylist && filteredPlaylists.length > 0 && (
                <>
                  <p className="text-sm text-white-smoke/70 mt-4 mb-3">
                    Looking for more tracks? Add some of your own.
                  </p>
                  <div className="space-y-1 max-h-50 overflow-y-auto">
                    {filteredPlaylists.map((playlist) => (
                      <div key={playlist._id} className="flex items-center gap-3 py-2">
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
                          <p className="text-sm text-white/60 truncate">{playlist.artistId}</p>
                          <p className="text-sm font-semibold text-white-smoke truncate">
                            {getPlaylistTitle(playlist)}
                          </p>
                        </div>
                        <button
                          onClick={() => void handleAddTrack(playlist._id)}
                          disabled={addingTrack && busyPlaylistId === playlist._id}
                          data-testid={`add-to-playlist-modal-more-add-btn-${playlist._id}`}
                          className="shrink-0 px-4 py-1.5 text-sm font-semibold bg-chinese-black text-white-smoke border border-[#444] rounded-sm hover:bg-[#2a2a2a] disabled:opacity-60 transition cursor-pointer"
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
                    <p className="text-sm text-white/60 truncate">{createdPlaylist.artistId}</p>
                    <p className="text-sm font-semibold text-white-smoke truncate">
                      {createdPlaylist.title}
                    </p>
                  </div>
                  {createdPlaylist.isPrivate && <Lock className="w-4 h-4 text-white/40 shrink-0" />}
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
      </div>
    </>
  );
}
