import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import { socialService } from "@/services/social.service";
import {
  GetFollowersResponse,
  GetFollowingResponse,
  GetSuggestedUsersResponse,
  GetBlockedUsersResponse,
  SuggestedParams,
} from "@/types/social.types";

// ─────────────────────────────────────────────────────────────────────────────
// (1) Follow a user
// On success: returns the API response so the caller can update local state
// ─────────────────────────────────────────────────────────────────────────────
export function useFollowUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const followUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await socialService.followUser(userId);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { followUser, loading, error, success };
}

// ─────────────────────────────────────────────────────────────────────────────
// (2) Unfollow a user
// ─────────────────────────────────────────────────────────────────────────────
export function useUnfollowUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const unfollowUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await socialService.unfollowUser(userId);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { unfollowUser, loading, error, success };
}

// ─────────────────────────────────────────────────────────────────────────────
// (3) Get followers of a user
// Uses public endpoint when unauthenticated, authenticated endpoint otherwise
// ─────────────────────────────────────────────────────────────────────────────
export function useGetFollowers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followers, setFollowers] = useState<GetFollowersResponse | null>(null);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const getFollowers = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = isAuthenticated
          ? await socialService.getFollowers(userId)
          : await socialService.getFollowersPublic(userId);
        setFollowers(res.data);
        return res.data;
      } catch (err: any) {
        const message = err.response?.data?.message || "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return { getFollowers, loading, error, followers };
}

// ─────────────────────────────────────────────────────────────────────────────
// (4) Get users that a user is following
// Uses public endpoint when unauthenticated, authenticated endpoint otherwise
// ─────────────────────────────────────────────────────────────────────────────
export function useGetFollowing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState<GetFollowingResponse | null>(null);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const getFollowing = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = isAuthenticated
          ? await socialService.getFollowing(userId)
          : await socialService.getFollowingPublic(userId);
        setFollowing(res.data);
        return res.data;
      } catch (err: any) {
        const message = err.response?.data?.message || "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  return { getFollowing, loading, error, following };
}

// ─────────────────────────────────────────────────────────────────────────────
// (5) Get suggested users
// params.offset + params.limit drive the refresh button
// caller just increments offset by limit to get the next batch
// ─────────────────────────────────────────────────────────────────────────────
export function useGetSuggestedUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<GetSuggestedUsersResponse | null>(null);

  const getSuggestedUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await socialService.getSuggestedUsers();
      setSuggestedUsers(res.data);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { getSuggestedUsers, loading, error, suggestedUsers };
}

// ─────────────────────────────────────────────────────────────────────────────
// (6) Get blocked users
// ─────────────────────────────────────────────────────────────────────────────
export function useGetBlockedUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<GetBlockedUsersResponse | null>(null);

  const getBlockedUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await socialService.getBlockedUsers();
      setBlockedUsers(res.data);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { getBlockedUsers, loading, error, blockedUsers };
}

// ─────────────────────────────────────────────────────────────────────────────
// (7) Block a user
// ─────────────────────────────────────────────────────────────────────────────
export function useBlockUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const blockUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await socialService.blockUser(userId);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { blockUser, loading, error, success };
}

// ─────────────────────────────────────────────────────────────────────────────
// (8) Unblock a user
// ─────────────────────────────────────────────────────────────────────────────
export function useUnblockUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const unblockUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await socialService.unblockUser(userId);
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  return { unblockUser, loading, error, success };
}
