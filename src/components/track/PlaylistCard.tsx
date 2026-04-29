import Image from "next/image"
import { TrackPlaylist } from "@/types/tracks.types"

interface PlaylistCardProps {
  playlist: TrackPlaylist
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <div className="flex gap-3 items-center group cursor-pointer">
      <div className="w-12 h-12 relative shrink-0 overflow-hidden">
        <Image
          src={playlist.image.imgLink || ""}
          alt={playlist.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col min-w-0">
        <p className="text-sm font-bold text-gray-400 truncate">
          {playlist.artistId.displayName}
        </p>
        <p className="text-sm font-bold text-white ">
          {playlist.title}
        </p>
      </div>
    </div>
  )
}