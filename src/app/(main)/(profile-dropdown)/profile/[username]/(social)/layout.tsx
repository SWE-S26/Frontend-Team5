'use client'
import React from 'react'
import { useEffect } from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useGetProfile } from '@/hooks/useProfile'
import { setProfile, clearProfile } from '@/store/slices/profileSlice'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { username } = useParams()
  const dispatch       = useAppDispatch()
const displayName    = useAppSelector((state) => state.profile.displayName)
const profileImgLink = useAppSelector((state) => state.profile.profileImgLink)
const hasHydrated    = useAppSelector((state) => state.auth.hasHydrated)
const authUserId     = useAppSelector((state) => state.auth.userId)
const { getProfile } = useGetProfile()

useEffect(() => {
  if (!hasHydrated || !username) return
  const userId = username as string
  dispatch(setProfile({ isLoading: true }))
  getProfile(userId).then((data) => {
    if (!data) return
    dispatch(setProfile({
      userId:          data.userId,
      displayName:     data.displayName,
      profileImgLink:  data.profileImgLink,
      followersCount:  data.followersCount,
      followedCount:   data.followedCount,
      trackCount:      data.trackCount,
      isFollowed:      data.isFollowed,
      isBlocked:       data.isBlocked,
      isOwnProfile:    data.userId === authUserId,
    }))
    }).finally(() => {
      dispatch(setProfile({ isLoading: false }))
    })

    return () => { dispatch(clearProfile()) }
  }, [username, hasHydrated])
  
  const getActiveKey = () => {
    if (pathname.endsWith('/following')) return 'following'
    if (pathname.endsWith('/followers')) return 'followers'
    return 'likes'
  }

  const getTitle = () => {
    if (pathname.endsWith('/following')) return `${displayName} is following`
    if (pathname.endsWith('/followers')) return `Followers of ${displayName}`
    return `Likes by ${displayName}`
  }

  const items: TabsProps['items'] = [
      { key: 'likes', label: <span className="font-bold">Likes</span> },
      { key: 'following', label: <span className="font-bold">Following</span> },
      { key: 'followers', label: <span className="font-bold">Followers</span> },
  ]

  const onChange = (key: string) => {
  setTimeout(() => {
    router.push(`/profile/${username}/${key}`)
  }, 0)
}

  return (
    <div>
      <div className="flex items-center gap-7 mb-4">
        <img 
          src={profileImgLink ?? "/ethan.jpg"} 
          alt="avatar" 
          className="w-20 h-20 rounded-full object-cover" 
        />
        <h2 className="text-2xl font-bold">{getTitle()}</h2>
      </div>

      <style>{`
        .profile-tabs .ant-tabs-tab .ant-tabs-tab-btn {
          color: #999 !important;
          
        }
        .profile-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn {
          color: #f5f5f5 !important;
          
        }
        .profile-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #f5f5f5 !important;
          

        }
        .profile-tabs .ant-tabs-ink-bar {
          background: #f5f5f5 !important;
          
        }
        
        .profile-tabs .ant-tabs-nav::before {
          border-bottom: 1px solid #121212 !important;
        }
      `}</style>

      <Tabs
        className="profile-tabs"
        activeKey={getActiveKey()}
        items={items}
        onChange={onChange}
        animated={false}
      />

      {children}
    </div>
  )
}