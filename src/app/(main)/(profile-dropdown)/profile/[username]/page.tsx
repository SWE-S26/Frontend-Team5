// default page of profile goes to all tab
"use client"
import ListLatestComments from "@/components/profile/ListLatestComments"
export default function ProfilePage() {
  return (
    <div>
      All
      <ListLatestComments />
    </div>
  )
}