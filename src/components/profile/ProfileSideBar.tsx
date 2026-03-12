'use client'
import Following from "@/components/profile/Following"
import OnTourSection from "./OnTourSection"
import ProfileStats from "./ProfileStats"
import ListLatestComments from "./ListLatestComments"



const ProfileSideBar = () => {
  return (
    <div className="w-full">
        <div className="w-90 flex flex-col items-center  mb-7 px-2 py-2">
            <div><ProfileStats /></div>
            <div><OnTourSection /></div>
            <div><Following /></div>
            <div><ListLatestComments /></div>
        </div>
        
    </div>
  )
}

export default ProfileSideBar