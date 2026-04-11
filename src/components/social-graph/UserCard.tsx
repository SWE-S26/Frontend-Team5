'use client'
import { FaUser } from "react-icons/fa"
import FollowButton from "../ui/FollowButton"
import { SocialUser } from "@/types/social.types"
import Link from "next/link"

interface UserCardProps {
  user: SocialUser
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="cursor-pointer group/usercard">
      <div className="flex gap-2 flex-col items-center">
        <Link href={`/profile/${user.userId}`}>
          <img
            src={user.profileImgLink ?? "/testp1.jpeg"}
            alt="User"
            className="w-50 h-50 rounded-full object-cover"
          />
        </Link>
        <Link href={`/profile/${user.userId}`}>
          <div className="text-sm font-bold hover:text-silver whitespace-nowrap">
            {user.displayName}
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <FaUser className="w-4 h-4 fill-current text-silver" />
          <span className="text-xs text-silver">{user.followersCount} followers</span>
        </div>
        <div className="invisible group-hover/usercard:visible">
          <FollowButton userId={user.userId} initialIsFollowing={false} data-testid="UserCard-FollowButton" />
        </div>
      </div>
    </div>
  )
}

export default UserCard