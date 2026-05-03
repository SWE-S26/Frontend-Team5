"use client";

import { Heart, Play } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Avatar } from "antd";
import LeaderboardFollowButton from "./LeaderboardFollowButton";
import { useLikeTrackOptimistic } from "@/hooks/useLikes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { cycleLoop, setTrackLiked } from "@/store/slices/playerSlice";

interface Props {
  trackId: string;
  trackUrl: string;
  isLikedByUser: boolean;
  posterId: string;
  onPlay: () => void;
  title?: string;
  artist?: string;
  img?: string;
  likeCount?: number;
}

export default function LeaderboardActions({
  trackId,
  trackUrl,
  isLikedByUser,
  posterId,
  onPlay,
  title,
  artist,
  img,
  likeCount = 0,
}: Props) {
  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);
  const isFollowed = useAppSelector((state) => state.profile.isFollowed);
  const hasAvatar = !!profileImgLink;

  const dispatch = useDispatch();
  const { currentTrackId, isPlaying, loop, isCurrentTrackLiked, currentTrackLikeCount } =
    useSelector((state: RootState) => state.player);
  const isThisTrackPlaying = currentTrackId === trackId && isPlaying;
  const isActive = loop === "one" && currentTrackId === trackId;

  const { likeTrack, loading } = useLikeTrackOptimistic(trackId);

  // Seed Redux with the prop values when the component mounts or props change
  // Only seed if this is the currently loaded track to avoid overwriting
  useEffect(() => {
    if (currentTrackId === trackId) {
      dispatch(setTrackLiked({ liked: isLikedByUser, likeCount }));
    }
  }, [isLikedByUser, likeCount, trackId, currentTrackId]);

  const handlePlay = () => {
    if (isActive) {
      dispatch(cycleLoop());
      return;
    }
    if (loop === "none") {
      dispatch(cycleLoop());
      dispatch(cycleLoop());
    } else if (loop === "all") {
      dispatch(cycleLoop());
    }
    onPlay();
  };

  const handleLike = async () => {
    if (loading) return;
    try {
      await likeTrack();
      const nextLiked = !isCurrentTrackLiked;
      dispatch(
        setTrackLiked({
          liked: nextLiked,
          likeCount: nextLiked ? currentTrackLikeCount + 1 : currentTrackLikeCount - 1,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-fit text-white-smoke">
      <div className="mb-4 flex gap-2">
        <Avatar src={profileImgLink ?? undefined} size={30} />
        <div>
          <h2 className="text-sm font-semibold">Climb the leaderboard</h2>
          <p className="text-xs text-gray-400">Complete the steps below:</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Avatar */}
        <button
          disabled={hasAvatar}
          className={`w-17 h-17 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-1 transition
            ${
              hasAvatar
                ? "bg-off-black opacity-40 shadow-inner cursor-not-allowed"
                : "bg-off-black hover:bg-[#262626] active:scale-95 cursor-pointer"
            }`}
        >
          <Avatar src={profileImgLink ?? undefined} size={30} />
          <span className="text-xs">Avatar</span>
        </button>

        {/* Like */}
        <button
          onClick={handleLike}
          disabled={loading || isCurrentTrackLiked}
          className={`w-17 h-17 rounded-xl flex flex-col items-center justify-center gap-2 transition
            ${
              isCurrentTrackLiked
                ? "bg-off-black opacity-40 shadow-inner cursor-not-allowed"
                : "bg-off-black active:scale-95 cursor-pointer"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Heart size={20} fill={isCurrentTrackLiked ? "currentColor" : "none"} />
          <span className="text-sm text-silver">
            {isCurrentTrackLiked ? "Liked" : "Like"}{" "}
            {currentTrackLikeCount > 0 && `· ${currentTrackLikeCount}`}
          </span>
        </button>

        {/* Follow */}
        <LeaderboardFollowButton userId={posterId ?? undefined} initialIsFollowing={isFollowed} />

        {/* Play on repeat */}
        <button
          onClick={handlePlay}
          className={`w-17 h-17 rounded-xl flex flex-col items-center justify-center gap-2 transition cursor-pointer
            ${
              isActive
                ? "bg-off-black opacity-40 shadow-inner cursor-not-allowed"
                : "bg-off-black cursor-pointer"
            }`}
        >
          <Play size={20} className="text-silver" />
          <span className="text-sm text-silver">{isActive ? "Repeating" : "Play"}</span>
        </button>
      </div>
    </div>
  );
}
