import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"

import Button from "@/components/ui/Button"
import WaveformCard from "@/components/layout/track-cards/WaveformCard"
import PlaylistWaveformCard from "@/components/layout/track-cards/WaveformPlaylist"

interface Item {
  id: string
  type?: 'track' | 'playlist'
  trackId?: string
  title: string
  artist: string
  artistId?: string
  img: string
  trackUrl?: string
  downloadUrl?: string
  enableDirectDownload?: boolean
  duration?: number
  numLikes?: number
  numReposts?: number
  isLikedByUser?: boolean
  isRepostedByUser?: boolean
  canEdit?: boolean
  numPlays?: number
  numComments?: number
  playlistTracks?: any[]
  totalTracks?: number
  permalink?: string
  isAvailableForUser?: boolean
}
import { Track as StoreTrack } from "@/store/slices/playerSlice"
interface Props { items: Item[]; profileLink?: string | null; onEditTrack?: (item: Item) => void; onAddToPlaylist?: (item: Item) => void; }

export default function All({ items, profileLink, onEditTrack, onAddToPlaylist }: Props) {
  const router = useRouter()
  const isOwn     = useAppSelector((state) => state.profile.isOwnProfile)
  return (
    <>
    <h1 className="text-2xl font-bold mb-4 ">Recent</h1>
    <div className="flex flex-col gap-12">
      {items.map((item) => (
        item.type === 'playlist' ? (
            <PlaylistWaveformCard
              key={item.id}
              img={item.img}
              title={item.title}
              artist={item.artist}
              artistId={item.artistId}
              playlistId={item.id}
              likeCount={item.numLikes ?? 0}
              repostCount={item.numReposts ?? 0}
              isLikedByUser={item.isLikedByUser}
              isRepostedByUser={item.isRepostedByUser}
              permalink={item.permalink}
              profileLinkOverride={profileLink}
              preloadedTracks={
                (item.playlistTracks ?? []).map((t, ii) => ({
                  _id: t._id ?? `${item.id}-${ii}`,
                  poster: t.poster,
                  basicInfo: {
                    ...(t.basicInfo ?? {}),
                    title: t.basicInfo?.title ?? t.title ?? "Unknown Title",
                    mainArtists: t.basicInfo?.mainArtists ?? [t.artist ?? "Unknown Artist"],
                    permalink: t.basicInfo?.permalink ?? t.permalink ?? "",
                  },
                  audio: t.audio ?? { audioLink: "", waveformLink: "" },
                  image: t.image ?? { imgLink: t.img ?? undefined },
                  durationInSeconds: t.durationInSeconds ?? t.duration ?? 0,
                  numOfPlays: t.numOfPlays ?? 0,
                  numOfLikes: t.numOfLikes ?? 0,
                  isLiked: t.isLiked ?? false,
                  isReposted: t.isReposted ?? false,
                  isAvailableForUser: t.isAvailableForUser,
                }))
              }
              totalTracks={item.totalTracks}
            />
        ) : (
          <WaveformCard
          key={item.id}
          img={item.img}
          title={item.title}
          artist={item.artist}
          artistId={item.artistId}
          trackId={item.trackId ?? item.id}
          trackUrl={item.trackUrl}
          wfLink={(item as any).wfLink}
          isRepost={(item as any).isRepost}
          reposterId={(item as any).reposterId}
          reposterName={(item as any).reposterName}
          downloadUrl={item.downloadUrl}
          enableDirectDownload={item.enableDirectDownload}
          duration={item.duration}
          likeCount={item.numLikes ?? 0}
          repostCount={item.numReposts ?? 0}
          isLikedByUser={item.isLikedByUser}
          isRepostedByUser={item.isRepostedByUser}
          canEdit={item.canEdit}
          onEdit={onEditTrack ? () => onEditTrack(item) : undefined}
          onAddToPlaylist={onAddToPlaylist ? () => onAddToPlaylist(item) : undefined}
          playsCount={item.numPlays ?? 0}
          commentsCount={item.numComments ?? 0}
          permalink={item.permalink}
          isAvailable={item.isAvailableForUser}
          profileLinkOverride={profileLink}
          />
        )
      ))}
    </div>

    <div className="flex flex-col gap-2">
    <div className="flex justify-center">
        <img src="/app-logo/whitelogo.png" alt="App Logo" className="w-12 logo-dark h-8 mt-8 opacity-50" />
        <img src="/app-logo/blacklogo.png" alt="App Logo" className="w-12 logo-light h-8 mt-8 opacity-50" />
        
    </div>
    <p className="flex justify-center">More uploads means more listeners.</p>
    <div className="flex justify-center">
          {isOwn && (
            <Button
              data-testid="upload more-button-All tab"
              className="bg-white-smoke text-chinese-black cursor-pointer w-30"
              onClick={() => router.push("/upload")}
            >
              Upload more
            </Button>
          )}
          
    </div>
    
    </div>

    </>
    
  )
}