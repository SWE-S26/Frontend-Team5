'use client'
import Following from "@/components/profile/side-bar/Following"
import OnTourSection from "./OnTourSection"
import ProfileStats from "./ProfileStats"
import ListLatestComments from "./ListLatestComments"



const ProfileSideBar = () => {
  return (
    <div className="w-full">
        <div className="w-full flex flex-col items-center mb-7 py-2">
            <div><ProfileStats /></div>
            <div><OnTourSection /></div>
            <div><Following /></div>
            <div><ListLatestComments /></div>
        </div>
        
    </div>
  )
}

export default ProfileSideBar