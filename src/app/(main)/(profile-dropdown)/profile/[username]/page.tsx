"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { useAppSelector, useAppDispatch } from "@/store/hooks"

import ProfileHeader from "@/components/profile/profile-header/ProfileHeader"
import ProfileSideBar from "@/components/profile/side-bar/ProfileSideBar"
import NewMessagePopUP from "@/components/messages/NewMessagePopUP"

import { LuShare } from "react-icons/lu"
import { MdOutlineEdit } from "react-icons/md"
import { BsThreeDots } from "react-icons/bs"
import { IoRadio } from "react-icons/io5"
import { FaRegEnvelope } from "react-icons/fa6"

import SharePopup from "@/components/profile/SharePopUp"
import ProfileEditForm from "@/components/profile/ProfileEditForm"

import TabsNavbar from "@/components/layout/navbar/TabsNavbar"
import EmptyTab from "@/components/profile/profile-tabs/EmptyTab"
import All from "@/components/profile/profile-tabs/All"
import PopularTracks from "@/components/profile/profile-tabs/PopularTracks"
import Tracks from "@/components/profile/profile-tabs/Tracks"
import Albums from "@/components/profile/profile-tabs/Albums"
import Playlists from "@/components/profile/profile-tabs/Playlists"
import Reposts from "@/components/profile/profile-tabs/Reposts"

interface Props {
  params: { username: string }
}

const profileTabs = [
  { href: "", label: "All",            value: "all"            },
  { href: "", label: "Popular tracks", value: "popular-tracks" },
  { href: "", label: "Tracks",         value: "tracks"         },
  { href: "", label: "Albums",         value: "albums"         },
  { href: "", label: "Playlists",      value: "playlists"      },
  { href: "", label: "Reposts",        value: "reposts"        },
]

// ── Mock data — replace each array with real API data when ready ──
const mockAll = [
  { id: "1", title: "Track One",   artist: "Artist A", img: "/Graduation.jpg" },
  { id: "2", title: "Track Two",   artist: "Artist B", img: "/Graduation.jpg" },
  { id: "3", title: "Track Three", artist: "Artist C", img: "/Graduation.jpg" },
]

const mockPopular = [
  { id: "1", title: "Popular One",   artist: "Artist A", img: "/Graduation.jpg" },
  { id: "2", title: "Popular Two",   artist: "Artist B", img: "/Graduation.jpg" },
]

const mockTracks = [
  { id: "1", title: "My Track One",   artist: "Artist A", img: "/Graduation.jpg" },
  { id: "2", title: "My Track Two",   artist: "Artist B", img: "/Graduation.jpg" },
  { id: "3", title: "My Track Three", artist: "Artist C", img: "/Graduation.jpg" },
]

const mockAlbums = [
  { id: "1", title: "Album One",   artist: "Artist A", img: "/Graduation.jpg" },
  { id: "2", title: "Album Two",   artist: "Artist B", img: "/Graduation.jpg" },
]

const mockPlaylists: any[] = [] // ← empty to test EmptyTab, add items when API is ready

const mockReposts: any[] = []   // ← empty to test EmptyTab, add items when API is ready
// ─────────────────────────────────────────────────────────────────

