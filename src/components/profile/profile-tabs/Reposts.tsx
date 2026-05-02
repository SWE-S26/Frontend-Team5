import WaveformCard from "@/components/layout/track-cards/WaveformCard"
import PlaylistWaveformCard from "@/components/layout/track-cards/WaveformPlaylist"
import { Track as StoreTrack } from "@/store/slices/playerSlice"

interface Item {
  id: string
  type?: "track" | "playlist"
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
  wfLink?: string
  isRepost?: boolean
  reposterId?: string
  reposterName?: string
  permalink?: string
  isAvailableForUser?: boolean
}

interface Props {
  items: Item[]
  profileLink?: string | null
  onEditTrack?: (item: Item) => void
  onAddToPlaylist?: (item: Item) => void
  feedQueue?: StoreTrack[]
}

export default function Reposts({ items, profileLink, onEditTrack, onAddToPlaylist, feedQueue }: Props) {
  return (
    <>
      <div className="flex flex-col gap-12">
        {items.map((item) => (
          item.type === "playlist" ? (
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
                  basicInfo: t.basicInfo ?? { title: t.title ?? "Unknown Title", mainArtists: t.basicInfo?.mainArtists ?? [t.artist ?? "Unknown Artist"], permalink: "" },
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
              feedQueue={feedQueue}
              isRepost={item.isRepost}
              reposterId={item.reposterId}
              reposterName={item.reposterName}
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
              wfLink={item.wfLink}
              downloadUrl={item.downloadUrl}
              enableDirectDownload={item.enableDirectDownload}
              duration={item.duration}
              likeCount={item.numLikes ?? 0}
              repostCount={item.numReposts ?? 0}
              isLikedByUser={item.isLikedByUser}
              isRepostedByUser={item.isRepostedByUser}
              canEdit={item.canEdit}
              isRepost={item.isRepost}
              reposterId={item.reposterId}
              reposterName={item.reposterName}
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

      <div className="flex justify-center">
        <img src="/app-logo/whitelogo.png" alt="App Logo" className="w-12 logo-dark h-8 mt-8 opacity-50" />
        <img src="/app-logo/blacklogo.png" alt="App Logo" className="w-12 logo-light h-8 mt-8 opacity-50" />
      </div>
    </>
  )
}
