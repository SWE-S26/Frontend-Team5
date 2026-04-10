import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ProfileLink } from "@/types/profile.types"

interface ProfileState {
  userId:         string | null
  username:       string | null
  displayName:    string | null
  firstName:      string | null
  lastName:       string | null
  role:           string | null
  bio:            string | null
  profileLink:    string | null
  profileImgLink: string | null
  bannerImgLink:  string | null
  city:           string | null
  country:        string | null
  links:          ProfileLink[]
  supportLink:    string | null
  bannerLinks:    ProfileLink[]
  favoriteGenres: string[]
  followersCount:  number
  followedCount: number  
  trackCount:      number  
  isFollowed:      boolean
  isBlocked:       boolean
  isOwnProfile:   boolean
  isLoading:      boolean
  error:          string | null
}

const initialState: ProfileState = {
  userId:         null,
  username:       null,
  displayName:    null,
  firstName:      null,
  lastName:       null,
  role:           null,
  bio:            null,
  profileLink:    null,
  profileImgLink: null,
  bannerImgLink:  null,
  city:           null,
  country:        null,
  links:          [],
  supportLink:    null,
  bannerLinks:    [],
  favoriteGenres: [],
  followersCount:  0,
  followedCount: 0,
  trackCount:      0,
  isFollowed:      false,
  isBlocked:       false,
  isOwnProfile:   false,
  isLoading:      false,
  error:          null,
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload }
    },

        setProfileLoading: (state, action: PayloadAction<boolean>) => {
          state.isLoading = action.payload
        },

        setProfileError: (state, action: PayloadAction<string | null>) => {
          state.error = action.payload
        },

        clearProfile: () => initialState,

        setIsFollowed: (state, action: PayloadAction<boolean>) => {
      state.isFollowed = action.payload
      },

      setFollowersCount: (state, action: PayloadAction<number>) => {
        state.followersCount = action.payload
      },

      incrementFollowedCount: (state) => {
    state.followedCount = state.followedCount + 1
    },
    decrementFollowedCount: (state) => {
        state.followedCount = Math.max(0, state.followedCount - 1)
    },

  },
})

export const { setProfile, setProfileLoading, setProfileError, clearProfile,setIsFollowed,setFollowersCount, incrementFollowedCount, decrementFollowedCount } =
  profileSlice.actions

export default profileSlice.reducer