const ProfilePage = ({ params }: Props) => {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const activeTab    = searchParams.get("tab") ?? "all"

  const [openEdit,    setOpenEdit]    = useState(false)
  const [openShare,   setOpenShare]   = useState(false)
  const [openMessage, setOpenMessage] = useState(false)
  const [following,   setFollowing]   = useState(false)

  const isLoading = useAppSelector((state) => state.profile.isLoading)
  const isOwn     = useAppSelector((state) => state.profile.isOwnProfile)
  
  const role = useAppSelector((state) => state.profile.role)

  const artist = role === "Artist"

   
  

  const handleTabChange = (tab: string) => {
    const current = new URLSearchParams(searchParams.toString())
    current.set("tab", tab)
    router.push(`?${current.toString()}`, { scroll: false })
  }

  return (
    <div>
      <ProfileHeader />

      <div className="flex items-center justify-between mb-4">
        <TabsNavbar
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          textSize="text-md"
          className="flex items-center justify-between text-white py-6 px-1"
          tabsWrapperClassName="flex space-x-6"
        />

        <div className="flex space-x-2">
          {!isLoading && (
            <>
              {isOwn ? (
                <>
                  <button
                    onClick={() => setOpenShare(!openShare)}
                    className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center px-4 py-1 cursor-pointer hover:text-silver h-10"
                  >
                    <LuShare className="w-4 h-4" />
                    <span className="ml-1 text-sm font-bold px-1">Share</span>
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                      Share
                    </span>
                  </button>
                  <SharePopup isOpen={openShare} onClose={() => setOpenShare(false)} />

                  <button
                    onClick={() => setOpenEdit(true)}
                    className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center cursor-pointer hover:text-silver h-10"
                  >
                    <MdOutlineEdit className="w-5 h-5" />
                    <span className="ml-1 text-sm font-bold px-1">Edit</span>
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                      Edit
                    </span>
                  </button>
                  <ProfileEditForm isOpen={openEdit} onClose={() => setOpenEdit(false)} />
                </>
              ) : (
                
                <>
                
                  {artist && (
                    <button className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center cursor-pointer hover:text-silver h-10">
                      <IoRadio className="w-5 h-5" />
                      <span className="ml-1 text-sm font-bold px-1">Station</span>
                    </button>
                  )}
                   
                  <button
                    onClick={() => setFollowing(!following)}
                    className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center px-4 py-1 cursor-pointer hover:text-silver h-10"
                  >
                    {following ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <circle cx="10" cy="7.5" r="3.5" />
                        <path d="M2 20h16c0-4.4-3.6-8-8-8s-8 3.6-8 8z" />
                        <path d="M16 9l2.5 2.5 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <circle cx="10" cy="7.5" r="3.5" />
                        <path d="M2 20h16c0-4.4-3.6-8-8-8s-8 3.6-8 8z" />
                        <path d="M19 8v2.5h2.5v1.5H19v2.5h-1.5V12h-2.5v-1.5h2.5V8H19z" />
                      </svg>
                    )}
                    <span className="ml-1 text-sm font-bold px-1">
                      {following ? "Following" : "Follow"}
                    </span>
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                      {following ? "Unfollow" : "Follow"}
                    </span>
                  </button>

                  <button
                    onClick={() => setOpenShare(!openShare)}
                    className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center px-4 py-1 cursor-pointer hover:text-silver h-10"
                  >
                    <LuShare className="w-4 h-4" />
                    <span className="ml-1 text-sm font-bold px-1">Share</span>
                    <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-[#2C2C2C] text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-lg z-50">
                      Share
                    </span>
                  </button>
                  <SharePopup isOpen={openShare} onClose={() => setOpenShare(false)} />

                  <button
                    onClick={() => setOpenMessage(!openMessage)}
                    className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center px-4 py-1 cursor-pointer hover:text-silver h-10"
                  >
                    <FaRegEnvelope className="w-4 h-4" />
                  </button>
                  <NewMessagePopUP isOpen={openMessage} onClose={() => setOpenMessage(false)} />

                  <button className="relative group p-2 rounded-md bg-[#1F1F1F] transition flex items-center justify-center px-4 py-1 cursor-pointer hover:text-silver h-10">
                    <BsThreeDots className="w-4 h-4" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <div className="w-[68%]">
          <div className="mt-10">

            {activeTab === "all" && (
              mockAll.length === 0 ? <EmptyTab /> : <All items={mockAll} />
            )}

            {activeTab === "popular-tracks" && (
              mockPopular.length === 0 ? <EmptyTab /> : <PopularTracks items={mockPopular} />
            )}

            {activeTab === "tracks" && (
              mockTracks.length === 0 ? <EmptyTab /> : <Tracks items={mockTracks} />
            )}

            {activeTab === "albums" && (
              mockAlbums.length === 0 ? <EmptyTab /> : <Albums items={mockAlbums} />
            )}

            {activeTab === "playlists" && (
              mockPlaylists.length === 0 ? (
                <h2 className="font-bold text-lg flex items-center justify-center text-center">
                  You haven't created any playlists.
                </h2>
              ) : (
                <Playlists items={mockPlaylists} />
              )
            )}

            {activeTab === "reposts" && (
              mockReposts.length === 0 ? (
                <h2 className="font-bold text-lg flex items-center justify-center text-center">
                  You haven't reposted any sounds.
                </h2>
              ) : (
                <Reposts items={mockReposts} />
              )
            )}

          </div>
        </div>

        <div className="w-[27.75%]">
          <ProfileSideBar />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage