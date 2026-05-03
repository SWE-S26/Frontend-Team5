"use client";

import { useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  useCreatePlaylistWithImage,
  useGetMyPlaylists,
  useAddTrackToPlaylist,
} from "@/hooks/usePlaylists";
import { ArtworkPanel } from "@/components/upload/TrackInfoForm/ArtworkPanel";
import { createZoomCroppedArtworkFile } from "@/components/upload/TrackInfoForm";
import { Spin } from "antd";

interface CreatePlaylistFormState {
  title: string;
  description: string;
  isPrivate: boolean;
}

export function AddToPlaylistPanel({
  onClose,
  selectedTrackIds = new Set(),
}: {
  onClose: () => void;
  selectedTrackIds?: Set<string>;
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreatePlaylistFormState>({
    title: "",
    description: "",
    isPrivate: false,
  });
  const artworkInputRef = useRef<HTMLInputElement | null>(null);
  const artworkFrameRef = useRef<HTMLDivElement | null>(null);
  const artworkPanStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const { getMyPlaylists, playlists, loading: playlistsLoading } = useGetMyPlaylists();
  const { createPlaylistWithImage, loading: createLoading } = useCreatePlaylistWithImage();
  const { addTrackToPlaylist, loading: addLoading } = useAddTrackToPlaylist();

  const [addingToPlaylistId, setAddingToPlaylistId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkZoom, setArtworkZoom] = useState(1);
  const [artworkPosition, setArtworkPosition] = useState({ x: 0, y: 0 });
  const [isPanningArtwork, setIsPanningArtwork] = useState(false);
  const [isArtworkDragActive, setIsArtworkDragActive] = useState(false);

  const trackIds = selectedTrackIds instanceof Set ? Array.from(selectedTrackIds) : [];
  const trackCount = trackIds.length;

  useEffect(() => {
    void getMyPlaylists();
  }, [getMyPlaylists]);

  const handleCreatePlaylist = async () => {
    if (!formData.title.trim()) {
      setErrorMessage("Playlist name is required");
      return;
    }
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      const zoomCroppedArtwork = artworkFile
        ? await createZoomCroppedArtworkFile(artworkFile, artworkZoom, artworkPosition)
        : undefined;

      await createPlaylistWithImage({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        isPrivate: formData.isPrivate,
        listOfTracks: trackIds,
        image: zoomCroppedArtwork,
      });
      setFormData({ title: "", description: "", isPrivate: false });
      setArtworkFile(null);
      setArtworkUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setArtworkZoom(1);
      setArtworkPosition({ x: 0, y: 0 });
      setIsPanningArtwork(false);
      artworkPanStartRef.current = null;
      setIsCreating(false);
      showSuccess("Playlist created successfully!");
      setTimeout(() => void getMyPlaylists(), 500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to create playlist");
    }
  };

  const handleAddTracksToPlaylist = async (playlistId: string) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setAddingToPlaylistId(playlistId);
      let successCount = 0;
      let alreadyCount = 0;

      for (const trackId of trackIds) {
        try {
          await addTrackToPlaylist(playlistId, trackId);
          successCount++;
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 400) {
            alreadyCount++;
          } else {
            console.error(`Failed to add track ${trackId}:`, err);
          }
        }
      }

      if (successCount === 0 && alreadyCount > 0) {
        showSuccess(`All tracks are already in this playlist`);
      } else if (successCount > 0 && alreadyCount > 0) {
        showSuccess(`Added ${successCount} track(s) — ${alreadyCount} already in playlist`);
      } else if (successCount === trackIds.length) {
        showSuccess(`Added ${successCount} track(s) to playlist`);
      } else {
        showSuccess(`Added ${successCount} of ${trackIds.length} track(s) to playlist`);
      }

      setTimeout(() => void getMyPlaylists(), 500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to add tracks to playlist");
    } finally {
      setAddingToPlaylistId(null);
    }
  };

  const handleArtworkPick = () => artworkInputRef.current?.click();

  const applyArtworkFile = (file: File) => {
    setArtworkFile(file);
    const url = URL.createObjectURL(file);
    setArtworkUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setArtworkZoom(1);
    setArtworkPosition({ x: 0, y: 0 });
  };

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    applyArtworkFile(file);
    e.target.value = "";
  };

  const handleArtworkDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsArtworkDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Artwork must be an image file (PNG, JPG, WEBP, etc.).");
      return;
    }
    setErrorMessage(null);
    applyArtworkFile(file);
  };

  const handleDeleteArtwork = () => {
    setArtworkFile(null);
    setArtworkUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setArtworkZoom(1);
    setArtworkPosition({ x: 0, y: 0 });
    setIsPanningArtwork(false);
    artworkPanStartRef.current = null;
  };

  const clampArtworkPosition = (value: number) => Math.max(-1, Math.min(1, value));

  const handleArtworkPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!artworkUrl) return;
    if (e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('[data-artwork-control="true"]')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    artworkPanStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startX: artworkPosition.x,
      startY: artworkPosition.y,
    };
    setIsPanningArtwork(true);
  };

  const handleArtworkPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanningArtwork || !artworkPanStartRef.current) return;
    e.preventDefault();
    const frame = artworkFrameRef.current;
    if (!frame) return;
    const dx = e.clientX - artworkPanStartRef.current.clientX;
    const dy = e.clientY - artworkPanStartRef.current.clientY;
    const width = Math.max(1, frame.clientWidth);
    const height = Math.max(1, frame.clientHeight);
    setArtworkPosition({
      x: clampArtworkPosition(artworkPanStartRef.current.startX + dx / width),
      y: clampArtworkPosition(artworkPanStartRef.current.startY + dy / height),
    });
  };

  const handleArtworkPointerUp = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanningArtwork) return;
    if (e && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsPanningArtwork(false);
    artworkPanStartRef.current = null;
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-1000 bg-chinese-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-1010 flex h-full w-full max-w-140 flex-col bg-chinese-black">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white-smoke/10 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            data-testid="artist-add-to-playlist-panel-close"
            className="rounded-full bg-red-500 px-8 py-2 text-[12px] font-semibold text-chinese-black hover:bg-white-smoke/80 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <IoClose size={16} />
          </button>
          <h2 className="text-[15px] font-semibold text-white-smoke cursor-pointer">
            Add {trackCount} track{trackCount !== 1 ? "s" : ""} to playlist
          </h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          {/* Messages */}
          {errorMessage && (
            <div className="rounded-lg bg-[#4a1a1a] px-3 py-2 border border-[#8a3a3a]">
              <p className="text-[13px] text-[#ff6b6b]">{errorMessage}</p>
            </div>
          )}
          {successMessage && (
            <div className="rounded-lg bg-[#1a4a2a] px-3 py-2 border border-[#3a8a5a]">
              <p className="text-[13px] text-[#52c41a]">{successMessage}</p>
            </div>
          )}

          {/* Create playlist form */}
          {isCreating ? (
            <div className="space-y-4">
              <div className="w-full">
                <ArtworkPanel
                  artworkInputRef={artworkInputRef}
                  handleArtworkChange={handleArtworkChange}
                  artworkFrameRef={artworkFrameRef}
                  artworkUrl={artworkUrl}
                  isArtworkDragActive={isArtworkDragActive}
                  isPanningArtwork={isPanningArtwork}
                  artworkPosition={artworkPosition}
                  artworkZoom={artworkZoom}
                  handleArtworkPointerDown={handleArtworkPointerDown}
                  handleArtworkPointerMove={handleArtworkPointerMove}
                  handleArtworkPointerUp={handleArtworkPointerUp}
                  setIsArtworkDragActive={setIsArtworkDragActive}
                  handleArtworkDrop={handleArtworkDrop}
                  handleArtworkPick={handleArtworkPick}
                  handleDeleteArtwork={handleDeleteArtwork}
                  setArtworkZoom={setArtworkZoom}
                />
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-semibold text-white-smoke tracking-wider">
                  Playlist title <span className="text-[#ff6b6b]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  data-testid="artist-add-to-playlist-panel-title"
                  className="w-full bg-transparent border-b border-white-smoke/20 py-1.5 text-[13px] text-white-smoke placeholder:text-white-smoke/20 focus:outline-none focus:border-white-smoke/50 transition-colors"
                  placeholder=""
                />
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-semibold text-white-smoke tracking-wider">
                  Description
                </label>
                <textarea
                  placeholder="Describe your playlist."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  data-testid="artist-add-to-playlist-panel-description"
                  className="w-full bg-transparent border-b border-white-smoke/20 text-[13px] leading-tight text-white-smoke placeholder:text-white-smoke/20 focus:outline-none focus:border-white-smoke/50 transition-colors resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold text-white-smoke uppercase tracking-wider">
                  Playlist privacy
                </label>
                <div className="flex w-full overflow-hidden rounded-full border border-white-smoke/20 bg-chinese-black">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPrivate: false })}
                    data-testid="artist-add-to-playlist-panel-privacy-public"
                    className={`flex-1 py-2 text-[12px] font-semibold transition-colors cursor-pointer ${
                      !formData.isPrivate
                        ? "bg-white-smoke text-chinese-black"
                        : "text-white-smoke hover:bg-white-smoke/5"
                    }`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPrivate: true })}
                    data-testid="artist-add-to-playlist-panel-privacy-private"
                    className={`flex-1 py-2 text-[12px] font-semibold transition-colors cursor-pointer ${
                      formData.isPrivate
                        ? "bg-white-smoke text-chinese-black"
                        : "text-white-smoke hover:bg-white-smoke/5"
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 mb-10">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  data-testid="artist-add-to-playlist-panel-cancel-create"
                  className="rounded-full bg-red-500 px-8 py-2 text-[12px] font-semibold text-chinese-black hover:bg-white-smoke/80 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreatePlaylist}
                  disabled={createLoading}
                  data-testid="artist-add-to-playlist-panel-save-create"
                  className="rounded-full bg-white-smoke px-8 py-2 text-[12px] font-semibold text-chinese-black hover:bg-white-smoke/80 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {createLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                data-testid="artist-add-to-playlist-panel-create-button"
                className="flex items-center gap-4 w-full rounded-lg bg-chinese-black hover:bg-white-smoke/5 transition-colors px-4 py-3 cursor-pointer"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-white-smoke/10 border border-white-smoke/15">
                  <span className="text-[22px] font-thin text-white-smoke leading-none">+</span>
                </div>
                <span className="text-[14px] font-semibold text-white-smoke">Create playlist</span>
              </button>

              {playlistsLoading ? (
                <div className="flex justify-center py-10">
                  <Spin className="text-white-smoke" />
                </div>
              ) : !playlists || playlists.length === 0 ? (
                <p className="text-[13px] text-white-smoke/30 py-4 px-1">
                  No playlists yet. Create one to get started!
                </p>
              ) : (
                <div className="space-y-1">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist._id}
                      className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-white-smoke/5 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white-smoke/10">
                          {playlist.image?.imgLink ? (
                            <img
                              src={playlist.image.imgLink}
                              alt={playlist.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-[10px] font-semibold text-white-smoke/30">
                                No art
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-white-smoke truncate">
                            {playlist.title}
                          </p>
                          <p className="text-[12px] text-white-smoke/40">
                            {playlist.listOfTracks.length} track
                            {playlist.listOfTracks.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddTracksToPlaylist(playlist._id)}
                        disabled={addingToPlaylistId === playlist._id || addLoading}
                        data-testid={`artist-add-to-playlist-panel-add-btn-${playlist._id}`}
                        className="ml-3 shrink-0 rounded-full border border-white-smoke/30 px-5 py-1.5 text-[12px] font-semibold text-white-smoke hover:border-white-smoke/70 hover:bg-white-smoke/5 transition-colors disabled:opacity-40 cursor-pointer"
                      >
                        {addingToPlaylistId === playlist._id ? (
                          <Spin size="small" />
                        ) : (
                          "Add to playlist"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
