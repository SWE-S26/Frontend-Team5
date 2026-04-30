"use client";

import { Heart, UserPlus, Play } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Avatar } from "antd";
import LeaderboardFollowButton from "./LeaderboardFollowButton";
import { useLikeTrackOptimistic } from "@/hooks/useLikes";
import { useState, useEffect } from "react";

interface Props {
  trackId: string;
  isLikedByUser: boolean;
  posterId: string;
}

export default function LeaderboardActions({
  trackId,
  isLikedByUser,
  posterId
}: Props) {

  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);
  const isFollowed = useAppSelector((state) => state.profile.isFollowed);
  const userid = useAppSelector((state) => state.profile.userId);
  const hasAvatar = !!profileImgLink;
  const [isLiked, setIsLiked] = useState(isLikedByUser ?? false);
  const { likeTrack, loading } = useLikeTrackOptimistic(trackId);

  useEffect(() => {
  setIsLiked(isLikedByUser);
  }, [isLikedByUser]);

  const handleLike = async () => {
  if (loading) return;

  try {
    await likeTrack();
    setIsLiked((prev) => !prev);
  } catch (err) {
    console.error(err);
  }
};

  
  const handlePlay = () => {
    console.log("Play clicked!");
  };

  return (
    <div className="w-fit text-white">
      {/* Header */}
      <div className="mb-4 flex gap-2">
        <Avatar src={profileImgLink ?? undefined} size={30} />

        <div>
          <h2 className="text-sm font-semibold">Climb the leaderboard</h2>
          <p className="text-xs text-gray-400">
            Complete the steps below:
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        {/* Avatar */}
        {/* Avatar */}
        <button
        disabled={hasAvatar}
        className={`w-17 h-17 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-1 transition
            ${
            hasAvatar
                ? "bg-[#1a1a1a] opacity-40 shadow-inner cursor-not-allowed"
                : "bg-[#1a1a1a] hover:bg-[#262626] active:scale-95 cursor-pointer"
            }
        `}
        >
        <Avatar src={profileImgLink ?? undefined} size={30} />
        <span className="text-xs">
            { "Avatar"}
        </span>
        </button>

        {/* Like */}
        <button
            onClick={handleLike}
            disabled={loading || isLiked}
            className={`w-17 h-17 rounded-xl flex flex-col items-center justify-center gap-2 transition
                ${
                isLiked
                    ? "bg-[#1a1a1a] opacity-40 shadow-inner cursor-not-allowed"
                    : "bg-[#1a1a1a] hover:bg-[#262626] active:scale-95"
                }
                ${loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            >
            <Heart
                size={20}
                
            />
            <span className="text-sm text-gray-200">
                {isLiked ? "Liked" : "Like"}
            </span>
        </button>

        {/* Follow */}
        <LeaderboardFollowButton
            userId={posterId ?? undefined}
            initialIsFollowing={isFollowed}
            />

                    {/* Play */}
                    <button
                    onClick={handlePlay}
                    className="w-17 h-17 bg-[#1a1a1a] rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#262626] transition"
                    >
                    <Play size={20} className="text-gray-300" />
                    <span className="text-sm text-gray-200">Play</span>
                    </button>
                </div>
                </div>
            );
    }