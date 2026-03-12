"use client"
import { usePathname, useParams } from "next/navigation"
import TabsNavbar from "@/components/layout/navbar/TabsNavbar"
import ProfileHeader from "@/components/profile/ProfileHeader"
import { LuShare } from "react-icons/lu"
import { MdOutlineEdit } from "react-icons/md"
import ProfileSideBar from "@/components/profile/ProfileSideBar"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { username } = useParams()

  return (
    <div>
      <ProfileHeader />
      <div className="flex items-center justify-between">
        <TabsNavbar pathname={pathname} className="py-4"
          tabs={[
            { href: `/profile/${username}`,                label: "All"            },
            { href: `/profile/${username}/popular-tracks`, label: "Popular tracks" },
            { href: `/profile/${username}/tracks`,         label: "Tracks"         },
            { href: `/profile/${username}/albums`,         label: "Albums"         },
            { href: `/profile/${username}/playlists`,      label: "Playlists"      },
            { href: `/profile/${username}/reposts`,        label: "Reposts"        },
          ]}
        />
        <div className="flex space-x-2">
          <button className="relative group flex items-center gap-1 px-4 py-2 rounded-md bg-off-black text-white-smoke hover:text-silver transition-all duration-300 cursor-pointer">
            <LuShare className="w-4 h-4" />
            <span className="text-sm font-bold">Share</span>
          </button>
          <button className="relative group flex items-center gap-1 px-4 py-1 rounded-md bg-off-black text-white-smoke hover:text-silver transition-all duration-300 cursor-pointer">
            <MdOutlineEdit className="w-5 h-5" />
            <span className="text-sm font-bold">Edit</span>
          </button>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="flex flex-row">
        <div className="flex-1">
          {children}
        </div>
        <div className="sticky top-0 h-screen w-90 max-w-sm ">
          <ProfileSideBar />
        </div>
      </div>

    </div>
  )
}