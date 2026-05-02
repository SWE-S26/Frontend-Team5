import WaveformCard from "@/components/layout/track-cards/WaveformCard"

interface Item { id: string; trackId?: string; title: string; artist: string; artistId?: string; img: string; trackUrl?: string; downloadUrl?: string; enableDirectDownload?: boolean; duration?: number; numLikes?: number; numReposts?: number; isLikedByUser?: boolean; isRepostedByUser?: boolean; canEdit?: boolean; numPlays:number; numComments:number; permalink?: string; isAvailableForUser?: boolean; }
interface Props { items: Item[]; profileLink?: string | null; onEditTrack?: (item: Item) => void; onAddToPlaylist?: (item: Item) => void }

export default function PopularTracks({ items, profileLink, onEditTrack, onAddToPlaylist }: Props) {
 return (
     <>
     <div className="flex flex-col gap-12">
       {items.map((item) => (
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
       ))}
     </div>
     
     <div className="flex justify-center">
      <img src="/app-logo/whitelogo.png" alt="App Logo" className="w-12 logo-dark h-8 mt-8 opacity-50" />
      <img src="/app-logo/blacklogo.png" alt="App Logo" className="w-12 logo-light h-8 mt-8 opacity-50" />
     </div>
     </>
     
   )
}