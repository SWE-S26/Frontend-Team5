"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FiMail } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { SlBell } from "react-icons/sl";
import ProfileImage from "@/components/ui/ProfileImage";

import { useLogout } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";

type TopbarProps = {
  onMenuOpenChange?: (open: boolean) => void;
  onSidebarToggle?: () => void;
};

type ProfileMenuItem = {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  dividerBefore?: boolean;
};

export default function ArtistTopbar({ onMenuOpenChange, onSidebarToggle }: TopbarProps) {
  const router = useRouter();
  const { logout, success } = useLogout();

  const userId = useAppSelector((state) => state.auth.userId);
  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);

  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (success) router.push("/");
  }, [success, router]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) return;
      setShowUserMenu(false);
      onMenuOpenChange?.(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [onMenuOpenChange]);

  const toggleMenu = () => {
    const nextOpen = !showUserMenu;
    setShowUserMenu(nextOpen);
    onMenuOpenChange?.(nextOpen);
  };

  const menuItems: ProfileMenuItem[] = [
    { label: "Profile", action: () => router.push(userId ? `/profile/${userId}` : "/home") },
    {
      label: "Tracks",
      action: () => router.push(userId ? `/profile/${userId}?tab=tracks` : "/artists"),
    },
    { label: "Insights", action: () => router.push("/artists") },
    { label: "Distribute music", action: () => router.push("/artist") },
    { label: "Artist Membership", action: () => router.push("/artist"), dividerBefore: true },
    { label: "Subscriptions", action: () => router.push("/artist") },
    { label: "Listen ad-free", action: () => router.push("/artist") },
    { label: "Unlimited uploads", action: () => router.push("/artist") },
    { label: "Settings", action: () => router.push("/settings"), dividerBefore: true },
    { label: "Support", action: () => router.push("/need-help") },
    { label: "Sign out", action: () => logout(), dividerBefore: true },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-200 flex h-13 items-center bg-chinese-black">
      <div className="flex flex-1 items-center justify-between gap-2 px-3 pt-4 pb-3 sm:px-4 lg:justify-end lg:gap-2 lg:px-4">
        <button
          type="button"
          onClick={onSidebarToggle}
          data-testid="artist-topbar-sidebar-toggle"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white-smoke bg-transparent text-[22px] text-white-smoke transition-colors hover:border-[#666] lg:hidden cursor-pointer"
          aria-label="Open artist menu"
        >
          <HiOutlineMenuAlt2 />
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2">
          {/* Search */}
          <button
            type="button"
            data-testid="artist-topbar-search"
            className="flex items-center gap-2 rounded-full border border-white-smoke bg-transparent px-2.5 py-1.5 text-[18px] text-white-smoke transition-colors hover:border-[#666] sm:px-4 cursor-pointer"
            aria-label="Search"
          >
            <LuSearch className="text-[25px]" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {/* Upload */}
          <button
            type="button"
            onClick={() => router.push("/upload")}
            data-testid="artist-topbar-upload"
            className="flex items-center gap-2 rounded-full border border-white-smoke bg-transparent px-2.5 py-1.5 text-[18px] text-white-smoke transition-colors hover:border-[#666] sm:px-4 cursor-pointer"
            aria-label="Upload"
          >
            <IoCloudUploadOutline className="text-[25px]" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => router.push("/notifications")}
            data-testid="artist-topbar-notifications"
            className="rounded-full border border-white-smoke bg-transparent px-2.5 py-1.5 text-[25px] text-white-smoke transition-colors hover:border-[#666] sm:px-3 cursor-pointer"
            aria-label="Notifications"
          >
            <SlBell />
          </button>

          {/* Messages */}
          <button
            type="button"
            onClick={() => router.push("/messages")}
            data-testid="artist-topbar-messages"
            className="rounded-full border border-white-smoke bg-transparent px-2.5 py-1.5 text-[25px] text-white-smoke transition-colors hover:border-[#666] sm:px-3 cursor-pointer"
            aria-label="Messages"
          >
            <FiMail />
          </button>

          {/* Profile menu */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={toggleMenu}
              data-testid="artist-topbar-profile-menu"
              className="mt-1 h-10 w-10 overflow-hidden rounded-full border border-white-smoke bg-transparent transition-colors hover:border-[#666] cursor-pointer"
              aria-label="Open profile menu"
            >
              {profileImgLink && (
                <ProfileImage
                  src={profileImgLink}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="h-10 w-10 object-cover"
                />
              )}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-10 z-300 min-w-55 overflow-hidden rounded-lg border border-[#333] bg-chinese-black shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                {menuItems.map((item) => (
                  <div key={item.label}>
                    {item.dividerBefore && <div className="my-1 border-t border-[#2e2e2e]" />}
                    <button
                      type="button"
                      onClick={item.action}
                      data-testid={`artist-topbar-menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="w-full bg-transparent px-4 py-2.5 text-left text-[13px] text-white-smoke transition-colors hover:bg-[#2a2a2a] cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
