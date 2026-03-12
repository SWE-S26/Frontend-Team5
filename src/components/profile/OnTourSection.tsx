import { LuTicket } from "react-icons/lu";
import { IoInformationCircleOutline } from "react-icons/io5";
import UpgradeProButton from "./UpgradeProButton"

export default function OnTourSection() {
  return (
    <div>
      <div className="flex flex-row items-center gap-1 mb-2">
        <LuTicket size={18} className="text-silver" />
        <p className="text-xs font-bold text-white tracking-widest">ON TOUR</p>
        <div className="cursor-pointer relative">
          <IoInformationCircleOutline size={16} className="text-silver peer"/>
        <div className="absolute top-6 left-1/2 -translate-x-1/3 w-60 bg-white text-black text-sm p-3 opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-10 px-4 py-4">
        <div className="absolute -top-2 left-18 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"/>
                Add your upcoming events to SoundCloud, and fans will be able to view them here.
        </div>
        </div>
      </div>
      <hr className="w-85 border-white"></hr>
      <p className="text-[11px] text-white mt-2 mb-2">With an Artist Pro account, you can create ticketed live events on <span className="block"> SoundCloud, and list existing events.</span></p>
      <UpgradeProButton/>
    </div>
  )
}