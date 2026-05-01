import PlaylistWaveformCard from "@/components/layout/track-cards/WaveformPlaylist"
import { Track as StoreTrack } from "@/store/slices/playerSlice"

interface Item { id: string; title: string; artist: string; img: string; numLikes?: number; numReposts?: number; isLikedByUser?: boolean; playlistTracks?: any[]; totalTracks?: number }
interface Props { items: Item[]; }
export default function Playlists({ items }: Props) {
  return (
      <>
      <div className="flex flex-col gap-12">
        {items.map((item) => (
          <PlaylistWaveformCard
            key={item.id}
            img={item.img}
            title={item.title}
            artist={item.artist}
            playlistId={item.id}
            likeCount={item.numLikes ?? 0}
            repostCount={item.numReposts ?? 0}
            isLikedByUser={item.isLikedByUser}
            preloadedTracks={
              (item.playlistTracks ?? []).map((t, i) => ({
                _id: t._id ?? `${item.id}-${i}`,
                basicInfo: t.basicInfo ?? { title: t.title ?? "Unknown Title", mainArtists: t.basicInfo?.mainArtists ?? [t.artist ?? "Unknown Artist"], permalink: "" },
                audio: t.audio ?? { audioLink: "", waveformLink: "" },
                image: t.image ?? { imgLink: t.img ?? undefined },
                durationInSeconds: t.durationInSeconds ?? t.duration ?? 0,
                numOfPlays: t.numOfPlays ?? 0,
                numOfLikes: t.numOfLikes ?? 0,
                isLiked: t.isLiked ?? false,
                isReposted: t.isReposted ?? false,
              }))
            }
            totalTracks={item.totalTracks}
          />
        ))}
      </div>
      
      <div className="flex justify-center">
          <img src="/app-logo/whitelogo.png" alt="App Logo" className="w-12 logo-dark h-8 mt-8 opacity-50" />
          <img src="/app-logo/blacklogo.png" alt="App Logo" className="w-12 logo-light h-8 mt-8 opacity-50" />
      </div>
      </>
      
    )
}