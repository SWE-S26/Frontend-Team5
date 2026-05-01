"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Users, Music, Flag, LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useAuth";

const navItems = [
  { href: "/admin-dash/profiles-manage", icon: Users, label: "Profiles" },
  { href: "/admin-dash/tracks-manage", icon: Music, label: "Tracks" },
  { href: "/admin-dash/reports-manage", icon: Flag, label: "Reports" },
];

export default function SideNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, loading, success } = useLogout();

  useEffect(() => {
    if (success) router.push("/");
  }, [success, router]);

  return (
    <aside className="fixed left-0 top-0 h-full w-16 bg-off-black flex flex-col items-center py-4 gap-2 z-50 border-r border-white/5">
      <Link href="/admin-dash" title="Admin Dashboard" className="mb-4">
        <Image src="/app-logo/beatza.png" alt="BeatZa" width={40} height={40} />
      </Link>

      <div className="w-8 border-t border-white/10 mb-2" />

      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all group relative ${
              isActive
                ? "bg-brilliant-orange text-white"
                : "text-silver hover:text-white-smoke hover:bg-white/10"
            }`}
          >
            <Icon size={20} />
            <span className="absolute left-14 bg-off-black text-white-smoke text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
              {label}
            </span>
          </Link>
        );
      })}

      {/* Logout pinned to bottom */}
      <div className="mt-auto">
        <button
          title="Logout"
          onClick={() => logout()}
          disabled={loading}
          className="flex items-center justify-center w-10 h-10 rounded-lg transition-all group relative text-silver hover:text-anger hover:bg-anger/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <LogOut size={20} />
          <span className="absolute left-14 bg-off-black text-white-smoke text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}