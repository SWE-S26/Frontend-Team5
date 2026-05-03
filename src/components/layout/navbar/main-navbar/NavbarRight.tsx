"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Dropdown, { DropdownItem } from "@/components/ui/MoreDropdown";
import Button from "@/components/ui/Button";
import AuthModal from "@/components/auth/AuthModal";
import ViewMessages from "@/components/messages/messageSidebar/ViewMessages";
import KeyboardShortcutsModal from "@/app/(main)/(more-dropdown)/keyboardShortcuts/keyboardShortcutsModal";
import NotificationBell from "@/components/notifications/NotificationBell";
import ProfileImage from "@/components/ui/ProfileImage";

import { useLogout } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import { useMessagesContext } from "@/components/messages/MessagesContext";

import { MdOutlineExpandMore } from "react-icons/md";
import { GrMailOption } from "react-icons/gr";
import { IoIosMore } from "react-icons/io";
import { FaUser, FaHeart, FaStar } from "react-icons/fa";
import { FaUserCheck, FaUserPlus } from "react-icons/fa6";
import { BiSolidCopy } from "react-icons/bi";
import { HiMiniSignal } from "react-icons/hi2";
import { PiWaveformBold } from "react-icons/pi";

interface NavbarRightProps {
  isLoggedIn: boolean;
}

const NAV_LINK_CLASS =
  "text-silver text-sm py-2 font-bold hover:text-white-smoke transition-all duration-300";
const ICON_BTN_CLASS =
  "text-silver text-xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2 cursor-pointer";

export default function NavbarRight({ isLoggedIn }: NavbarRightProps) {
  const router = useRouter();
  const { logout, loading, success } = useLogout();

  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);
  const userId = useAppSelector((state) => state.auth.userId);
  const role = useAppSelector((state) => state.auth.role);

  const { unreadCount } = useMessagesContext();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (messagesRef.current && !messagesRef.current.contains(e.target as Node)) {
        setIsMessagesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (success) router.push("/");
  }, [success, router]);

  const [authRedirect, setAuthRedirect] = useState("/home");
  const openAuth = (redirectTo: string) => {
    setAuthRedirect(redirectTo);
    setIsAuthModalOpen(true);
  };

  const profileTarget = userId ? `/profile/${userId}` : "/home";

  const profileItems: DropdownItem[] = useMemo(
    () => [
      {
        label: "Profile",
        icon: <FaUser />,
        href: profileTarget,
        disabled: !userId,
        testId: "profile-item-link-btn",
      },
      { label: "Likes", icon: <FaHeart />, href: "/library/likes", testId: "likes-item-link-btn" },
      {
        label: "Playlists",
        icon: <BiSolidCopy />,
        href: "/library/playlists",
        testId: "playlists-item-link-btn",
      },
      {
        label: "Stations",
        icon: <HiMiniSignal />,
        href: "/library/stations",
        testId: "stations-item-link-btn",
      },
      {
        label: "Following",
        icon: <FaUserCheck />,
        href: "/library/following",
        testId: "following-item-link-btn",
      },
      {
        label: "Who to follow",
        icon: <FaUserPlus />,
        href: "/home",
        testId: "who-to-follow-item-link-btn",
      },
      ...(role !== "Pro"
        ? [
            {
              label: "Try Artist Pro",
              icon: (
                <img
                  src="/payment/already-pro-bg-red.svg"
                  alt="Artist Pro"
                  className="w-4.5 h-4.5"
                />
              ),
              href: "/artist",
            },
          ]
        : []),
      {
        label: "Tracks",
        icon: <PiWaveformBold />,
        href: "/artists",
        testId: "tracks-item-link-btn",
      },
    ],
    [profileTarget, userId]
  );

  const moreItems: DropdownItem[] = useMemo(
    () => [
      { label: "About us", href: "/about-us", testId: "about-us-item-link-btn" },
      { label: "Legal", href: "/legal", testId: "legal-item-link-btn" },
      { label: "Copyright", href: "/copyright", testId: "copyright-item-link-btn" },
      { type: "separator" },
      { label: "Support", href: "/need-help", testId: "support-item-link-btn" },
      {
        label: "Keyboard shortcuts",
        onClick: () => setIsShortcutsOpen(true),
        testId: "keyboard-shortcuts-item-link-btn",
      },
      { type: "separator" },
      ...(isLoggedIn
        ? [
            { label: "Subscription", href: "/subscriptions", testId: "subscription-item-link-btn" },
            { label: "Settings", href: "/settings", testId: "settings-item-link-btn" },
            {
              label: "Sign out",
              onClick: () => logout(),
              disabled: loading,
              testId: "sign-out-item-link-btn",
            },
          ]
        : [{ label: "Pro Plans", href: "/artist", testId: "pro-plans-item-link-btn" }]),
    ],
    [isLoggedIn, loading, router]
  );

  return (
    <div className="flex items-center gap-5.5 ml-5 mb-1">
      {isLoggedIn ? (
        <>
          {role !== "Pro" && (
            <Link
              data-testid="try_artist_pro"
              href="/artist"
              className="text-anger text-sm py-2 font-bold hover:text-white-smoke transition-all duration-300"
            >
              Try Artist Pro
            </Link>
          )}
          <Link data-testid="for_artists" href="/artists" className={NAV_LINK_CLASS}>
            Artist Studio
          </Link>
          <Link data-testid="upload" href="/upload" className={NAV_LINK_CLASS}>
            Upload
          </Link>

          <Dropdown
            testId="profile_dropdown"
            width="w-42"
            gap="gap-2"
            trigger={
              <button
                data-testid="profile_button"
                className="text-silver font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2 text-4xl cursor-pointer"
              >
                <ProfileImage
                  src={profileImgLink}
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

          <NotificationBell />

          {/* Popup is now OUTSIDE the button — prevents click bubbling re-opening it */}
          <div className="relative" ref={messagesRef}>
            <button
              data-testid="messages"
              className={ICON_BTN_CLASS}
              onClick={() => setIsMessagesOpen((prev) => !prev)}
            >
              <div className="relative">
                <GrMailOption />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full bg-inferno text-white text-[9px] font-bold leading-none">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            </button>

            {isMessagesOpen && (
              <div className="absolute right-0 top-8 z-15 w-100">
                <ViewMessages onClose={() => setIsMessagesOpen(false)} />
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Button
            className="px-3 py-2 bg-chinese-black text-white-smoke cursor-pointer"
            onClick={() => openAuth("/home")}
          >
            Sign In
          </Button>
          <Button
            className="px-3 py-2 bg-white-smoke text-chinese-black cursor-pointer"
            onClick={() => openAuth("/home")}
          >
            Create Account
          </Button>
          <Button
            className="px-3 py-2 bg-chinese-black text-white-smoke cursor-pointer"
            onClick={() => openAuth("/upload")}
          >
            Upload
          </Button>
        </>
      )}

      <Dropdown
        testId="more_dropdown"
        width="w-44"
        trigger={
          <button
            data-testid="more_button"
            className="text-silver text-2xl font-bold hover:text-white-smoke transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <IoIosMore />
          </button>
        }
        items={moreItems}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectTo={authRedirect}
      />
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </div>
  );
}
