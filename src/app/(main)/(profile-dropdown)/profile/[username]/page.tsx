"use client"
import { useMemo, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { useFollowUser, useUnfollowUser } from "@/hooks/useSocial"

import ProfileHeader from "@/components/profile/profile-header/ProfileHeader"
import ProfileSideBar from "@/components/profile/side-bar/ProfileSideBar"
import NewMessagePopUP from "@/components/messages/NewMessagePopUP"

import { LuShare } from "react-icons/lu"
import { MdOutlineEdit } from "react-icons/md"
import { BsThreeDots } from "react-icons/bs"
import { IoRadio } from "react-icons/io5"
import { FaRegEnvelope } from "react-icons/fa6"
import { useEffect } from "react"
import { AiOutlineStop } from "react-icons/ai";
import { BsExclamationCircle } from "react-icons/bs";

import SharePopup from "@/components/profile/SharePopUp"
import ProfileEditForm from "@/components/profile/ProfileEditForm"
import { EditTrackModal } from "@/components/artist-studio/ArtistStudioContent/EditTrackModal"
import { AddToPlaylistPanel as ArtistStudioAddToPlaylistPanel } from "@/components/artist-studio/ArtistStudioContent/AddToPlaylistPanel"

import TabsNavbar from "@/components/layout/navbar/TabsNavbar"
import EmptyTab from "@/components/profile/profile-tabs/EmptyTab"
import All from "@/components/profile/profile-tabs/All"
import PopularTracks from "@/components/profile/profile-tabs/PopularTracks"
import Tracks from "@/components/profile/profile-tabs/Tracks"
import Albums from "@/components/profile/profile-tabs/Albums"
import Playlists from "@/components/profile/profile-tabs/Playlists"
import Reposts from "@/components/profile/profile-tabs/Reposts"
import BlockPopUp from "@/components/messages/conversation/BlockPopUp"
import ReportPopUp from "@/components/report/ReportPopUp"
import Button from "@/components/ui/Button"
import { useBlockUser, useUnblockUser } from "@/hooks/useSocial"
import { setProfile } from "@/store/slices/profileSlice"
import { useGetLikedTracks, useGetPostedTracks} from "@/hooks/useTracks"
import { Track } from "@/types/tracks.types"
import type { ArtistTrackRow } from "@/components/artist-studio/ArtistStudioContent"
import { useGetRepostedTracks } from "@/hooks/useTracks"
import { useGetRepostedPlaylists, useGetMyPlaylists } from "@/hooks/usePlaylists"
import { tracksService } from "@/services/tracks.service"
import { playlistsService } from "@/services/playlists.service"
import { Track as StoreTrack } from "@/store/slices/playerSlice"
import { PlaylistDetail } from "@/types/playlists.types"
import { Playlist } from "@/types/playlists.types"
import { profileService } from "@/services/profile.service"

interface Props {
  params: { username: string }
}

const profileTabs = [
  { href: "", label: "All",            value: "all"            },
  { href: "", label: "Popular tracks", value: "popular-tracks" },
  { href: "", label: "Tracks",         value: "tracks"         },
  { href: "", label: "Albums",         value: "albums"         },
  { href: "", label: "Playlists",      value: "playlists"      },
  { href: "", label: "Reposts",        value: "reposts"        },
]


const ProfilePage = ({ params }: Props) => {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const activeTab    = searchParams.get("tab") ?? "all"

  const [openEdit,    setOpenEdit]    = useState(false)
  const [openShare,   setOpenShare]   = useState(false)
  const [openMessage, setOpenMessage] = useState(false)
  const [openMoreMenu, setOpenMoreMenu] = useState(false)
  const [openAddToPlaylist, setOpenAddToPlaylist] = useState(false)
  const [editingTrack, setEditingTrack] = useState<ArtistTrackRow | null>(null)
  const[OpenReport, setIsOpenReport] = useState(false)
  const [OpenBlock, setOpenBlock] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const isFollowed                          = useAppSelector((state) => state.profile.isFollowed)
  const profileUserId                       = useAppSelector((state) => state.profile.userId)
  const isBlocked     = useAppSelector((state) => state.profile.isBlocked)
  const { followUser,   loading: followLoading   } = useFollowUser()
  const { unfollowUser, loading: unfollowLoading } = useUnfollowUser()
  const followButtonLoading = followLoading || unfollowLoading
  const { blockUser }   = useBlockUser()
  const { unblockUser } = useUnblockUser()
  const amIBlocked = useAppSelector((state) => state.profile.amIBlocked)
  const dispatch = useAppDispatch()

  const isLoading = useAppSelector((state) => state.profile.isLoading)
  const isOwn     = useAppSelector((state) => state.profile.isOwnProfile)
  const displayName = useAppSelector((state) => state.profile.displayName)
  const profileImgLink = useAppSelector((state) => state.profile.profileImgLink)
  const profileTrackCount = useAppSelector((state) => state.profile.trackCount)
  
  
  const role = useAppSelector((state) => state.profile.role)
  const { getPostedTracks, tracks: postedTracks, loading: postedTracksLoading } = useGetPostedTracks()
  const { getLikedTracks, tracks: likedTracks, loading: likedTracksLoading } = useGetLikedTracks()
  const artist = role === "Artist"
  const { getRepostedTracks, tracks: repostedTracks, loading: repostedTracksLoading } = useGetRepostedTracks()
  const { getRepostedPlaylists, playlists: repostedPlaylists, loading: repostedPlaylistsLoading } = useGetRepostedPlaylists()
  const { getMyPlaylists, playlists: myPlaylists, loading: myPlaylistsLoading } = useGetMyPlaylists()
  const [playlistDetails, setPlaylistDetails] = useState<PlaylistDetail[]>([])
  const [resolvedRepostedTracks, setResolvedRepostedTracks] = useState<Track[]>([])
  const fetchedPlaylistIds = useRef(new Set<string>())
  const fetchedRepostedTrackIds = useRef(new Set<string>())
  const [creatorMap, setCreatorMap] = useState<Record<string, string>>({})

   
  

  const handleTabChange = (tab: string) => {
    const current = new URLSearchParams(searchParams.toString())
    current.set("tab", tab)
    router.push(`?${current.toString()}`, { scroll: false })
  }

  useEffect(() => {
  if (!openMoreMenu) return
  const handleClick = (e: MouseEvent) => {
    if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
      setOpenMoreMenu(false)
    }
  }
  document.addEventListener("mousedown", handleClick)
  return () => document.removeEventListener("mousedown", handleClick)
}, [openMoreMenu])

  useEffect(() => {
    if (!profileUserId || isLoading) return
    if (activeTab === "tracks" || activeTab === "all" || activeTab === "popular-tracks") {
      void getPostedTracks(profileUserId)
    }
    if (activeTab === "all") {
      void getLikedTracks(profileUserId)
    }
    if (activeTab === "all" || activeTab === "reposts") {
      void getRepostedTracks(profileUserId)
      void getRepostedPlaylists(profileUserId)
    }
    if (activeTab === "playlists") {
      void getMyPlaylists()
    }
  }, [activeTab, profileUserId, getPostedTracks, getLikedTracks, getRepostedTracks, getRepostedPlaylists, getMyPlaylists, isLoading])

  useEffect(() => {
    const trackIds = Array.from(
      new Set(
        (repostedTracks ?? [])
          .map((track) => track.trackId ?? (track as any)._id)
          .filter((id): id is string => Boolean(id) && !fetchedRepostedTrackIds.current.has(id)),
      ),
    )

    if (!trackIds.length) return

    const resolve = async () => {
      const results = await Promise.allSettled(
        trackIds.map((id) => tracksService.getTrackById(id)),
      )

      const resolved: Track[] = []
      ;(results as PromiseSettledResult<any>[]).forEach((result, index) => {
        if (result.status === "fulfilled") {
          const track = result.value.data?.data ?? result.value.data
          if (track) {
            resolved.push(track)
            fetchedRepostedTrackIds.current.add(trackIds[index])
          }
        }
      })

      if (resolved.length) {
        setResolvedRepostedTracks((previous) => {
          const byId = new Map(previous.map((track) => [track.trackId ?? (track as any)._id, track]))
          resolved.forEach((track) => {
            const id = track.trackId ?? (track as any)._id
            if (id) byId.set(id, track)
          })
          return Array.from(byId.values())
        })
      }
    }

    void resolve()
  }, [repostedTracks])

  useEffect(() => {
    const ids = new Set<string>()
    ;(repostedPlaylists ?? []).forEach((playlist) => {
      if (playlist._id) ids.add(playlist._id)
    })
    ;(myPlaylists ?? []).forEach((playlist) => {
      if (playlist._id) ids.add(playlist._id)
    })

    const toFetch = Array.from(ids).filter(
      (id) => !fetchedPlaylistIds.current.has(id),
    )
    if (!toFetch.length) return

    const resolve = async () => {
      const results = await Promise.allSettled(
        toFetch.map((id) => playlistsService.getPlaylistById(id)),
      )

      const resolved: PlaylistDetail[] = []
      ;(results as PromiseSettledResult<any>[]).forEach((result, index) => {
        if (result.status === "fulfilled") {
          const pl = result.value.data?.data?.playlist
          const detail = Array.isArray(pl) ? pl[0] : pl
          if (detail) {
            resolved.push(detail)
            fetchedPlaylistIds.current.add(toFetch[index])
          }
        }
      })

      if (resolved.length) {
        setPlaylistDetails((previous) => [...previous, ...resolved])
      }
    }

    void resolve()
  }, [repostedPlaylists, myPlaylists])

  useEffect(() => {
    const artistIds = new Set<string>()
    ;(repostedPlaylists ?? []).forEach((p) => { if (p.artistId) artistIds.add(p.artistId) })
    ;(myPlaylists ?? []).forEach((p) => { if (p.artistId) artistIds.add(p.artistId) })
    ;(playlistDetails ?? []).forEach((pd) => { if ((pd as any).artistId) artistIds.add((pd as any).artistId) })

    const toFetch = Array.from(artistIds).filter((id) => !creatorMap[id])
    if (!toFetch.length) return

    const resolve = async () => {
      const results = await Promise.allSettled(
        toFetch.map((id) => playlistsService.getPlaylistCreator(id)),
      )

      const updates: Record<string, string> = {}
      ;(results as PromiseSettledResult<any>[]).forEach((result, idx) => {
        const id = toFetch[idx]
        if (result.status === 'fulfilled') {
          const artist = result.value.data?.data?.artist
          const a = Array.isArray(artist) ? artist[0] : artist
          if (a && a.displayName) updates[id] = a.displayName
        }
      })

      if (Object.keys(updates).length) setCreatorMap((prev) => ({ ...prev, ...updates }))
    }

    void resolve()
  }, [repostedPlaylists, myPlaylists, playlistDetails, creatorMap])

  const getTrackSortTime = (track: { releaseDate?: string; _id?: string }) => {
    const releaseTime = track.releaseDate ? new Date(track.releaseDate).getTime() : NaN
    if (Number.isFinite(releaseTime)) return releaseTime

    const objectIdPrefix = track._id?.slice(0, 8)
    if (objectIdPrefix && /^[0-9a-fA-F]{8}$/.test(objectIdPrefix)) {
      return parseInt(objectIdPrefix, 16) * 1000
    }

    return 0
  }

  const mapTrackToProfileItem = (track: Track, fallbackIndex: number, canEdit = false) => {
    const stableId = track.trackId ?? `track-${fallbackIndex}`
    return {
      id: stableId,
      trackId: stableId,
      title: track.basicInfo.title,
      artist: track.basicInfo.mainArtists?.length
        ? track.basicInfo.mainArtists.join(", ")
        : "Unknown Artist",
      img: track.image?.imgLink,
      trackUrl: track.audio?.audioLink,
      wfLink: track.audio?.waveformLink,
      downloadUrl: track.audio?.downloadLink,
      duration: track.durationInSeconds,
      numLikes: track.numLikes,
      numReposts: track.numReposts,
      isLikedByUser: track.isLikedByUser,
      numPlays: track.numPlays,
      numComments: track.numComments ?? 0,
      releaseDate: track.releaseDate,
      canEdit,
    }
  }

  const buildEditTrackRow = (item: {
    id?: string;
    trackId?: string;
    title: string;
    artist: string;
    img: string;
    trackUrl?: string;
    downloadUrl?: string;
    duration?: number;
    numLikes?: number;
    numReposts?: number;
    numPlays?: number;
    releaseDate?: string;
    canEdit?: boolean;
  }): ArtistTrackRow => ({
    id: item.id ?? item.trackId ?? "",
    title: item.title,
    label: item.artist,
    duration: item.duration ? `${Math.floor(item.duration / 60)}:${String(item.duration % 60).padStart(2, "0")}` : "--",
    date: item.releaseDate ? new Date(item.releaseDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "--",
    plays: item.numPlays ?? 0,
    likes: item.numLikes ?? 0,
    comments: 0,
    numDownloads: (item as any).numDownloads ?? 0,
    reposts: item.numReposts ?? 0,
    hd: false,
    cover: item.img,
    url: item.trackUrl ?? "",
    downloadUrl: item.downloadUrl,
    isPrivate: false,
    rawDate: item.releaseDate ?? "",
    rawDuration: item.duration,
  })

  const postedTrackItems = [...(postedTracks ?? [])]
    .sort((a, b) => getTrackSortTime(b) - getTrackSortTime(a))
    .map((track, index) => mapTrackToProfileItem(track, index, isOwn))

  const likedTrackItems = [...(likedTracks ?? [])]
    .sort((a, b) => getTrackSortTime(b) - getTrackSortTime(a))
    .map((track, index) => mapTrackToProfileItem(track, index + 10000, false))

  const popularTrackItems = useMemo(
    () => [...postedTrackItems].sort((a, b) => (b.numPlays ?? 0) - (a.numPlays ?? 0)),
    [postedTrackItems],
  )

  const trackCount = postedTrackItems.length

  

  const mapPlaylistToProfileItem = (playlist: Playlist, fallbackIndex: number) => {
    const stableId = playlist._id ?? `playlist-${fallbackIndex}`;
    const rawArtistId = (playlist as any).artistId || (playlist as any).creatorId || (playlist as any).ownerId;
    const artistFromObj = (playlist as any).artistDisplayName || (playlist as any).artistName || (playlist as any).creator?.displayName;
    const resolvedArtistFromMap = rawArtistId ? creatorMap[rawArtistId] : undefined;
    // Prefer explicit display name fields, then resolved creatorMap value. Do NOT show raw DB ids to the user.
    const artistName = artistFromObj || resolvedArtistFromMap || "";
    return {
      id: stableId,
      title: playlist.title,
      artist: artistName,
      img: playlist.image?.imgLink,
      numLikes: playlist.numOfLikes,
      numReposts: playlist.numOfReposts,
      isLikedByUser: playlist.isLiked,
      releaseDate: playlist.createdAt,
    };
  };

  const repostedTrackItems = [...(resolvedRepostedTracks.length ? resolvedRepostedTracks : (repostedTracks ?? []))]
    .sort((a, b) => getTrackSortTime(b) - getTrackSortTime(a))
    .map((track, index) => {
      const base = mapTrackToProfileItem(track as any, index + 20000, false)
      // If there is a repost entry in the original repostedTracks list, attach reposter metadata
      const maybeRepostEntry = (repostedTracks ?? []).find(
        (r: any) => (r.trackId ?? r._id) === (track.trackId ?? (track as any)._id),
      ) as
        | {
            actorId?: string
            reposterId?: string
            userId?: string
            displayName?: string
            reposterName?: string
          }
        | undefined
      if (maybeRepostEntry) {
        return {
          ...base,
          isRepost: true,
          reposterId:
            maybeRepostEntry.actorId ??
            maybeRepostEntry.reposterId ??
            maybeRepostEntry.userId,
          reposterName:
            maybeRepostEntry.displayName ??
            maybeRepostEntry.reposterName ??
            undefined,
        }
      }
      return base
    })

  const repostedPlaylistItems = [...(repostedPlaylists ?? [])]
    .sort((a, b) => {
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bt - at
    })
    .map((playlist, index) => {
      const base = mapPlaylistToProfileItem(playlist, index + 10000)
      const detail = playlistDetails.find((d) => d._id === playlist._id)
      return {
        ...base,
        type: 'playlist' as const,
        playlistTracks: detail?.tracks,
        totalTracks: detail?.totalTracks,
        isRepost: (playlist as any).isRepost ?? (playlist as any).is_repost ?? false,
        reposterId: (playlist as any).actorId ?? (playlist as any).reposterId ?? (playlist as any).userId,
        reposterName: (playlist as any).displayName ?? (playlist as any).reposterName ?? undefined,
      }
    })

  const allRepostItems = [
    ...repostedTrackItems.map(item => ({ ...item, type: 'track' as const })),
    ...repostedPlaylistItems,
  ].sort((a, b) => {
    const at = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
    const bt = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
    return bt - at
  })

    const userPlaylistItems = [...(myPlaylists ?? [])]
      .sort((a, b) => {
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bt - at
      })
      .map((playlist, index) => {
        const base = mapPlaylistToProfileItem(playlist, index)
        const detail = playlistDetails.find((d) => d._id === (playlist._id))
        return {
          ...base,
          playlistTracks: detail?.tracks,
          totalTracks: detail?.totalTracks,
        }
      })
  
    const allTabItems = useMemo(() => {
      const seen = new Set<string>()
      const merged = [
        ...postedTrackItems.map(item => ({ ...item, type: 'track' as const })),
        ...likedTrackItems.map(item => ({ ...item, type: 'track' as const })),
        ...repostedTrackItems.map(item => ({ ...item, type: 'track' as const })),
        ...repostedPlaylistItems,
      ]
      const deduped = merged.filter((item) => {
        if (seen.has(item.id)) return false
        seen.add(item.id)
        return true
      })
      return deduped.sort((a, b) => {
        const at = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
        const bt = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
        return bt - at
      })
    }, [postedTrackItems, likedTrackItems, repostedTrackItems, repostedPlaylistItems])

  const emptyCollections: any[] = []
  const hasKnownNoTracks = !isLoading && profileTrackCount <= 0
  const shouldShowTracksSkeleton = (postedTracksLoading || likedTracksLoading) && profileTrackCount > 0

  return (
    <div>
      <ProfileHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0 px-3 sm:px-0">
        <TabsNavbar
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          textSize="text-md"
          className="flex items-center text-white-smoke py-4 sm:py-6 px-1 overflow-x-auto w-full sm:w-auto"
          tabsWrapperClassName="flex space-x-4 sm:space-x-6 whitespace-nowrap"
        />

        <div className="flex flex-wrap gap-2 pb-2 sm:pb-0 mx-auto sm:mx-0">
          {!isLoading && (
            <>
              {trackCount ? (
                <Button data-testid="station-button" className="relative group font-bold bg-off-black justify-center cursor-pointer hover:text-silver">
                  <IoRadio className="w-5 h-5" />
                  <span className="ml-1 text-sm px-1 py-0.5">Station</span>
                </Button>
              ) : null}
              {isOwn ? (
                <>
                  <Button data-testid="share-button"
                    onClick={() => setOpenShare(!openShare)}
                    className="relative group   bg-off-black font-bold  justify-center  cursor-pointer hover:text-silver "
                  >
                    <LuShare className="w-4 h-4" />
                    <span className="ml-1 text-sm  px-1 py-0.5">Share</span>
                  </Button>
                  <SharePopup isOpen={openShare} onClose={() => setOpenShare(false)} />

                  <Button data-testid="edit-button"
                    onClick={() => setOpenEdit(true)}
                    className="relative group   bg-off-black font-bold  justify-center cursor-pointer hover:text-silver "
                  >
                    <MdOutlineEdit className="w-5 h-5 " />
                    <span className="ml-1 text-sm   px-1 py-0.5">Edit</span>
                  </Button>
                  <ProfileEditForm isOpen={openEdit} onClose={() => setOpenEdit(false)} />
                </>
              ) : (
                
                <>
                
                   
                  <button data-testid="Follow-button"
                    onClick={async () => {
                      if (!profileUserId || followButtonLoading || amIBlocked) return
                      if (isFollowed) {
                          const res = await unfollowUser(profileUserId)
                          if (res) {
                            profileService.invalidateProfileCache(profileUserId)
                            dispatch(setProfile({ isFollowed: false }))
                          }
                      } else {
                          const res = await followUser(profileUserId)
                          if (res) {
                            profileService.invalidateProfileCache(profileUserId)
                            dispatch(setProfile({ isFollowed: true }))
                          }
                      }
                  }}
                    disabled={followButtonLoading}
                    className="relative group p-2 rounded-md bg-white-smoke text-chinese-black transition flex items-center justify-center px-4 py-1 cursor-pointer hover:text-silver h-10"
                  >
                    {isFollowed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <circle cx="10" cy="7.5" r="3.5" />
                        <path d="M2 20h16c0-4.4-3.6-8-8-8s-8 3.6-8 8z" />
                        <path d="M16 9l2.5 2.5 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <circle cx="10" cy="7.5" r="3.5" />
                        <path d="M2 20h16c0-4.4-3.6-8-8-8s-8 3.6-8 8z" />
                        <path d="M19 8v2.5h2.5v1.5H19v2.5h-1.5V12h-2.5v-1.5h2.5V8H19z" />
                      </svg>
                    )}
                    <span className="ml-1 text-sm font-bold px-1">
                      {isFollowed ? "Following" : "Follow"}
                    </span>
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                      {isFollowed ? "Unfollow" : "Follow"}
                    </span>
                  </button>

                  <button data-testid="share-button"
                    onClick={() => setOpenShare(!openShare)}
                    className="relative group p-2 rounded-md bg-off-black transition flex items-center justify-center px-4 py-1 cursor-pointer hover:text-silver h-10"
                  >
                    <LuShare className="w-4 h-4" />
                    <span className="ml-1 text-sm font-bold px-1">Share</span>
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                      Share
                    </span>
                  </button>
                  <SharePopup isOpen={openShare} onClose={() => setOpenShare(false)} />

                  <button data-testid="SendMsg-button"
                    onClick={() => setOpenMessage(!openMessage)}
                    className="relative group p-2 rounded-md bg-off-black transition flex items-center justify-center px-4 py-1 cursor-pointer hover:text-silver h-10"
                  >
                    <FaRegEnvelope className="w-4 h-4" />
                  </button>
                  <NewMessagePopUP
                    isOpen={openMessage}
                    onClose={() => setOpenMessage(false)}
                    prefilledUser={{
                      userId:      profileUserId   ?? '',
                      displayName: displayName     ?? '',
                      photoUrl:    profileImgLink  ?? '',
                    }}
                  />

                  <div ref={moreMenuRef} className="relative">
                        <button data-testid="ThreeDots-button"
                          onClick={() => setOpenMoreMenu(!openMoreMenu)}
                          className={`relative group p-2 rounded-md bg-off-black transition flex items-center justify-center px-4 py-1 cursor-pointer h-10 ${openMoreMenu ? "text-papaya" : "hover:text-silver"}`}
                        >
                          <BsThreeDots className="w-4 h-4" />
                        </button>

                        {openMoreMenu && (
                          <div className="absolute right-0 top-full mt-1 bg-off-black rounded-md shadow-lg z-50 w-auto py-1  whitespace-nowrap">
                            <button data-testid="Block-button"
                            onClick={async () => {
                                  if (isBlocked) {
                                      await unblockUser(profileUserId!)
                                      dispatch(setProfile({ isBlocked: false }))
                                  } else {
                                      setOpenBlock(true)
                                  }
                              }}
                            className={`flex items-center gap-2 w-full px-4 py-2 text-sm  hover:opacity-50 cursor-pointer font-bold ${isBlocked ? "text-papaya" : "text-white-smoke"}`}>
                              <AiOutlineStop className="h-4 w-4 font-bold " />
                              {isBlocked ? 'Blocked' : 'Block'} {displayName}
                            </button>
                            
                            <button data-testid="Report-button"
                            onClick={() => setIsOpenReport(true)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white-smoke hover:opacity-50 cursor-pointer font-bold">
                                <BsExclamationCircle className="h-4 w-4 font-bold text-white-smoke" />
                                Report {displayName}
                            </button>
                          </div>
                        )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <BlockPopUp isOpen={OpenBlock} onClose={() => setOpenBlock(false)} username={displayName || ''} 
                    onConfirm={async () => {
                    await blockUser(profileUserId!)
                    dispatch(setProfile({ isBlocked: true }))
                    setOpenBlock(false)
                }} />

      <ReportPopUp 
        isOpen={OpenReport} 
        onClose={() => setIsOpenReport(false)}
        username={displayName || ''}
        violatorId={profileUserId || ''}
        violatorType="user"
      />

      <div className="flex flex-col lg:flex-row justify-between gap-4 px-3 sm:px-0">
        <div className="w-full lg:w-[68%]">
          <div >

            {activeTab === "all" && (
              allTabItems.length === 0
                ? <EmptyTab />
                : <All
                    items={allTabItems}
                    onEditTrack={(item) => setEditingTrack(buildEditTrackRow(item))}
                    onAddToPlaylist={() => setOpenAddToPlaylist(true)}
                  />
            )}

            {activeTab === "popular-tracks" && (
              popularTrackItems.length === 0 ? <EmptyTab /> : <PopularTracks
                items={popularTrackItems}
                onEditTrack={(item) => setEditingTrack(buildEditTrackRow(item))}
                onAddToPlaylist={() => setOpenAddToPlaylist(true)}
              />
            )}

            {activeTab === "tracks" && (
              hasKnownNoTracks
                ? <EmptyTab />
                : shouldShowTracksSkeleton || postedTracks === null
                  ? <Tracks items={[]} isLoading />
                  : postedTrackItems.length === 0
                  ? <EmptyTab />
                  : <Tracks
                      items={postedTrackItems}
                      onEditTrack={(item) => setEditingTrack(buildEditTrackRow(item))}
                      onAddToPlaylist={() => setOpenAddToPlaylist(true)}
                    />
            )}

            {activeTab === "albums" && (
              emptyCollections.length === 0 ? <EmptyTab /> : <Albums items={emptyCollections} />
            )}

            {activeTab === "playlists" && (
              userPlaylistItems.length === 0 && !myPlaylistsLoading ? (
                <h2 className="font-bold text-lg flex items-center justify-center text-center">
                  You haven't created any playlists.
                </h2>
              ) : (
                <Playlists items={userPlaylistItems} />
              )
            )}

            {activeTab === "reposts" && (
              allRepostItems.length === 0 && !repostedTracksLoading && !repostedPlaylistsLoading ? (
                <h2 className="font-bold text-lg flex items-center justify-center text-center">
                  You haven't reposted any sounds.
                </h2>
              ) : (
                <Reposts
                  items={allRepostItems}
                  onEditTrack={(item) => setEditingTrack(buildEditTrackRow(item))}
                  onAddToPlaylist={() => setOpenAddToPlaylist(true)}
                />
              )
            )}

          </div>
        </div>

        <div className="w-full lg:w-[27.75%]">
          <ProfileSideBar />
        </div>
      </div>

      {openAddToPlaylist && (
        <ArtistStudioAddToPlaylistPanel onClose={() => setOpenAddToPlaylist(false)} />
      )}

      {editingTrack && (
        <EditTrackModal
          track={editingTrack}
          onClose={() => setEditingTrack(null)}
        />
      )}
    </div>
  )
}

export default ProfilePage