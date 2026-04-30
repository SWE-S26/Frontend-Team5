'use client'
import { RootState } from '@/store/store'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import Link from 'next/link'

export default function ProfileStats() {
    const followersCount  = useSelector((state: RootState) => state.profile.followersCount)
    const followingsCount = useSelector((state: RootState) => state.profile.followedCount)
    const trackCount      = useSelector((state: RootState) => state.profile.trackCount)
    const { username }    = useParams()

    return (
        <div className="flex justify-between mb-4">
            <Link href={`/profile/${username}/followers`} className="flex flex-col gap-3 group/followers cursor-pointer">
                <p className="text-sm text-silver font-bold">Followers</p>
                <div className="relative">
                    <span className='text-2xl text-white-smoke font-bold group-hover/followers:text-silver'>{followersCount}</span>
                </div>
            </Link>

            <Link href={`/profile/${username}/following`} className="flex flex-col gap-3 group/following cursor-pointer">
                <p className="text-sm text-silver font-bold">Following</p>
                <div className="relative">
                    <span className="text-2xl text-white-smoke font-bold group-hover/following:text-silver">{followingsCount}</span>
                </div>
            </Link>

            <Link href={`/profile/${username}?tab=tracks`} className="flex flex-col gap-3 group/tracks cursor-pointer">
                <p className="text-sm text-silver font-bold">Tracks</p>
                <div className="relative">
                    <span className="text-2xl text-white-smoke font-bold group-hover/tracks:text-silver">{trackCount}</span>
                </div>
            </Link>
        </div>
    )
}