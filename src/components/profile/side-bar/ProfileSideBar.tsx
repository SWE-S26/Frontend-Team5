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





const ProfileSideBar = () => {
  const bio = useSelector((state: RootState) => state.profile.bio)
  const links = useSelector((state: RootState) => state.profile.bannerLinks)
  const supportLink  = useSelector((state: RootState) => state.profile.supportLink)
const displayName  = useSelector((state: RootState) => state.profile.displayName)
  return (
    <div className="w-full">
        <div className="w-full flex flex-col items-center mb-7 ">
            <div className="w-full"><SupportLink supportLink={supportLink} displayName={displayName} /></div>
            <div><ProfileStats /></div>
            <div className="w-full"><BioSection bio={bio} /></div>
            <div className="w-full"><SocialLinks links={links} /></div>
            <div><OnTourSection /></div>
            <div><Following /></div>
            <div><ListLatestComments /></div>
        </div>
        
    </div>
  )
}

export default ProfileSideBar