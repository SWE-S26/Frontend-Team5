import { LuTicket } from "react-icons/lu";
import Link from "next/link"
import InfoPopover from "@/components/settings/InfoPopover"

export default function OnTourSection() {
  return (
    <div>
      <div className="flex flex-row items-center gap-1 mb-2 border-b border-white-smoke pb-1">
        <LuTicket size={18} className="text-silver" />
        <p className="text-xs font-bold text-white-smoke tracking-widest">ON TOUR</p>
        <InfoPopover text="Add your upcoming events to SoundCloud, and fans will be able to view them here." />
      </div>
      
      <p className="text-[11px] text-white-smoke mt-2 mb-2">With an Artist Pro account, you can create ticketed live events on <span className="block"> SoundCloud, and list existing events.</span></p>

      <Link
        href="/artist"
        className="block mb-8 bg-white-smoke text-chinese-black text-sm font-bold rounded-full px-3 py-3 w-85 text-center"
      >
        UPGRADE TO ARTIST PRO
      </Link>
    </div>
  )
}