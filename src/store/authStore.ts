"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY     = "beatza:is-authenticated";
const PROFILE_IMG_KEY = "beatza:profile-img";
const BANNER_IMG_KEY = "beatza:banner-img";
const USER_ID_KEY     = "beatza:user-id";
const DISPLAY_NAME_KEY = "beatza:display-name";

type Listener = () => void;

let isAuthenticated = false;
let hasHydrated     = false;
let profileImgLink: string | null = null;
let userId: string | null = null;
let displayName: string | null = null;
let bannerImgLink: string | null = null;

const listeners = new Set<Listener>();

type AuthSnapshot = {
  isAuthenticated: boolean;
  hasHydrated:     boolean;
  profileImgLink:  string | null;
  bannerImgLink: string | null;
  userId:          string | null;
  displayName:     string | null;
};

const serverSnapshot: AuthSnapshot = {
  isAuthenticated: false,
  hasHydrated:     false,
  profileImgLink:  null,
  bannerImgLink: null,
  userId:          null,
  displayName:     null,
};

let snapshot: AuthSnapshot = serverSnapshot;

function readPersistedAuthState(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function syncSnapshot() {
  const nextSnapshot: AuthSnapshot = {
    isAuthenticated,
    hasHydrated,
    profileImgLink,
    bannerImgLink,
    userId,
    displayName,
  };

  if (
    snapshot.isAuthenticated === nextSnapshot.isAuthenticated &&
    snapshot.hasHydrated === nextSnapshot.hasHydrated &&
    snapshot.profileImgLink === nextSnapshot.profileImgLink &&
    snapshot.bannerImgLink === nextSnapshot.bannerImgLink &&
    snapshot.userId === nextSnapshot.userId &&
    snapshot.displayName === nextSnapshot.displayName
  )
    return false;

  snapshot = nextSnapshot;
  return true;
}

function hydrateFromStorage() {
  if (typeof window === "undefined") return;

  const nextValue        = readPersistedAuthState();
  const nextImg          = window.localStorage.getItem(PROFILE_IMG_KEY);
  const nextBannerImg    = window.localStorage.getItem(BANNER_IMG_KEY);
  const nextUserId       = window.localStorage.getItem(USER_ID_KEY);
  const nextDisplayName  = window.localStorage.getItem(DISPLAY_NAME_KEY);
  const authChanged      = isAuthenticated !== nextValue;
  const hydrationChanged = !hasHydrated;

  isAuthenticated = nextValue;
  profileImgLink  = nextImg;
  bannerImgLink   = nextBannerImg;
  userId          = nextUserId;
  displayName     = nextDisplayName;
  hasHydrated     = true;

  if (syncSnapshot() && (authChanged || hydrationChanged)) {
    emitChange();
  }
}

function setAuthenticated(nextValue: boolean) {
  if (isAuthenticated === nextValue) return;
  isAuthenticated = nextValue;
  hasHydrated     = true;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, String(nextValue));
  }
  if (syncSnapshot()) emitChange();
}

function setProfileImg(imgLink: string | null) {
  if (profileImgLink === imgLink) return;
  profileImgLink = imgLink;
  if (typeof window !== "undefined") {
    if (imgLink) window.localStorage.setItem(PROFILE_IMG_KEY, imgLink);
    else         window.localStorage.removeItem(PROFILE_IMG_KEY);
  }
  if (syncSnapshot()) emitChange();
}

function setBannerImg(imgLink: string | null) {
  if (bannerImgLink === imgLink) return;
  bannerImgLink = imgLink;
  if (typeof window !== "undefined") {
    if (imgLink) window.localStorage.setItem(BANNER_IMG_KEY, imgLink);
    else         window.localStorage.removeItem(BANNER_IMG_KEY);
  }
  if (syncSnapshot()) emitChange();
}

function setUserId(id: string | null) {
  if (userId === id) return;
  userId = id;
  if (typeof window !== "undefined") {
    if (id) window.localStorage.setItem(USER_ID_KEY, id);
    else    window.localStorage.removeItem(USER_ID_KEY);
  }
  if (syncSnapshot()) emitChange();
}

function setDisplayName(name: string | null) {
  if (displayName === name) return;
  displayName = name;
  if (typeof window !== "undefined") {
    if (name) window.localStorage.setItem(DISPLAY_NAME_KEY, name);
    else      window.localStorage.removeItem(DISPLAY_NAME_KEY);
  }
  if (syncSnapshot()) emitChange();
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return serverSnapshot;
}

function subscribe(listener: Listener) {
  listeners.add(listener);

  if (typeof window === "undefined") {
    return () => listeners.delete(listener);
  }

  hydrateFromStorage();

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      const nextValue = event.newValue === "true";
      if (nextValue === isAuthenticated) return;
      isAuthenticated = nextValue;
      hasHydrated     = true;
      if (syncSnapshot()) emitChange();
    }
    if (event.key === PROFILE_IMG_KEY) {
      profileImgLink = event.newValue;
      if (syncSnapshot()) emitChange();
    }
    if (event.key === BANNER_IMG_KEY) {
      bannerImgLink = event.newValue;
      if (syncSnapshot()) emitChange();
    }
    if (event.key === USER_ID_KEY) {
      userId = event.newValue;
      if (syncSnapshot()) emitChange();
    }
    if (event.key === DISPLAY_NAME_KEY) {
      displayName = event.newValue;
      if (syncSnapshot()) emitChange();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const authStore = {
  getAuthenticated: () => getSnapshot(),
  setAuthenticated,
  setProfileImg,
  setBannerImg,
  setUserId,
  setDisplayName,
};

export function useAuthStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    isAuthenticated: snapshot.isAuthenticated,
    hasHydrated:     snapshot.hasHydrated,
    profileImgLink:  snapshot.profileImgLink,
    bannerImgLink:   snapshot.bannerImgLink,
    userId:          snapshot.userId,
    displayName:     snapshot.displayName,
    setAuthenticated,
    setProfileImg,
    setBannerImg,
    setUserId,
    setDisplayName,
  };
}