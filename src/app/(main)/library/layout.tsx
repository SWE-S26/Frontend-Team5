"use client"
import { usePathname } from "next/navigation"
import TabsNavbar from "@/components/layout/navbar/TabsNavbar"

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div>
      <TabsNavbar pathname={pathname} className="pb-4 text-xl"
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

      {children}

    </div>
  )
}