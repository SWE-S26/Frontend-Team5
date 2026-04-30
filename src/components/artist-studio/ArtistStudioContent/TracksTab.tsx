import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useGetPostedTracks, useDeleteTrack } from "@/hooks/useTracks";
import { IoIosGlobe } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { BsSortDown } from "react-icons/bs";
import { ImEqualizer2 } from "react-icons/im";
import { LuSearch } from "react-icons/lu";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { PrettyCheckbox } from "@/components/upload/TrackInfoForm";
import {
  formatDuration,
  formatDate,
  SortField,
  ArtistTrackRow,
} from "../ArtistStudioContent";
import { BulkSelectionHeader } from "./BulkSelectionHeader";
import { TrackRow } from "./TrackRow";
import { ArtistProBenefits } from "./ArtistProBenefits";
import { AmplifyModal } from "./AmplifyModal";
import { EditTrackPanel } from "./EditTrackPanel";
import { BulkEditPanel } from "./BulkEditPanel";
import { AddToPlaylistPanel } from "./AddToPlaylistPanel";
import { TrackContextMenu } from "./TrackContextMenu";
import { DeleteTrackModal } from "./DeleteTrackModal";

function TracksTableHeader({
  onSelectAll,
  allSelected,
}: {
  onSelectAll: (v: boolean) => void;
  allSelected: boolean;
}) {
  return (
    <div
      className="mt-4 grid min-w-175 border-b border-[#2a2a2a] px-3 pb-2"
      style={{
        gridTemplateColumns:
          "32px minmax(200px, 1fr) 80px 120px 220px 80px 130px 30px",
      }}
    >
      <div className="flex items-center">
        <PrettyCheckbox checked={allSelected} onChange={onSelectAll} />
      </div>
      <div className="text-[11px] font-bold tracking-[0.8px] text-white-smoke">
        TRACKS
      </div>
      <div className="text-center text-[11px] font-bold tracking-[0.8px] text-white-smoke">
        DURATION
      </div>
      <div className="text-center text-[11px] font-bold tracking-[0.8px] text-white-smoke">
        DATE
      </div>
      <div className="text-center text-[11px] font-bold tracking-[0.8px] text-white-smoke">
        ENGAGEMENTS
      </div>
      <div className="text-right text-[11px] font-bold tracking-[0.8px] text-white-smoke">
        PLAYS
      </div>
    </div>
  );
}

function TracksActionBar({
  isArtistPro,
  onUpload,
  onDistribute,
  onMonetize,
  onMaster,
}: {
  isArtistPro: boolean;
  onUpload: () => void;
  onDistribute: () => void;
  onMonetize: () => void;
  onMaster: () => void;
}) {
  const btnClass =
    "flex w-full items-center justify-center gap-2 rounded-md border border-[#3a3a3a] bg-transparent px-3 py-2 text-[13px] font-semibold text-white-smoke transition-colors hover:border-[#555] cursor-pointer sm:w-auto sm:justify-start sm:px-5 sm:py-3 sm:text-[15px] lg:text-[18px]";
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
      <button
        type="button"
        onClick={onUpload}
        data-testid="artist-tracks-upload"
        className={btnClass}
      >
        <span>+ Upload or drop tracks</span>
      </button>
      {!isArtistPro && (
        <>
          <button
            type="button"
            onClick={onDistribute}
            data-testid="artist-tracks-distribute"
            className={btnClass}
          >
            <IoIosGlobe />
            <span>Distribute tracks</span>
          </button>
          <button
            type="button"
            onClick={onMonetize}
            data-testid="artist-tracks-monetize"
            className={btnClass}
          >
            <RiMoneyDollarCircleLine />
            <span>Monetize tracks</span>
          </button>
          <button
            type="button"
            onClick={onMaster}
            data-testid="artist-tracks-master"
            className={btnClass}
          >
            <ImEqualizer2 />
            <span>Master track audio</span>
          </button>
        </>
      )}
    </div>
  );
}

