"use client";

import { usePathname } from "next/navigation";
import TabsNavbar from "@/components/layout/navbar/TabsNavbar";
import LibraryGuard from "./LibraryGuard";

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <LibraryGuard>
      <div className="px-4 sm:px-0">
        <TabsNavbar
          pathname={pathname}
          className="pb-4 text-sm sm:text-xl overflow-x-auto tabs-scrollable"
          tabs={[
            { href: "/library", label: "Overview" },
            { href: "/library/likes", label: "Likes" },
            { href: "/library/playlists", label: "Playlists" },
            { href: "/library/following", label: "Following" },
            { href: "/library/history", label: "History" },
          ]}
        />
        {children}
      </div>
    </LibraryGuard>
  );
}
