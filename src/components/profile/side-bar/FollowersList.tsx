    'use client'
    import { useEffect } from 'react'
    import { Avatar } from 'antd'
    import Link from 'next/link'
    import { useSelector } from 'react-redux'
    import { RootState } from '@/store/store'
    import { useGetFollowers } from '@/hooks/useSocial'
    import { useParams } from 'next/navigation'
    import ProfilePopover from '@/components/layout/track-cards/ProfilePopover'
    import { PopoverProvider } from '@/components/layout/track-cards/PopoverContext'

    export default function FollowersList() {
    const profileUserId    = useSelector((state: RootState) => state.profile.userId)
    const followersCount   = useSelector((state: RootState) => state.profile.followersCount)
    const { username }     = useParams<{ username: string }>()

    const { getFollowers, followers, loading } = useGetFollowers()

    useEffect(() => {
        if (profileUserId) {
        getFollowers(profileUserId)
        }
    }, [profileUserId])

    if (!loading && !followers?.length) return null

    // Show only first 6 followers in one line with smaller avatars
    const displayedFollowers = followers?.slice(0, 9) ?? []
    const hasMore = (followers?.length ?? 0) > 6

    return (
        <section className="flex flex-col gap-3 mb-8 mt-5">
        <div className="flex items-center justify-between">
            <Link
            href={`/profile/${profileUserId}/followers`} className="text-xs font-bold text-white-smoke">
            {followersCount} FOLLOWERS
            </Link>
            <Link
            href={`/profile/${profileUserId}/followers`}
            className="text-xs text-silver hover:underline"
            >
            View all
            </Link>
        </div>

        {loading && <p className="text-silver text-sm">Loading...</p>}

        {!loading && displayedFollowers.length > 0 && (
            <PopoverProvider>
                <div className="w-full overflow-x-auto">
                    <Avatar.Group
                        max={{ count: 9 }}
                        className="flex flex-nowrap gap-1"
                    >
                        {displayedFollowers.map(user => (
                            <ProfilePopover
                                key={user.userId}
                                id={user.userId}
                                artistName={user.displayName}
                                followCount={user.followersCount}
                                profileImgLink={user.profileImgLink ?? ''}
                                profileHref={`/profile/${user.userId}`}
                                followersHref={`/profile/${user.userId}/followers`}
                            >
                                <Avatar
                                    src={user.profileImgLink ?? undefined}
                                    size={40}
                                    style={{ cursor: 'pointer' }}
                                />
                            </ProfilePopover>
                        ))}
                    </Avatar.Group>
                </div>
            </PopoverProvider>
        )}
        </section>
    )
    }