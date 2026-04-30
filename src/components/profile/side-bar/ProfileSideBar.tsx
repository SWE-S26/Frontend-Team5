'use client'
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

import Following from "@/components/profile/side-bar/Following"
import OnTourSection from "./OnTourSection"
import ProfileStats from "./ProfileStats"
import ListLatestComments from "./ListLatestComments"
import BioSection from "./BioSection"
import SocialLinks from "./SocialLinks"
import SupportLink from "./SupportLink"
import FollowersList from "./FollowersList"


export default function ProfileSideBar() {
  const bio          = useSelector((state: RootState) => state.profile.bio)
  const links        = useSelector((state: RootState) => state.profile.bannerLinks)
  const supportLink  = useSelector((state: RootState) => state.profile.supportLink)
  const displayName  = useSelector((state: RootState) => state.profile.displayName)
  const isOwnProfile = useSelector((state: RootState) => state.profile.isOwnProfile)
  const role         = useSelector((state: RootState) => state.auth.role)

  const showOnTour = isOwnProfile && role !== "Pro"

  return (
    <div className="w-full">
        <div className="w-full flex flex-col items-center mb-7 ">
            <div className="w-full"><SupportLink supportLink={supportLink} displayName={displayName} /></div>
            <div><ProfileStats /></div>
            <div className="w-full"><BioSection bio={bio} /></div>
            <div className="w-full"><SocialLinks links={links} /></div>
            {showOnTour && <div><OnTourSection /></div>}
            <div className="w-full"><FollowersList /></div>
            <div className="w-full"><Following /></div>
            <div className="w-full"><ListLatestComments /></div>
        </div>
        
    </div>
  )
}