"use client"
import { useState } from "react"
import { useFollowUser } from "@/hooks/useSocial"
import { useUnfollowUser } from "@/hooks/useSocial"
import { useAppDispatch } from '@/store/hooks'
import {decrementFollowedCount, incrementFollowedCount } from '@/store/slices/profileSlice'

interface FollowButtonProps {
    userId?:             string
    initialIsFollowing?: boolean
    onUnfollow?:         () => void
}

const FollowButton = ({ userId, initialIsFollowing = false, onUnfollow }: FollowButtonProps) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const { followUser,   loading: followLoading   } = useFollowUser()
    const { unfollowUser, loading: unfollowLoading } = useUnfollowUser()
    const isLoading = followLoading || unfollowLoading
    const dispatch = useAppDispatch()
        return (
                <button
                    onClick={async () => {
                if (!userId || isLoading) return
                if (isFollowing) {
                        const res = await unfollowUser(userId)
                        if (res) {
                            setIsFollowing(false)
                            dispatch(decrementFollowedCount())
                            onUnfollow?.()
                        }
                    } else {
                        const res = await followUser(userId)
                        if (res) {
                            setIsFollowing(true)
                            dispatch(incrementFollowedCount())
                        }
                    }
            }}
            disabled={isLoading}
        className={`px-3 py-0 text-sm font-bold rounded-md transition mt-2 mb-2 h-8 w-25 cursor-pointer
            ${isFollowing 
            ? "bg-off-black text-white-smoke hover:text-silver" 
            : "bg-white-smoke text-chinese-black hover:text-silver"
            }`}
        >
        {isFollowing ? "Following" : "Follow"}
        </button>
    )
    }

export default FollowButton