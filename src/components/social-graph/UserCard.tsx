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
        <Link href={`/profile/${user.userId}`} className="w-full">
          <img
            src={user.profileImgLink ?? "/testp1.jpeg"}
            alt="User"
            className="w-full aspect-square rounded-full object-cover"
          />
        </Link>
        <Link href={`/profile/${user.userId}`}>
          <div className="text-xs sm:text-sm font-bold hover:text-silver text-center truncate max-w-full">
            {user.displayName}
          </div>
        </Link>
        <Link
          href={`/profile/${user.userId}/followers`}
          className="flex items-center gap-1 hover:opacity-50 transition-opacity duration-100 ease-in-out"
        >
          <FaUser className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-silver shrink-0" />
          <span className="text-[10px] sm:text-xs text-silver truncate">
            {user.followersCount} followers
          </span>
        </Link>
        <div className="invisible group-hover/usercard:visible">
          <FollowButton
            userId={user.userId}
            initialIsFollowing={user.isFollowed ?? false}
            data-testid="UserCard-FollowButton"
          />
        </div>
      </div>
    </div>
  )
}

export default UserCard
