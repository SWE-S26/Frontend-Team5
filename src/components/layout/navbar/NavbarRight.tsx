"use client";
import Link from "next/link";
import Dropdown from "@/components/ui/Dropdown";
import AuthModal from "@/components/auth/AuthModal";
import ViewMessages from "@/components/messages/ViewMessages"



import KeyboardShortcutsModal from "@/app/(main)/(more-dropdown)/keyboardShortcuts/keyboardShortcutsModal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DropdownItem } from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button"

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
  isLoggedIn: boolean;
}

export default function NavbarRight({ isLoggedIn }: NavbarRightProps) {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false)
  return (
    <div className="flex items-center gap-[22px] ml-5 mb-1">
      {isLoggedIn ? (
        // logged in
        <>
          <Link
            href="/artistpro"
            className="text-anger text-sm py-2 font-bold hover:text-white-smoke transition-all duration-300"
          >
            {" "}
            Try Artist Pro{" "}
          </Link>
          <Link
            href="/artists"
            className="text-silver text-sm py-2 font-bold hover:text-white-smoke transition-all duration-300"
          >
            {" "}
            For Artists{" "}
          </Link>
          <Link
            href="/upload"
            className="text-silver text-sm py-2 font-bold hover:text-white-smoke transition-all duration-300"
          >
            {" "}
            Upload{" "}
          </Link>

          <Dropdown
            width="w-40"
            position="left-0"
            trigger={
              <button className="text-silver font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2 text-4xl">
                <img src="/profpic.jpg" className="aspect-square h-6.5 rounded-full" />
                <MdOutlineExpandMore />
              </button>
            }
            items={[
              { label: "Profile",        icon: <FaUser />,                 onClick: () => router.push("/profile/1") },
              { label: "Likes",          icon: <FaHeart />,                onClick: () => router.push("/library/likes") },
              { label: "Playlists",      icon: <BiSolidCopy />,            onClick: () => router.push("/library/playlists") },
              { label: "Stations",       icon: <HiMiniSignal />,           onClick: () => router.push("/library/stations") },
              { label: "Following",      icon: <FaUserCheck />,            onClick: () => router.push("/library/following") },
              { label: "Who to follow",  icon: <FaUserPlus />,             onClick: () => console.log("done") },
              { label: "Try Artist Pro", icon: <FaStar />,                 onClick: () => router.push("/artistpro") },
              { label: "Tracks",         icon: <PiWaveformBold />,         onClick: () => router.push("/artists") },
              { label: "Insights",       icon: <ImStatsBars />,            onClick: () => console.log("done") },
              { label: "Distribute",     icon: <BsArrowsExpandVertical />, onClick: () => router.push("/artistpro") },
            ]}
          />

          <button className="text-silver text-xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2">
            <SlBell />
          </button>
          
          <button className="text-silver text-xl  hover:text-white-smoke transition-all duration-300 flex items-center gap-2">
            <div className="relative">
          <button 
            className="text-silver text-xl  hover:text-white-smoke transition-all duration-300 flex items-center gap-2"
            onClick={() => setIsMessagesOpen((prev) => !prev)}
          >
            <GrMailOption />
          </button>

          {isMessagesOpen && (
            <div className="absolute right-0 top-8 z-15 w-100">
              <ViewMessages />
            </div>
            )}
        </div>
          </button>
        </>
      ) : (
        // not logged in
        <>
          <Button className="bg-chinese-black text-white-smoke" onClick={() => setIsAuthModalOpen(true)}>
            Sign In
          </Button>

          <Button className="bg-white-smoke text-chinese-black" onClick={() => setIsAuthModalOpen(true)}>
            Create Account
          </Button>

          <Link href="/upload" className="text-silver py-2 font-bold hover:text-white-smoke transition-all duration-300">
            Upload
          </Link>
        </>
      )}

      <Dropdown
        width="w-43"
        position="right-0"
        trigger={
          <button className="text-silver text-2xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2 cursor-pointer">
            <IoIosMore />
          </button>
        }
        items={
          [
            { label: "About us"          , onClick: () => console.log("done")       },
            { label: "Legal"             , onClick: () => router.push("/legal")     },
            { label: "Copyright"         , onClick: () => router.push("/copyright") },
            { type: "separator"                                                     },
            { label: "Mobile apps"       , onClick: () => console.log("done")       },
            { label: "Artist Membership" , onClick: () => console.log("done")       },
            { label: "Newsroom"          , onClick: () => console.log("done")       },
            { label: "Jobs"              , onClick: () => console.log("done")       },
            { label: "Developers"        , onClick: () => console.log("done")       },
            { label: "SoundCloud Store"  , onClick: () => console.log("done")       },
            { type: "separator"                                                     },
            { label: "Support"           , onClick: () => console.log("done")       },
            { label: "Keyboard shortcuts", onClick: () => setIsShortcutsOpen(true)  },
            { type: "separator"                                                     },
            ...(isLoggedIn
              ? [
                  { label: "Subscription", onClick: () => console.log("done")      },
                  {label: "Settings"     , onClick: () => router.push("/settings"),},
                  { label: "Sign out"    , onClick: () => console.log("done")      },
                ]
              : [{ label: "Pro Plans"    , onClick: () => console.log("done") }]),
          ] as DropdownItem[]
        }
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
