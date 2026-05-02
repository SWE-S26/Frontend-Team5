"use client";

import { usePathname } from "next/navigation";
import TabsNavbar from "@/components/layout/navbar/TabsNavbar";
import LibraryGuard from "./LibraryGuard";

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <LibraryGuard>
      <div className="px-4 sm:px-6 lg:px-0">
        {/* ── Tabs — scrollable on mobile, sticky so they stay visible ── */}
        <div className="sticky top-0 z-10 bg-bg -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <TabsNavbar
            pathname={pathname}
            className="pb-3 sm:pb-4 text-sm sm:text-base lg:text-xl overflow-x-auto no-scrollbar whitespace-nowrap"
            tabs={[
              { href: "/library",           label: "Overview"  },
              { href: "/library/likes",     label: "Likes"     },
              { href: "/library/playlists", label: "Playlists" },
              { href: "/library/albums",    label: "Albums"    },
              { href: "/library/stations",  label: "Stations"  },
              { href: "/library/following", label: "Following" },
              { href: "/library/history",   label: "History"   },
            ]}
          />
        </div>

        {/* ── Page content ── */}
        <div className="pt-4 sm:pt-6">
          {children}
        </div>
      </div>
    </LibraryGuard>
  );
}
