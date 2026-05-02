'use client'
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

import Following from "@/components/profile/side-bar/Following"
import OnTourSection from "./OnTourSection"
import ProfileStats from "./ProfileStats"
import SidebarFooter from "@/components/ui/SidebarFooter";
import BioSection from "./BioSection"
import SocialLinks from "./SocialLinks"
import SupportLink from "./SupportLink"
import FollowersList from "./FollowersList"
import LikedTracksWidget from "@/components/home/LikedTracksWidget"
import GoMobile from "@/components/layout/GoMobile"

export default function ProfileSideBar() {
  const bio          = useSelector((state: RootState) => state.profile.bio)
  const links        = useSelector((state: RootState) => state.profile.bannerLinks)
  const supportLink  = useSelector((state: RootState) => state.profile.supportLink)
  const displayName  = useSelector((state: RootState) => state.profile.displayName)
  const isOwnProfile = useSelector((state: RootState) => state.profile.isOwnProfile)
  const role         = useSelector((state: RootState) => state.auth.role)
  const profileUserId = useSelector((state: RootState) => state.profile.userId);

  const showOnTour = isOwnProfile && role !== "Pro"

  return (
    <div className="w-full">
        <div className="w-full flex flex-col mb-7 gap-3 ">
            <div className="w-full"><SupportLink supportLink={supportLink} displayName={displayName} /></div>
            <div className="w-full"><ProfileStats /></div>
            <div className="w-full"><BioSection bio={bio} /></div>
            <div className="w-full"><SocialLinks links={links} /></div>
            <div className="w-full"><LikedTracksWidget userId={profileUserId} /></div>
            {showOnTour && <div><OnTourSection /></div>}
            <div className="w-full"><FollowersList /></div>
            <div className="w-full"><Following /></div>
            <SidebarFooter />
        </div>
        
    </div>
  )
}