function SortDropdown({
  sortField,
  sortDir,
  onSortField,
  onSortDir,
}: {
  sortField: SortField;
  sortDir: "asc" | "desc";
  onSortField: (f: SortField) => void;
  onSortDir: (d: "asc" | "desc") => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const options: { label: string; value: SortField }[] = [
    { label: "Date", value: "date" },
    { label: "Plays", value: "plays" },
    { label: "Duration", value: "duration" },
    { label: "Likes", value: "likes" },
  ];

  const handleSelect = (value: SortField) => {
    if (value === sortField) {
      onSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      onSortField(value);
      onSortDir("desc");
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-testid="artist-tracks-sort-toggle"
        className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-white-smoke transition-colors cursor-pointer"
      >
        <BsSortDown className="text-sm" />
        {options.find((o) => o.value === sortField)?.label}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg bg-chinese-black py-2 shadow-xl">
          <p className="px-4 pb-2 pt-1 text-[10px] font-bold tracking-widest text-white-smoke">
            SORT BY
          </p>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              data-testid={`artist-tracks-sort-${opt.value}`}
              className="flex w-full items-center justify-between px-4 py-2.5 text-[13px] hover:bg-upload-select transition-colors cursor-pointer"
            >
              <span
                className={
                  sortField === opt.value
                    ? "font-bold text-white-smoke"
                    : "font-normal text-white-smoke"
                }
              >
                {opt.label}
              </span>
              {sortField === opt.value && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path
                    d="M1 5L4.5 8.5L11 1"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TracksFilterBar({
  isMobile,
  search,
  onSearch,
  filter,
  onFilter,
  count,
  sortField,
  onSortField,
  sortDir,
  onSortDir,
}: {
  isMobile: boolean;
  search: string;
  onSearch: (v: string) => void;
  filter: "public" | "private";
  onFilter: (v: "public" | "private") => void;
  count: number;
  sortField: SortField;
  onSortField: (f: SortField) => void;
  sortDir: "asc" | "desc";
  onSortDir: (d: "asc" | "desc") => void;
}) {
  const pillClass = (active: boolean) =>
    `rounded-full border px-5 py-1.5 text-[13px] transition-colors cursor-pointer ${
      active
        ? "border-white-smoke text-white-smoke"
        : "border-[#444] text-[#888] hover:border-upload-select"
    }`;

  return (
    <div className="mb-0 flex flex-wrap items-center gap-2.5">
      <div className={`relative ${isMobile ? "w-full" : "w-72"}`}>
        <LuSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#666] text-[14px]" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          data-testid="artist-tracks-search"
          placeholder="Search tracks"
          className="w-full rounded-full border border-[#333] bg-transparent py-1.5 pl-9 pr-3 text-[13px] text-white-smoke outline-none placeholder:text-[#666] focus:border-[#555]"
        />
      </div>
      <button
        type="button"
        onClick={() => onFilter("public")}
        data-testid="artist-tracks-filter-public"
        className={pillClass(filter === "public")}
      >
        Public
      </button>
      <button
        type="button"
        onClick={() => onFilter("private")}
        data-testid="artist-tracks-filter-private"
        className={pillClass(filter === "private")}
      >
        Private
      </button>
      <div
        className={`flex items-center gap-2 text-[13px] ${isMobile ? "w-full justify-between" : "ml-auto"}`}
      >
        <span className="font-semibold text-white-smoke">{count} tracks</span>
        <SortDropdown
          sortField={sortField}
          onSortField={onSortField}
          sortDir={sortDir}
          onSortDir={onSortDir}
        />
      </div>
    </div>
  );
}

function MobileSelectionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onEditSelected,
  onAddSelectedToPlaylist,
}: {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onEditSelected: () => void;
  onAddSelectedToPlaylist: () => void;
}) {
  const allSelected = selectedCount === totalCount && totalCount > 0;
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-chinese-black p-2.5">
      <div className="flex items-center gap-2.5">
        <PrettyCheckbox
          checked={allSelected}
          onChange={(v) => (v ? onSelectAll() : onDeselectAll())}
        />
        <span className="text-[12px] font-bold text-white-smoke">
          {selectedCount} SELECTED
        </span>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onEditSelected}
          data-testid="artist-tracks-mobile-edit"
          className="rounded-md border border-[#3a3a3a] px-3 py-1.5 text-[12px] font-semibold text-white-smoke"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onAddSelectedToPlaylist}
          data-testid="artist-tracks-mobile-add-to-playlist"
          className="rounded-md border border-[#3a3a3a] px-3 py-1.5 text-[12px] font-semibold text-white-smoke"
        >
          Add to playlist
        </button>
      </div>
    </div>
  );
}

export function TracksTab({
  isMobile,
  isArtistPro,
}: {
  isMobile: boolean;
  isArtistPro: boolean;
}) {
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.userId);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const {
    getPostedTracks,
    tracks: postedTracks,
    loading,
    error,
  } = useGetPostedTracks();
  const {
    deleteTrack,
    loading: loadingDelete,
    error: errorDelete,
    success,
  } = useDeleteTrack();
  const [filter, setFilter] = useState<"public" | "private">("public");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [durationById, setDurationById] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [localOverrides, setLocalOverrides] = useState<
    Record<string, Partial<ArtistTrackRow>>
  >({});

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const toggleSelect = (id: string, v: boolean) =>
    setSelectedIds((prev) => {
      const s = new Set(prev);
      v ? s.add(id) : s.delete(id);
      return s;
    });

  // Panels & modals
  const [amplifyOpen, setAmplifyOpen] = useState(false);
  const [editTrackId, setEditTrackId] = useState<string | null>(null);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [pendingDeleteTrackId, setPendingDeleteTrackId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (isArtistPro) setAmplifyOpen(false);
  }, [isArtistPro]);

  useEffect(() => {
    if (
      !hasHydrated ||
      !userId ||
      typeof userId !== "string" ||
      userId.trim() === ""
    )
      return;
    void getPostedTracks(userId);
  }, [userId, getPostedTracks, hasHydrated]);

  useEffect(() => {
    if (
      !hasHydrated ||
      !userId ||
      typeof userId !== "string" ||
      userId.trim() === ""
    )
      return;

    const intervalId = window.setInterval(() => {
      void getPostedTracks(userId, { silent: true });
    }, 15000);

    const handleFocus = () => {
      void getPostedTracks(userId, { silent: true });
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [userId, getPostedTracks, hasHydrated]);

  const rows = useMemo<ArtistTrackRow[]>(() => {
    return (postedTracks ?? [])
      .filter((track) => {
        const trackId = track.trackId ?? (track as { _id?: string })._id;
        return trackId !== undefined && !deletedIds.has(trackId);
      })
      .map((track) => {
        const trackId = (track.trackId ??
          (track as { _id?: string })._id) as string;
        const base: ArtistTrackRow = {
          id: trackId,
          title: track.basicInfo.title,
          label: track.basicInfo.mainArtists?.length
            ? track.basicInfo.mainArtists.join(", ")
            : "Unknown Artist",
          duration: formatDuration(
            (track as { durationInSeconds?: number }).durationInSeconds,
          ),
          date: formatDate(track.releaseDate),
          plays: track.numPlays ?? 0,
          likes: track.numLikes ?? 0,
          comments: track.numComments ?? 0,
          reposts: track.numReposts ?? 0,
          hd: false,
          cover: track.image?.imgLink || "/test.jpg",
          url: track.audio?.audioLink,
          downloadUrl: track.audio?.downloadLink,
          isPrivate: Boolean(track.basicInfo.isPrivate),
          rawDate: track.releaseDate ?? "",
          rawDuration:
            (track as { durationInSeconds?: number }).durationInSeconds ?? 0,
        };
        return { ...base, ...localOverrides[trackId] };
      })
      .filter((row) => (filter === "public" ? !row.isPrivate : row.isPrivate))
      .filter((row) => row.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        let diff = 0;
        if (sortField === "date")
          diff =
            new Date(a.rawDate ?? "").getTime() -
            new Date(b.rawDate ?? "").getTime();
        else if (sortField === "plays") diff = a.plays - b.plays;
        else if (sortField === "duration")
          diff = (a.rawDuration ?? 0) - (b.rawDuration ?? 0);
        else if (sortField === "likes") diff = a.likes - b.likes;
        return sortDir === "asc" ? diff : -diff;
      });
  }, [
    postedTracks,
    filter,
    search,
    sortField,
    sortDir,
    deletedIds,
    localOverrides,
  ]);

  useEffect(() => {
    rows.forEach((row) => {
      if (!row.url || row.duration !== "--" || durationById[row.id]) return;
      const audio = new Audio(row.url);
      audio.addEventListener(
        "loadedmetadata",
        () => {
          setDurationById((prev) => ({
            ...prev,
            [row.id]: formatDuration(audio.duration),
          }));
        },
        { once: true },
      );
    });
  }, [rows, durationById]);

  const selectAll = () => setSelectedIds(new Set(rows.map((r) => r.id)));
  const deselectAll = () => setSelectedIds(new Set());
  const hasSelection = selectedIds.size > 0;
  const allSelected = selectedIds.size === rows.length && rows.length > 0;
  const editTrack = rows.find((r) => r.id === editTrackId) ?? null;

  const handleDelete = async (id: string) => {
    if (loadingDelete) return;
    setDeletingId(id);
    try {
      await deleteTrack(id);
      setDeletedIds((prev) => new Set(prev).add(id));
    } catch {
      // error is surfaced via errorDelete from the hook
    } finally {
      setDeletingId(null);
    }
  };

  const pendingDeleteTrackTitle = useMemo(() => {
    if (!pendingDeleteTrackId) return undefined;
    return rows.find((r) => r.id === pendingDeleteTrackId)?.title;
  }, [pendingDeleteTrackId, rows]);

  const handleDownload = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row?.downloadUrl) return;
    window.open(row.downloadUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4">
      <TracksActionBar
        isArtistPro={isArtistPro}
        onUpload={() => router.push("/upload")}
        onDistribute={() => router.push("/artist")}
        onMonetize={() => router.push("/artist")}
        onMaster={() => router.push("/upload")}
      />
      <TracksFilterBar
        isMobile={isMobile}
        search={search}
        onSearch={setSearch}
        filter={filter}
        onFilter={setFilter}
        count={rows.length}
        sortField={sortField}
        onSortField={setSortField}
        sortDir={sortDir}
        onSortDir={setSortDir}
      />

      {isMobile && hasSelection && (
        <MobileSelectionBar
          selectedCount={selectedIds.size}
          totalCount={rows.length}
          onSelectAll={selectAll}
          onDeselectAll={deselectAll}
          onEditSelected={() => {
            if (selectedIds.size > 1) {
              setBulkEditOpen(true);
            } else {
              const firstId = Array.from(selectedIds)[0];
              if (firstId) setEditTrackId(firstId);
            }
          }}
          onAddSelectedToPlaylist={() => setAddToPlaylistOpen(true)}
        />
      )}

      <div className={!isMobile ? "overflow-x-auto" : undefined}>
        {!isMobile &&
          (hasSelection ? (
            <BulkSelectionHeader
              selectedCount={selectedIds.size}
              totalCount={rows.length}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onEditSelected={() => {
                if (selectedIds.size > 1) {
                  setBulkEditOpen(true);
                } else {
                  const firstId = Array.from(selectedIds)[0];
                  if (firstId) setEditTrackId(firstId);
                }
              }}
              onAddSelectedToPlaylist={() => setAddToPlaylistOpen(true)}
            />
          ) : (
            <TracksTableHeader
              allSelected={allSelected}
              onSelectAll={(v) => (v ? selectAll() : deselectAll())}
            />
          ))}

        {loading && (
          <div className="px-3 py-6">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 32, color: "white" }}
                  spin
                />
              }
            />
          </div>
        )}
        {!loading && !isAuthenticated && (
          <div className="px-3 py-6 text-[13px] text-red-400">
            You must be logged in to view your tracks.
          </div>
        )}
        {!loading && isAuthenticated && error && (
          <div className="px-3 py-6 text-[13px] text-red-400">
            Failed to load tracks. Please try again.
          </div>
        )}
        {!loading && isAuthenticated && !error && rows.length === 0 && (
          <div className="px-3 py-6 text-[13px] text-[#888]">
            No tracks found.
          </div>
        )}
        {!loading &&
          isAuthenticated &&
          !error &&
          rows.map((track) => (
            <TrackRow
              key={track.id}
              track={{
                ...track,
                duration: durationById[track.id] || track.duration,
              }}
              isMobile={isMobile}
              isArtistPro={isArtistPro}
              isSelected={selectedIds.has(track.id)}
              onSelect={toggleSelect}
              onAmplify={() => {
                if (!isArtistPro) setAmplifyOpen(true);
              }}
              contextMenu={
                <TrackContextMenu
                  trackId={track.id}
                  onEdit={(id) => setEditTrackId(id)}
                  onAddToPlaylist={() => setAddToPlaylistOpen(true)}
                  onDownload={handleDownload}
                  canDownload={isArtistPro && Boolean(track.downloadUrl)}
                  onDelete={(id) => {
                    setPendingDeleteTrackId(id);
                  }}
                  isArtistPro={isArtistPro}
                />
              }
              isDeleting={deletingId === track.id}
            />
          ))}
      </div>
      {errorDelete && (
        <div className="px-3 py-2 text-[13px] text-red-400">{errorDelete}</div>
      )}

      {!isArtistPro && <ArtistProBenefits isArtistPro={isArtistPro} />}

      {amplifyOpen && !isArtistPro && (
        <AmplifyModal
          onClose={() => setAmplifyOpen(false)}
          onUnlock={() => router.push("/artist")}
        />
      )}
      <DeleteTrackModal
        isOpen={Boolean(pendingDeleteTrackId)}
        trackTitle={pendingDeleteTrackTitle}
        isLoading={loadingDelete}
        error={errorDelete}
        onClose={() => setPendingDeleteTrackId(null)}
        onConfirm={() => {
          if (!pendingDeleteTrackId) return;
          void handleDelete(pendingDeleteTrackId).finally(() =>
            setPendingDeleteTrackId(null),
          );
        }}
      />
      {editTrack && (
        <EditTrackPanel
          track={editTrack}
          onClose={() => setEditTrackId(null)}
          onSave={(updated) => {
            setLocalOverrides((prev) => ({
              ...prev,
              [editTrack.id]: { ...prev[editTrack.id], ...updated },
            }));
          }}
        />
      )}
      {bulkEditOpen && (
        <BulkEditPanel
          selectedIds={selectedIds}
          tracks={rows}
          onClose={() => setBulkEditOpen(false)}
        />
      )}
      {addToPlaylistOpen && (
        <AddToPlaylistPanel
          selectedTrackIds={selectedIds}
          onClose={() => setAddToPlaylistOpen(false)}
        />
      )}
    </div>
  );
}
