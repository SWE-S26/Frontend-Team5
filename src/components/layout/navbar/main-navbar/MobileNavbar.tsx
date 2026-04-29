"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import AuthModal from "@/components/auth/AuthModal";
import Button from "@/components/ui/Button";
import MiniPlayer from "@/components/layout/player/MiniPlayer";
import ViewMessages from "@/components/messages/messageSidebar/ViewMessages";
import { useLogout } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";

import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { SlBell } from "react-icons/sl";
import { GrMailOption } from "react-icons/gr";
import { FaUser, FaHeart, FaStar } from "react-icons/fa";
import { FaUserCheck, FaUserPlus } from "react-icons/fa6";
import { BiSolidCopy } from "react-icons/bi";
import { HiMiniSignal } from "react-icons/hi2";
import { PiWaveformBold } from "react-icons/pi";
import { ImStatsBars } from "react-icons/im";
import { BsArrowsExpandVertical } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { MdOutlineFeed, MdOutlineLibraryMusic, MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import ProfileImage from "@/components/ui/ProfileImage"

interface MobileNavbarProps {
  isLoggedIn: boolean;
}

const MENU_LINK_CLASS = "flex items-center gap-3 text-white-smoke font-bold py-3 border-b border-off-black hover:text-silver transition-all duration-300 cursor-pointer w-full text-left";

const BOTTOM_TABS = [
  { href: "/home",    label: "Home",    icon: <GoHome className="text-2xl" />                },
  { href: "/feed",    label: "Feed",    icon: <MdOutlineFeed className="text-2xl" />         },
  { href: "/library", label: "Library", icon: <MdOutlineLibraryMusic className="text-2xl" /> },
  { href: "/search",  label: "Search",  icon: <CiSearch className="text-2xl" />              },
];

export default function MobileNavbar({ isLoggedIn }: MobileNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, loading } = useLogout();

  // only pulling the two fields this component actually needs
  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink)
  const userId = useAppSelector((state) => state.auth.userId)
  const displayName = useAppSelector((state) => state.auth.displayName)

  const [isMenuOpen,        setIsMenuOpen]        = useState(false);
  const [isAuthModalOpen,   setIsAuthModalOpen]   = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [isMessagesOpen,    setIsMessagesOpen]    = useState(false);

  const profileTarget = userId ? `/profile/${userId}` : "/home"

  const PROFILE_ITEMS = [
    { label: "Profile",        icon: <FaUser />,                 href: profileTarget, disabled: !userId },
    { label: "Likes",          icon: <FaHeart />,                href: "/library/likes"     },
    { label: "Playlists",      icon: <BiSolidCopy />,            href: "/library/playlists" },
    { label: "Stations",       icon: <HiMiniSignal />,           href: "/library/stations"  },
    { label: "Following",      icon: <FaUserCheck />,            href: "/library/following" },
    { label: "Who to follow",  icon: <FaUserPlus />,             href: null                 },
    { label: "Try Artist Pro", icon: <FaStar />,                 href: "/artist"            },
    { label: "Tracks",         icon: <PiWaveformBold />,         href: "/artists"           },
    { label: "Insights",       icon: <ImStatsBars />,            href: null                 },
    { label: "Distribute",     icon: <BsArrowsExpandVertical />, href: "/artist"            },
  ];

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProfileExpanded(false);
  };

  const navigate = (href: string) => {
    router.push(href);
    closeMenu();
  };

  return (
    <>
      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-chinese-black flex items-center justify-between px-4 py-2 w-full">
        <Link href={isLoggedIn ? "/home" : "/"}>
          <Image src="/app-logo/beatza.png" alt="BeatZa" width={44} height={44} />
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <>
              <button className="text-silver text-xl hover:text-white-smoke transition-all duration-300 cursor-pointer">
                <SlBell />
              </button>

              <button
                className="text-silver text-xl hover:text-white-smoke transition-all duration-300 cursor-pointer relative"
                onClick={() => setIsMessagesOpen((prev) => !prev)}
              >
                <GrMailOption />
                {isMessagesOpen && (
                  <div className="absolute right-0 top-8 z-50 w-80">
                    <ViewMessages />
                  </div>
                )}
              </button>
            </>
          )}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-white-smoke text-2xl cursor-pointer"
          >
            <RxHamburgerMenu />
          </button>
        </div>
      </div>

      {/* Fixed bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-chinese-black border-t border-off-black flex items-center justify-around px-4 py-3">
        {BOTTOM_TABS.map((tab) => (
          <button
            key={tab.href}
            onClick={() => router.push(tab.href)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 cursor-pointer ${
              pathname === tab.href ? "text-white-smoke" : "text-silver"
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMenu} />
      )}

      {/* Slide-in menu */}
      <div className={`fixed top-0 right-0 h-full w-72 bg-chinese-black z-50 flex flex-col p-6 overflow-y-auto transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Close button */}
        <button onClick={closeMenu} className="self-end text-white-smoke text-3xl cursor-pointer mb-6">
          <IoCloseOutline />
        </button>

        {isLoggedIn ? (
          <>
            {/* Profile dropdown trigger */}
            <button
              onClick={() => setIsProfileExpanded((prev) => !prev)}
              className="flex items-center gap-3 w-full mb-4 cursor-pointer"
            >
              <ProfileImage src={profileImgLink} alt="Profile" width={40} height={40} className="rounded-full w-10 h-10 object-cover" />
              <span className="text-white-smoke font-bold flex-1 text-left">{displayName || "No Name"}</span>
              {isProfileExpanded
                ? <MdOutlineExpandLess className="text-silver text-xl" />
                : <MdOutlineExpandMore className="text-silver text-xl" />
              }
            </button>

            {/* Profile dropdown items */}
            {isProfileExpanded && (
              <div className="flex flex-col mb-4 pl-2 border-l-2 border-off-black">
                {PROFILE_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => item.href ? navigate(item.href) : closeMenu()}
                    className={MENU_LINK_CLASS}
                  >
                    <span className="text-silver">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <div className="w-full h-px bg-off-black mb-4" />

            <button onClick={() => navigate("/settings")}  className={MENU_LINK_CLASS}>Settings</button>
            <button onClick={() => navigate("/legal")}     className={MENU_LINK_CLASS}>Legal</button>
            <button onClick={() => navigate("/copyright")} className={MENU_LINK_CLASS}>Copyright</button>
            <button onClick={() => navigate("/artists")}   className={MENU_LINK_CLASS}>About us</button>

            <button
              onClick={() => { logout(); closeMenu(); }}
              disabled={loading}
              className={`${MENU_LINK_CLASS} text-anger border-none`}
            >
              {loading ? "Signing out..." : "Sign out"}
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-6">
              <Button className="w-full py-2 bg-white-smoke text-chinese-black cursor-pointer" onClick={() => { setIsAuthModalOpen(true); closeMenu(); }}>
                Sign In
              </Button>
              <Button className="w-full py-2 bg-off-black text-white-smoke cursor-pointer" onClick={() => { setIsAuthModalOpen(true); closeMenu(); }}>
                Create Account
              </Button>
            </div>

            <div className="w-full h-px bg-off-black mb-4" />

            <button onClick={() => navigate("/legal")}     className={MENU_LINK_CLASS}>Legal</button>
            <button onClick={() => navigate("/copyright")} className={MENU_LINK_CLASS}>Copyright</button>
            <button onClick={() => navigate("/artists")}   className={MENU_LINK_CLASS}>About us</button>
          </>
        )}

        {/* Mini player pinned to bottom */}
        {isLoggedIn && (
          <div className="mt-auto pt-4">
            <MiniPlayer />
          </div>
        )}

      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}