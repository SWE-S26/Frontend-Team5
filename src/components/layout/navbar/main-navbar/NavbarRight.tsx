"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import Button from "@/components/ui/Button";
import AuthModal from "@/components/auth/AuthModal";
import ViewMessages from "@/components/messages/ViewMessages";
import KeyboardShortcutsModal from "@/app/(main)/(more-dropdown)/keyboardShortcuts/keyboardShortcutsModal";

import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";

import { MdOutlineExpandMore } from "react-icons/md";
import { SlBell } from "react-icons/sl";
import { GrMailOption } from "react-icons/gr";
import { IoIosMore } from "react-icons/io";
import { FaUser, FaHeart, FaStar } from "react-icons/fa";
import { FaUserCheck, FaUserPlus } from "react-icons/fa6";
import { BiSolidCopy } from "react-icons/bi";
import { HiMiniSignal } from "react-icons/hi2";
import { PiWaveformBold } from "react-icons/pi";
import { ImStatsBars } from "react-icons/im";
import { BsArrowsExpandVertical } from "react-icons/bs";

interface NavbarRightProps {
  isLoggedIn: boolean;
}

const NAV_LINK_CLASS = "text-silver text-sm py-2 font-bold hover:text-white-smoke transition-all duration-300";
const ICON_BTN_CLASS = "text-silver text-xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2 cursor-pointer";

export default function NavbarRight({ isLoggedIn }: NavbarRightProps) {
  const router = useRouter();
  const { logout, loading, success } = useLogout();
  const { profileImgLink } = useAuthStore();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMessagesOpen,  setIsMessagesOpen]  = useState(false);

  useEffect(() => {
    if (success) router.push("/");
  }, [success, router]);

  const profileItems: DropdownItem[] = useMemo(() => [
    { label: "Profile",        icon: <FaUser />,                 onClick: () => router.push("/profile/1")         },
    { label: "Likes",          icon: <FaHeart />,                onClick: () => router.push("/library/likes")     },
    { label: "Playlists",      icon: <BiSolidCopy />,            onClick: () => router.push("/library/playlists") },
    { label: "Stations",       icon: <HiMiniSignal />,           onClick: () => router.push("/library/stations")  },
    { label: "Following",      icon: <FaUserCheck />,            onClick: () => router.push("/library/following") },
    { label: "Who to follow",  icon: <FaUserPlus />,             onClick: () => console.log("done")               },
    { label: "Try Artist Pro", icon: <FaStar />,                 onClick: () => router.push("/artistpro")         },
    { label: "Tracks",         icon: <PiWaveformBold />,         onClick: () => router.push("/artists")           },
    { label: "Insights",       icon: <ImStatsBars />,            onClick: () => console.log("done")               },
    { label: "Distribute",     icon: <BsArrowsExpandVertical />, onClick: () => router.push("/artistpro")         },
  ], [router]);

  const moreItems: DropdownItem[] = useMemo(() => [
    { label: "About us",           onClick: () => console.log("done")          },
    { label: "Legal",              onClick: () => router.push("/legal")         },
    { label: "Copyright",          onClick: () => router.push("/copyright")     },
    { type: "separator" },
    { label: "Mobile apps",        onClick: () => console.log("done")          },
    { label: "Artist Membership",  onClick: () => console.log("done")          },
    { label: "Newsroom",           onClick: () => console.log("done")          },
    { label: "Jobs",               onClick: () => console.log("done")          },
    { label: "Developers",         onClick: () => console.log("done")          },
    { label: "SoundCloud Store",   onClick: () => console.log("done")          },
    { type: "separator" },
    { label: "Support",            onClick: () => console.log("done")          },
    { label: "Keyboard shortcuts", onClick: () => setIsShortcutsOpen(true)     },
    { type: "separator" },
    ...(isLoggedIn ? [
      { label: "Subscription", onClick: () => console.log("done")              },
      { label: "Settings",     onClick: () => router.push("/settings")         },
      { label: "Sign out",     onClick: () => logout(), disabled: loading      },
    ] : [
      { label: "Pro Plans",    onClick: () => console.log("done")              },
    ]),
  ], [isLoggedIn, loading, router]);

  return (
    <div className="flex items-center gap-5.5 ml-5 mb-1">
      {isLoggedIn ? (
        <>
          <Link data-testid="try_artist_pro" href="/artistpro" className="text-anger text-sm py-2 font-bold hover:text-white-smoke transition-all duration-300">
            Try Artist Pro
          </Link>
          <Link data-testid="for_artists" href="/artists" className={NAV_LINK_CLASS}>
            For Artists
          </Link>
          <Link data-testid="upload" href="/upload" className={NAV_LINK_CLASS}>
            Upload
          </Link>

          <Dropdown testId="profile_dropdown" width="w-40" position="left-0"
            trigger={
              <button data-testid="profile_button" className="text-silver font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2 text-4xl cursor-pointer">
                <Image
                  src={profileImgLink || "/profpic.jpg"}
                  alt="Profile"
                  width={26}
                  height={26}
                  className="rounded-full w-6.5 h-6.5 object-cover"
                />
                <MdOutlineExpandMore />
              </button>
            }
            items={profileItems}
          />

          <button data-testid="notifications" className={ICON_BTN_CLASS}>
            <SlBell />
          </button>

          <button data-testid="messages" className={ICON_BTN_CLASS} onClick={() => setIsMessagesOpen((prev) => !prev)}>
            <div className="relative">
              <GrMailOption />
              {isMessagesOpen && (
                <div className="absolute right-0 top-8 z-15 w-100">
                  <ViewMessages />
                </div>
              )}
            </div>
          </button>
        </>
      ) : (
        <>
          <Button className="px-3 py-2 bg-chinese-black text-white-smoke cursor-pointer" onClick={() => setIsAuthModalOpen(true)}>
            Sign In
          </Button>
          <Button className="px-3 py-2 bg-white-smoke text-chinese-black cursor-pointer" onClick={() => setIsAuthModalOpen(true)}>
            Create Account
          </Button>
          <Link href="/upload" className={NAV_LINK_CLASS}>
            Upload
          </Link>
        </>
      )}

      <Dropdown testId="more_dropdown" width="w-43" position="right-0"
        trigger={
          <button data-testid="more_button" className="text-silver text-2xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2 cursor-pointer">
            <IoIosMore />
          </button>
        }
        items={moreItems}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </div>
  );
}