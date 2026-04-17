"use client"

import { useRouter } from "next/navigation"




import Button from "@/components/ui/Button";
import Card from "@/components/layout/track-cards/WaveformCard"


interface Item { id: string; title: string; artist: string; img: string }
interface Props { items: Item[] }

export default function All({ items }: Props) {
  const router = useRouter()
  return (
    <>
    <h1 className="text-2xl font-bold mb-4 ">Recent</h1>
    <div className="flex flex-col gap-12">
      {items.map((item) => (
        <Card key={item.id} />
      ))}
    </div>

    <div className="flex flex-col gap-2">
    <div className="flex justify-center">
        <img src="/app-logo/whitelogo.png" alt="App Logo" className="w-12 h-8 mt-8 opacity-50" />
        
    </div>
    <p className="flex justify-center">More uploads means more listeners.</p>
    <div className="flex justify-center">
          <Button
            data-testid="upload more-button-All tab"
            className="bg-white-smoke text-chinese-black cursor-pointer w-30"
            onClick={() => router.push("/upload")}
          >
            Upload more
          </Button>
    </div>
    
    </div>

    </>
    
  )
}