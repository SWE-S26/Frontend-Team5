"use client";

import { Heart, Play } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Avatar } from "antd";
import LeaderboardFollowButton from "./LeaderboardFollowButton";
import { useLikeTrackOptimistic } from "@/hooks/useLikes";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { cycleLoop } from "@/store/slices/playerSlice";

interface Props {
  trackId: string;
  trackUrl: string;
  isLikedByUser: boolean;
  posterId: string;
  onPlay: () => void;
  // sync these from track data
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
  

  // Like — synced with optimistic update like WaveformCard
  const [isLiked, setIsLiked] = useState(isLikedByUser ?? false);
  const [likeCountState, setLikeCountState] = useState(likeCount);
  const { likeTrack, loading } = useLikeTrackOptimistic(trackId);

  useEffect(() => {
    setIsLiked(isLikedByUser);
  }, [isLikedByUser]);

  useEffect(() => {
    setLikeCountState(likeCount);
  }, [likeCount]);

  // Player — synced with redux like WaveformCard/TrackListRow
  const dispatch = useDispatch();
  const { currentTrackId, isPlaying, loop } = useSelector((state: RootState) => state.player);
  const isThisTrackPlaying = currentTrackId === trackId && isPlaying;

  // Repeat active state synced with redux loop state
  const isActive = loop === "one" && currentTrackId === trackId;
 
  const handlePlay = () => {
    if (isActive) {
      // unclick — reset loop back to none
      dispatch(cycleLoop()); // one -> none
      return;
    }
    if (loop === "none") {
      dispatch(cycleLoop()); // none -> all
      dispatch(cycleLoop()); // all -> one
    } else if (loop === "all") {
      dispatch(cycleLoop()); // all -> one
    }
    onPlay();
  };

  const handleLike = async () => {
    if (loading) return;
    try {
      await likeTrack();
      setIsLiked((prev) => {
        const next = !prev;
        setLikeCountState((c) => next ? c + 1 : c - 1);
        return next;
      });
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
            ${hasAvatar
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
          disabled={loading || isLiked}
          className={`w-17 h-17 rounded-xl flex flex-col items-center justify-center gap-2 transition
            ${isLiked
              ? "bg-off-black opacity-40 shadow-inner cursor-not-allowed"
              : "bg-off-black  active:scale-95 cursor-pointer"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Heart
            size={20}
            fill={isLiked ? "currentColor" : "none"}
          />
          <span className="text-sm text-silver">
            {isLiked ? "Liked" : "Like"} {likeCountState > 0 && `· ${likeCountState}`}
          </span>
        </button>

        {/* Follow */}
        <LeaderboardFollowButton
          userId={posterId ?? undefined}
          initialIsFollowing={isFollowed}
        />

        {/* Play on repeat — synced with redux loop */}
        <button
          onClick={handlePlay}
          className={`w-17 h-17 rounded-xl flex flex-col items-center justify-center gap-2 transition cursor-pointer
            ${isActive
              ? "bg-off-black opacity-40 shadow-inner cursor-not-allowed"
              : "bg-off-black  cursor-pointer"
            }`}
        >
          <Play size={20} className={ "text-silver"} />
          <span className="text-sm text-silver">
            {isActive ? "Repeating" : "Play"}
          </span>
        </button>
      </div>
    </div>
  );
}