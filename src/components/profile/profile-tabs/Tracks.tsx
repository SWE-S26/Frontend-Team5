import WaveformCard from "@/components/layout/track-cards/WaveformCard"

interface Item { img: string; title: string; artist: string; trackId: string; trackUrl?: string; downloadUrl?: string; enableDirectDownload?: boolean; duration?: number; audioClipStart?: number; audioClipEnd?: number; numLikes?: number; numReposts?: number; isLikedByUser?: boolean; canEdit?: boolean; numPlays:number; numComments:number; }
interface Props { items: Item[]; isLoading?: boolean; onEditTrack?: (item: Item) => void; onAddToPlaylist?: (item: Item) => void }

export default function Tracks({ items, isLoading = false, onEditTrack, onAddToPlaylist }: Props) {
   const loadingRows = Array.from({ length: 4 })

   return (
         <>
         <div className="flex flex-col gap-12">
           {isLoading
             ? loadingRows.map((_, index) => (
                 <div key={`track-skeleton-${index}`} className="flex items-stretch animate-pulse">
                   <div className="relative w-40 aspect-square rounded bg-linear-to-br from-off-black to-crusta/70 m-1 mb-1.75" />
                   <div className="flex flex-1 flex-col ml-6 py-1">
                     <div className="h-4 w-30 rounded bg-off-black mb-2" />
                     <div className="h-4 w-45 rounded bg-off-black mb-4" />
                     <div className="h-15 w-full max-w-158 rounded bg-linear-to-r from-off-black via-[#474747] to-off-black" />
                     <div className="mt-4 flex gap-3">
                       <div className="h-8 w-13 rounded bg-off-black" />
                       <div className="h-8 w-13 rounded bg-off-black" />
                       <div className="h-8 w-8 rounded bg-off-black" />
                     </div>
                   </div>
                 </div>
               ))
             : items.map((item, index) => (
                  <WaveformCard
                   key={`${item.trackId || "track"}-${item.title || "untitled"}-${index}`}
                   img={item.img}
                   title={item.title}
                   artist={item.artist}
                   trackId={item.trackId}
                   trackUrl={item.trackUrl}
                   downloadUrl={item.downloadUrl}
                   enableDirectDownload={item.enableDirectDownload}
                   duration={item.duration}
                   audioClipStart={item.audioClipStart}
                   audioClipEnd={item.audioClipEnd}
                   likeCount={item.numLikes ?? 0}
                   repostCount={item.numReposts ?? 0}
                   isLikedByUser={item.isLikedByUser}
                   canEdit={item.canEdit}
                   onEdit={onEditTrack ? () => onEditTrack(item) : undefined}
                   onAddToPlaylist={onAddToPlaylist ? () => onAddToPlaylist(item) : undefined}
                   playsCount={item.numPlays ?? 0}
                   commentsCount={item.numComments ?? 0}
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