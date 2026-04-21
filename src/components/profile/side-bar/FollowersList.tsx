    'use client'
    import { useEffect } from 'react'
    import { Avatar, Popover } from 'antd'
    import { BsFillPersonFill } from 'react-icons/bs'
    import Link from 'next/link'
    import { useSelector } from 'react-redux'
    import { RootState } from '@/store/store'
    import { useGetFollowers } from '@/hooks/useSocial'
    import FollowButton from '@/components/ui/FollowButton'
    import { useParams } from 'next/navigation'

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

    return (
        <section className="flex flex-col gap-3 mb-8 mt-5">
        <div className="flex items-center justify-between">
            <Link
            href={`/profile/${username}/followers`} className="text-xs font-bold text-white-smoke">
            {followersCount} FOLLOWERS
            </Link>
            <Link
            href={`/profile/${username}/followers`}
            className="text-xs text-silver hover:underline"
            >
            View all
            </Link>
        </div>

        {loading && <p className="text-silver text-sm">Loading...</p>}

        {!loading && followers && (
            <Avatar.Group>
            {followers.map(user => (
                <Popover
                key={user.userId}
                trigger="hover"
                placement="top"
                styles={{
                    root: { padding: 0 },
                    content: {
                    backgroundColor: "#111",
                    borderRadius: "8px",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                    padding: 0,
                    overflow: "hidden",
                    },
                }}
                content={
                    <div style={{ width: 200, textAlign: "center", color: "#fff", padding: "20px 16px 16px", backgroundColor: "#111" }}>
                    <Avatar
                        src={user.profileImgLink ?? undefined}
                        size={110}
                        style={{ marginBottom: 12 }}
                    />
                    <div style={{ fontWeight: 600, fontSize: 15 }}>
                        {user.displayName}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, margin: "10px 0", fontSize: 13, color: "#aaa" }}>
                        <BsFillPersonFill className="w-5 h-5" />
                        <span>{user.followersCount} followers</span>
                    </div>
                    <FollowButton userId={user.userId} initialIsFollowing={user.isFollowed} />
                    </div>
                }
                >
                <Avatar
                    src={user.profileImgLink ?? undefined}
                    size={48}
                    style={{ cursor: "pointer" }}
                />
                </Popover>
            ))}
            </Avatar.Group>
        )}
        </section>
    )
    }