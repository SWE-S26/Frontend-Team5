"use client";

import { UserPlus, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useFollowUser, useUnfollowUser } from "@/hooks/useSocial";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { decrementFollowedCount, incrementFollowedCount } from "@/store/slices/profileSlice";

interface LeaderboardFollowButtonProps {
  userId?: string;
  initialIsFollowing?: boolean;
  onUnfollow?: () => void;
}

export default function LeaderboardFollowButton({ userId, initialIsFollowing = false, onUnfollow }: LeaderboardFollowButtonProps) {
  const { followUser, loading: followLoading } = useFollowUser();
  const { unfollowUser, loading: unfollowLoading } = useUnfollowUser();
  const isLoading = followLoading || unfollowLoading;
  const dispatch = useAppDispatch();
  const isOwnProfile = useAppSelector((state) => state.profile.isOwnProfile);
  const isFollowed = useAppSelector((state) => state.profile.isFollowed);

  const [isFollowing, setIsFollowing] = useState(isFollowed ?? initialIsFollowing);

  useEffect(() => {
    setIsFollowing(isFollowed ?? initialIsFollowing);
  }, [isFollowed]);

  const handleClick = async () => {
    if (!userId || isLoading) return;
    if (isFollowing) {
      const res = await unfollowUser(userId);
      if (res) {
        setIsFollowing(false);
        if (isOwnProfile) dispatch(decrementFollowedCount());
        onUnfollow?.();
      }
    } else {
      const res = await followUser(userId);
      if (res) {
        setIsFollowing(true);
        if (isOwnProfile) dispatch(incrementFollowedCount());
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`w-17 h-17 rounded-xl flex flex-col items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50
        ${isFollowing ? "bg-off-black" : "bg-off-black "}`}
    >
      {isFollowing
        ? <UserCheck size={20} className="text-silver" />
        : <UserPlus size={20} className="text-silver" />
      }
      <span className="text-sm text-silver">
        {isFollowing ? "Following" : "Follow"}
      </span>
    </button>
  );
}