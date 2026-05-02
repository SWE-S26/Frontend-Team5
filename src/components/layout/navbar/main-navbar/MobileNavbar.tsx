"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import AuthModal from "@/components/auth/AuthModal";
import Button from "@/components/ui/Button";
import NavbarCenter from "./NavbarCenter";
import ProfileImage from "@/components/ui/ProfileImage";
import NotificationBell from "@/components/notifications/NotificationBell";

import { useLogout } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";

import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { GrMailOption } from "react-icons/gr";
import { FaUser, FaHeart, FaStar } from "react-icons/fa";
import { FaUserCheck, FaUserPlus } from "react-icons/fa6";
import { BiSolidCopy } from "react-icons/bi";
import { HiMiniSignal } from "react-icons/hi2";
import { PiWaveformBold } from "react-icons/pi";
import { GoHome } from "react-icons/go";
import { MdOutlineFeed, MdOutlineLibraryMusic } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

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
  const { logout, loading, success } = useLogout();

  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);
  const userId         = useAppSelector((state) => state.auth.userId);
  const displayName    = useAppSelector((state) => state.auth.displayName);
  const role           = useAppSelector((state) => state.auth.role);

  const [isMenuOpen,      setIsMenuOpen]      = useState(false);
  const [isProfileOpen,   setIsProfileOpen]   = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMessagesOpen,  setIsMessagesOpen]  = useState(false);

  const profileTarget = userId ? `/profile/${userId}` : "/home";

  const PROFILE_ITEMS = [
    { label: "Profile",        icon: <FaUser />,                 href: profileTarget        },
    { label: "Likes",          icon: <FaHeart />,                href: "/library/likes"     },
    { label: "Playlists",      icon: <BiSolidCopy />,            href: "/library/playlists" },
    { label: "Stations",       icon: <HiMiniSignal />,           href: "/library/stations"  },
    { label: "Following",      icon: <FaUserCheck />,            href: "/library/following" },
    { label: "Who to follow",  icon: <FaUserPlus />,             href: "/home"              },
    ...(role !== "Pro" ? [{ label: "Try Artist Pro", icon: <FaStar />, href: "/artist" }] : []),
    { label: "Tracks",         icon: <PiWaveformBold />,         href: "/artists"           },
  ];

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const navigate = (href: string) => {
    router.push(href);
    closeAll();
  };

  useEffect(() => {
    if (success) router.push("/");
  }, [success, router]);

  return (
    <>
      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-chinese-black flex items-center justify-between px-4 py-2 w-full gap-3">

        {/* Left — hamburger */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-white-smoke text-2xl cursor-pointer shrink-0"
        >
          <RxHamburgerMenu />
        </button>

        {/* Center — search */}
        <div className="flex-1">
          <NavbarCenter />
        </div>

        {/* Right — notifications + profile image or auth buttons */}
        {isLoggedIn ? (
          <div className="flex items-center gap-3 shrink-0">
            <NotificationBell routeOnClick/>
            <button
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="cursor-pointer"
            >
              <ProfileImage
                src={profileImgLink}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full w-8 h-8 object-cover"
              />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-white-smoke text-sm font-bold shrink-0"
          >
            Sign In
          </button>
        )}
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

      {/* Hamburger menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Profile dropdown overlay */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
      )}

      {/* Hamburger slide-in menu — LEFT side */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-chinese-black z-50 flex flex-col p-6 overflow-y-auto transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Close + Logo */}
        <div className="flex items-center justify-between mb-6">
          <Link href={isLoggedIn ? "/home" : "/"} onClick={() => setIsMenuOpen(false)}>
            <Image src="/app-logo/beatza.png" alt="BeatZa" width={40} height={40} />
          </Link>
          <button onClick={() => setIsMenuOpen(false)} className="text-white-smoke text-3xl cursor-pointer">
            <IoCloseOutline />
          </button>
        </div>

        {isLoggedIn ? (
          <>
            {/* Notifications + Messages */}
            <button onClick={() => navigate("/message")} className={MENU_LINK_CLASS}>
              <GrMailOption className="text-silver text-lg" />
              Messages
            </button>

            <div className="w-full h-px bg-off-black mb-2" />

            {role !== "Pro" && (
              <button onClick={() => navigate("/artist")} className={`${MENU_LINK_CLASS} text-anger`}>
                <FaStar className="text-anger" />
                Try Artist Pro
              </button>
            )}
            <button onClick={() => navigate("/artists")}  className={MENU_LINK_CLASS}>Artist Studio</button>
            <button onClick={() => navigate("/upload")}   className={MENU_LINK_CLASS}>Upload</button>
            <button onClick={() => navigate("/settings")} className={MENU_LINK_CLASS}>Settings</button>
            <button onClick={() => navigate("/subscriptions")} className={MENU_LINK_CLASS}>Subscriptions</button>
            <button onClick={() => navigate("/legal")}    className={MENU_LINK_CLASS}>Legal</button>
            <button onClick={() => navigate("/copyright")} className={MENU_LINK_CLASS}>Copyright</button>
            <button onClick={() => navigate("/artists")}  className={MENU_LINK_CLASS}>About us</button>
            <button onClick={() => navigate("/need-help")} className={MENU_LINK_CLASS}>Support</button>

            <button
              onClick={() => { logout(); closeAll(); }}
              disabled={loading}
              className={`${MENU_LINK_CLASS} text-anger border-none`}
            >
              {loading ? "Signing out..." : "Sign out"}
            </button>

          </>
        ) : (
          <>
            <div className="flex flex-col gap-3 mb-6">
              <Button className="w-full py-2 bg-white-smoke text-chinese-black cursor-pointer" onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}>
                Sign In
              </Button>
              <Button className="w-full py-2 bg-off-black text-white-smoke cursor-pointer" onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }}>
                Create Account
              </Button>
            </div>

            <div className="w-full h-px bg-off-black mb-4" />

            <button onClick={() => navigate("/legal")}     className={MENU_LINK_CLASS}>Legal</button>
            <button onClick={() => navigate("/copyright")} className={MENU_LINK_CLASS}>Copyright</button>
            <button onClick={() => navigate("/artists")}   className={MENU_LINK_CLASS}>About us</button>
          </>
        )}
      </div>

      {/* Profile dropdown — slides from top right */}
      {isProfileOpen && isLoggedIn && (
        <div className="fixed top-14 right-4 z-50 w-64 bg-off-black rounded-xl shadow-lg overflow-hidden">
          {/* User info header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <ProfileImage
              src={profileImgLink}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full w-9 h-9 object-cover shrink-0"
            />
            <span className="text-white-smoke font-bold text-sm truncate">{displayName || "No Name"}</span>
          </div>

          {/* Profile items */}
          <div className="flex flex-col py-1">
            {PROFILE_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => item.href ? navigate(item.href) : closeAll()}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white-smoke hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="text-silver">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}