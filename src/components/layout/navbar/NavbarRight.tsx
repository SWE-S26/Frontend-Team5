"use client"
import Link from "next/link"
import Dropdown from "@/components/ui/Dropdown";
import { DropdownItem } from "@/components/ui/Dropdown"
import { useRouter } from "next/navigation"

import { MdOutlineExpandMore } from "react-icons/md";
import { SlBell } from "react-icons/sl";
import { GrMailOption } from "react-icons/gr";
import { IoIosMore } from "react-icons/io";

/* icons for profile dropdown */
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { BiSolidCopy } from "react-icons/bi";
import { HiMiniSignal } from "react-icons/hi2";
import { FaUserCheck } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { PiWaveformBold } from "react-icons/pi";
import { ImStatsBars } from "react-icons/im";
import { BsArrowsExpandVertical } from "react-icons/bs";

interface NavbarRightProps {
  isLoggedIn: boolean
}

export default function NavbarRight({ isLoggedIn }: NavbarRightProps) {
  const router = useRouter()
  return (
    <div className="flex items-center gap-7">
      {isLoggedIn ? (
        // logged in
        <>
          <Link href="/artistpro" className="text-anger text-sm py-2 font-bold hover:text-white-smoke transition-all duration-300"> Try Artist Pro </Link>
          <Link href="/artists" className="text-silver text-sm py-2 font-bold hover:text-white-smoke transition-all duration-300">   For Artists    </Link>
          <Link href="/upload" className="text-silver text-sm py-2 font-bold hover:text-white-smoke transition-all duration-300">    Upload         </Link>

          <Dropdown width="w-40" position="left-0"
            trigger={
              <button className="text-silver font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2 text-4xl">
                <img src="/profpic.jpg" className="w-8 h-8 rounded-full" />
                < MdOutlineExpandMore />
              </button>
            }
            items={[
              { label: "Profile",        icon: <FaUser />,                 onClick: () => console.log("done") },
              { label: "Likes",          icon: <FaHeart />,                onClick: () => console.log("done") },
              { label: "Playlists",      icon: <BiSolidCopy />,            onClick: () => console.log("done") },
              { label: "Stations",       icon: <HiMiniSignal />,           onClick: () => console.log("done") },
              { label: "Following",      icon: <FaUserCheck />,            onClick: () => console.log("done") },
              { label: "Who to follow",  icon: <FaUserPlus />,             onClick: () => console.log("done") },
              { label: "Try Artist Pro", icon: <FaStar />,                 onClick: () => console.log("done") },
              { label: "Tracks",         icon: <PiWaveformBold />,         onClick: () => console.log("done") },
              { label: "Insights",       icon: <ImStatsBars />,            onClick: () => console.log("done") },
              { label: "Distribute",     icon: <BsArrowsExpandVertical />, onClick: () => console.log("done") },
            ]}
          />

          <button className="text-silver text-xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2"><SlBell/></button>
          <button className="text-silver text-xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2"><GrMailOption/></button>
          
        </>
      ) : (
        // not logged in
        <>
          <button className="text-off-white font-bold hover:text-silver px-4 py-2 transition-all duration-300"> Sign In        </button>
          <button className="bg-white-smoke font-bold text-chinese-black px-3 py-1.5 rounded-md transition-all duration-300 border hover:bg-transparent hover:text-white-smoke"> Create Account </button>
          <Link href="/upload" className="text-silver py-2 font-bold hover:text-white-smoke transition-all duration-300"> Upload </Link>
        </>
      )}

      <Dropdown width="w-43" position="right-0"
        trigger={
          <button className="text-silver text-2xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2 ">
            <IoIosMore />
            </button>
          }
          items={[
            { label: "About us",           onClick: () => console.log("done") },
            { label: "Legal",              onClick: () => console.log("done") },
            { label: "Copyright",          onClick: () => console.log("done") },
            { type:  "separator" },
            { label: "Mobile apps",        onClick: () => console.log("done") },
            { label: "Artist Membership",  onClick: () => console.log("done") },
            { label: "Newsroom",           onClick: () => console.log("done") },
            { label: "Jobs",               onClick: () => console.log("done") },
            { label: "Developers",         onClick: () => console.log("done") },
            { label: "SoundCloud Store",   onClick: () => console.log("done") },
            { type:  "separator" },
            { label: "Support",            onClick: () => console.log("done") },
            { label: "Keyboard shortcuts", onClick: () => console.log("done") },
            { type:  "separator" },
            ...(isLoggedIn ? [
                  { label: "Subscription", onClick: () => console.log("done") },
                  { label: "Settings",     onClick: () => router.push("/settings") },
                  { label: "Sign out",     onClick: () => console.log("done") },
                ] : [
                  { label: "Pro Plans",    onClick: () => console.log("done") },
                ]),
          ]as DropdownItem[]}
        />

    </div>
  )
}