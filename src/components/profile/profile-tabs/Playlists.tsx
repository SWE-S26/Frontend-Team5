import WaveformCard from "@/components/layout/track-cards/WaveformCard"

interface Item { id: string; title: string; artist: string; img: string; numLikes?: number; numReposts?: number; isLikedByUser?: boolean }
interface Props { items: Item[] }

export default function Playlists({ items }: Props) {
  return (
      <>
      <div className="flex flex-col gap-12">
        {items.map((item) => (
          <WaveformCard
            key={item.id}
            img={item.img}
            title={item.title}
            artist={item.artist}
            trackId={item.id}
            likeCount={item.numLikes ?? 0}
            repostCount={item.numReposts ?? 0}
            isLikedByUser={item.isLikedByUser}
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