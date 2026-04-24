"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiMail } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuSearch } from "react-icons/lu";
import { SlBell } from "react-icons/sl";
import ProfileImage from "@/components/ui/ProfileImage"

import { useLogout } from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";

type TopbarProps = {
  onMenuOpenChange?: (open: boolean) => void;
};

type ProfileMenuItem = {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  dividerBefore?: boolean;
};

export default function ArtistTopbar({ onMenuOpenChange }: TopbarProps) {
  const router = useRouter();
  const { logout, success } = useLogout();

  const userId = useAppSelector((state) => state.auth.userId);
  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth < 1024);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

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
    { label: "Tracks", action: () => router.push(userId ? `/profile/${userId}?tab=tracks` : "/artists") },
    { label: "Insights", action: () => router.push("/artists") },
    { label: "Distribute music", action: () => router.push("/artistpro") },
    { label: "Artist Membership", action: () => router.push("/artistpro"), dividerBefore: true },
    { label: "Subscriptions", action: () => router.push("/artistpro") },
    { label: "Listen ad-free", action: () => router.push("/artistpro") },
    { label: "Unlimited uploads", action: () => router.push("/artistpro") },
    { label: "Settings", action: () => router.push("/settings"), dividerBefore: true },
    { label: "Support", action: () => router.push("/need-help") },
    { label: "Sign out", action: () => logout(), dividerBefore: true },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-200 flex h-13 items-center bg-[#111]">

      {/* Right actions */}
      <div className={`flex flex-1 pt-5 pb-3 items-center justify-end ${isMobile ? "gap-1.5 px-2.5" : "gap-2 px-4"}`}>
        {/* Search */}
        <button
          type="button"
          className={`flex items-center gap-2 rounded-full border border-[#444] bg-transparent text-[18px] text-white-smoke transition-colors hover:border-[#666] cursor-pointer ${
            isMobile ? "px-2.5 py-1.5" : "px-4 py-1.5"
          }`}
          aria-label="Search"
        >
          <LuSearch className="text-[25px]" />
          {!isMobile && <span>Search</span>}
        </button>

        {/* Upload */}
        <button
          type="button"
          onClick={() => router.push("/upload")}
          className={`flex items-center gap-2 rounded-full border border-[#444] bg-transparent text-[18px] text-white-smoke transition-colors hover:border-[#666] cursor-pointer ${
            isMobile ? "px-2.5 py-1.5" : "px-4 py-1.5"
          }`}
          aria-label="Upload"
        >
          <IoCloudUploadOutline className="text-[25px]" />
          {!isMobile && <span>Upload</span>}
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => router.push("/notifications")}
          className={`rounded-full border border-[#444] bg-transparent text-[25px] text-white-smoke transition-colors hover:border-[#666] cursor-pointer ${
            isMobile ? "px-2.5 py-1.5" : "px-3 py-1.5"
          }`}
          aria-label="Notifications"
        >
          <SlBell />
        </button>

        {/* Messages */}
        <button
          type="button"
          onClick={() => router.push("/messages")}
          className={`rounded-full border border-[#444] bg-transparent text-[25px] text-white-smoke transition-colors hover:border-[#666] cursor-pointer ${
            isMobile ? "px-2.5 py-1.5" : "px-3 py-1.5"
          }`}
          aria-label="Messages"
        >
          <FiMail />
        </button>

        {/* Profile menu */}
        <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={toggleMenu}
              className="h-10 w-10 mt-1 overflow-hidden rounded-full border border-[#444] bg-transparent transition-colors hover:border-[#666] cursor-pointer"
              aria-label="Open profile menu"
            >
              {
              profileImgLink && (
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
            <div className="absolute right-0 top-10 z-300 min-w-55 overflow-hidden rounded-lg border border-[#333] bg-[#1e1e1e] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.dividerBefore && <div className="my-1 border-t border-[#2e2e2e]" />}
                  <button
                    type="button"
                    onClick={item.action}
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
    </header>
  );
}