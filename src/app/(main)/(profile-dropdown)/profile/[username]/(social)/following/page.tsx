"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { useGetFollowing } from "@/hooks/useSocial";
import UserCardGrid from "@/components/social-graph/UserCardGrid";

const FollowingPage = () => {
  const profileUserId = useAppSelector((state) => state.profile.userId);
  const { getFollowing, following, loading } = useGetFollowing();
  const isOwn = useAppSelector((state) => state.profile.isOwnProfile);
  const displayName = useAppSelector((state) => state.profile.displayName);

  useEffect(() => {
    if (profileUserId) {
      getFollowing(profileUserId);
    }
  }, [profileUserId]);

  return (
    <div className="px-4 sm:px-0">
      <UserCardGrid
        users={following ?? []}
        loading={loading}
        emptyType="following"
        isOwn={isOwn}
        displayName={displayName ?? ""}
      />
    </div>
  );
};

export default FollowingPage;
