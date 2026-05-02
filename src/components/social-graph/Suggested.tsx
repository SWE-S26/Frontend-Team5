"use client";

import { useEffect, useState } from "react";
import { useGetSuggestedUsers } from "@/hooks/useSocial";
import User from "@/components/layout/User";

export default function Suggested({
  DISPLAY_COUNT = 3,
}: {
  DISPLAY_COUNT?: number;
}) {
  const { getSuggestedUsers, suggestedUsers, loading } = useGetSuggestedUsers();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    getSuggestedUsers();
  }, [getSuggestedUsers]);

  const handleRefresh = () => {
    if (!suggestedUsers) return;
    setOffset((prev) => (prev + DISPLAY_COUNT) % suggestedUsers.length);
  };

  if (!loading && suggestedUsers !== null && suggestedUsers.length === 0)
    return null;

  const displayedUsers = suggestedUsers
    ? (() => {
        const slice = suggestedUsers.slice(offset, offset + DISPLAY_COUNT);

        if (slice.length === DISPLAY_COUNT) return slice;

        return [
          ...slice,
          ...suggestedUsers.slice(0, DISPLAY_COUNT - slice.length),
        ];
      })()
    : [];

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="text-[12px] font-bold text-white-smoke tracking-wide hover:text-silver transition cursor-pointer disabled:opacity-50"
        >
          ARTISTS YOU SHOULD FOLLOW
        </button>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="text-sm text-silver hover:text-white-smoke transition cursor-pointer disabled:opacity-50"
        >
          Refresh list
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-silver border-t-white-smoke rounded-full animate-spin" />
        </div>
      ) : (
        displayedUsers.map((user) => <User key={user.userId} user={user} />)
      )}
    </div>
  );
}