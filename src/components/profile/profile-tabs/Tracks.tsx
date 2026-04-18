import Card from "@/components/layout/track-cards/WaveformCard"


interface Item { img: string; title: string; artist: string; trackId: string; trackUrl?: string }
interface Props { items: Item[]; isLoading?: boolean }

export default function Tracks({ items, isLoading = false }: Props) {
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
                 <Card
                   key={`${item.trackId || "track"}-${item.title || "untitled"}-${index}`}
                   trackId={item.trackId}
                   title={item.title}
                   artist={item.artist}
                   img={item.img}
                   trackUrl={item.trackUrl}
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