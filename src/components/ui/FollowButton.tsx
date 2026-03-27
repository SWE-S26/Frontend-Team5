"use client"
import { useState } from "react"

interface FollowButtonProps {
    initialIsFollowing?: boolean
}

const FollowButton = ({ initialIsFollowing = false }: FollowButtonProps) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

    return (
        <button
        onClick={() => setIsFollowing(!isFollowing)}
        className={`px-3 py-0 text-sm font-bold rounded-md transition mt-2 mb-2 h-8 w-25 cursor-pointer
            ${isFollowing 
            ? "bg-off-black text-white-smoke hover:text-silver" 
            : "bg-white-smoke text-black hover:text-silver"
            }`}
        >
        {isFollowing ? "Following" : "Follow"}
        </button>
    )
    }

export default FollowButton