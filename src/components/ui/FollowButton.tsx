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
        className={`px-4 py-0.5 text-md font-bold rounded-md transition mt-3.5 mb-2
            ${isFollowing 
            ? "bg-off-black text-white hover:text-silver" 
            : "bg-white text-black hover:text-silver"
            }`}
        >
        {isFollowing ? "Following" : "Follow"}
        </button>
    )
    }

export default FollowButton