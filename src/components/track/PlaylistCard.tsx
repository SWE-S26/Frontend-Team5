import Image from "next/image"
import { TrackPlaylist } from "@/types/tracks.types"
import { BsMusicNoteBeamed } from "react-icons/bs"

interface PlaylistCardProps {
  playlist: TrackPlaylist
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const imgSrc = playlist.image?.imgLink

  return (
    <div className="flex gap-3 items-center group cursor-pointer">
      <div className="w-12 h-12 relative shrink-0 overflow-hidden rounded bg-white-smoke/10">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={playlist.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BsMusicNoteBeamed className="text-gray-500 text-lg" />
          </div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <p className="text-sm text-gray-400 truncate">
          {playlist.artistId?.displayName ?? ""}
        </p>
        <p className="text-sm font-bold text-white-smoke truncate">
          {playlist.title}
        </p>
      </div>
    </div>
  )
}