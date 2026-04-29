"use client"

import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/store/hooks"



import Button from "@/components/ui/Button";
import WaveformCard from "@/components/layout/track-cards/WaveformCard"


interface Item { id: string; trackId?: string; title: string; artist: string; img: string; trackUrl?: string; downloadUrl?: string; enableDirectDownload?: boolean; duration?: number; numLikes?: number; numReposts?: number; isLikedByUser?: boolean; canEdit?: boolean }
interface Props { items: Item[]; onEditTrack?: (item: Item) => void; onAddToPlaylist?: (item: Item) => void }

export default function All({ items, onEditTrack, onAddToPlaylist }: Props) {
  const router = useRouter()
  const isOwn     = useAppSelector((state) => state.profile.isOwnProfile)
  return (
    <>
    <h1 className="text-2xl font-bold mb-4 ">Recent</h1>
    <div className="flex flex-col gap-12">
      {items.map((item) => (
        <WaveformCard
          key={item.id}
          img={item.img}
          title={item.title}
          artist={item.artist}
          trackId={item.trackId ?? item.id}
          trackUrl={item.trackUrl}
          downloadUrl={item.downloadUrl}
          enableDirectDownload={item.enableDirectDownload}
          duration={item.duration}
          likeCount={item.numLikes ?? 0}
          repostCount={item.numReposts ?? 0}
          isLikedByUser={item.isLikedByUser}
          canEdit={item.canEdit}
          onEdit={onEditTrack ? () => onEditTrack(item) : undefined}
          onAddToPlaylist={onAddToPlaylist ? () => onAddToPlaylist(item) : undefined}
        />
      ))}
    </div>

    <div className="flex flex-col gap-2">
    <div className="flex justify-center">
        <img src="/app-logo/whitelogo.png" alt="App Logo" className="w-12 logo-dark h-8 mt-8 opacity-50" />
        <img src="/app-logo/blacklogo.png" alt="App Logo" className="w-12 logo-light h-8 mt-8 opacity-50" />
        
    </div>
    <p className="flex justify-center">More uploads means more listeners.</p>
    <div className="flex justify-center">
          (isOwn && (
            <Button
              data-testid="upload more-button-All tab"
              className="bg-white-smoke text-chinese-black cursor-pointer w-30"
              onClick={() => router.push("/upload")}
            >
              Upload more
            </Button>
          ))
          
    </div>
    
    </div>

    </>
    
  )
}