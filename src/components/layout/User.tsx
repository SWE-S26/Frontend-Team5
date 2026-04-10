    import Link from 'next/link'
    import { FaUser } from "react-icons/fa"
    import { PiWaveformBold } from "react-icons/pi"
    import FollowButton from '../ui/FollowButton'
    import { SocialUser } from '@/types/social.types'

    interface UserProps {
    user: SocialUser
    onUnfollow?: (userId: string) => void
    }

    const User = ({ user, onUnfollow }: UserProps) => {
    return (
        <>
        <div className='flex justify-between gap-10 mb-3 hover:cursor-pointer'>
            <div className='flex gap-4 min-w-0 flex-1'>
                <Link href={`/profile/${user.userId}`} className='rounded-full w-12 h-12 mt-2.5 object-cover shrink-0'>
                    <img src={user.profileImgLink ?? "https://i.pravatar.cc/40"} alt="User Profile" className="rounded-full w-12 h-12  object-cover shrink-0" />
                </Link>
                <div className='flex flex-col gap-1.5 min-w-0'>
                    <div className='flex gap-1.5 items-center pt-2 mt-1'>
                        <Link href={`/profile/${user.userId}`} >
                            <p className='text-sm font-bold hover:text-silver whitespace-nowrap overflow-hidden'>{user.displayName}</p>
                        </Link>
                    </div>
                    <div className='flex gap-2.5'>
                        <Link href={`/profile/${user.userId}/followers`} className="flex items-center gap-0.5 group">
                            <FaUser className="w-4 h-4 fill-current text-silver group-hover:text-off-black" />
                            <span className="text-sm text-silver group-hover:text-off-black">{user.followersCount}</span>
                        </Link>
                        <div className="flex items-center gap-0.5 group">
                            <PiWaveformBold className="w-5 h-5 fill-current text-silver group-hover:text-off-black" />
                            <span className="text-sm text-silver group-hover:text-off-black">{user.trackCount}</span>
                        </div>
                    </div>
                </div>
            </div>
            <FollowButton 
                userId={user.userId} 
                initialIsFollowing={true}
                onUnfollow={() => onUnfollow?.(user.userId)}
                />
        </div>
        </>
    )
    }

    export default User