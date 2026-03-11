// default page of profile goes to all tab
"use client"
import Following from "@/components/profile/Following"
import ListLatestComments from "@/components/profile/ListLatestComments"

export default function ProfilePage() {
  return (
    <div>
      All
      <ListLatestComments />
      <Following/>
    </div>
  )
}