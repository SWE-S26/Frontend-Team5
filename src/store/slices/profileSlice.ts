import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ProfileLink } from "@/types/profile.types"

interface ProfileState {
  userId:         string | null
  username:       string | null
  displayName:    string | null
  firstName:      string | null
  lastName:       string | null
  bio:            string | null
  profileLink:    string | null
  profileImgLink: string | null
  bannerImgLink:  string | null
  city:           string | null
  country:        string | null
  links:          ProfileLink[]
  supportLink:    string | null
  favoriteGenres: string[]
  followersCount: number
  followedCount:  number        // matches actual API field name
  tracksCount:    number
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
  bio:            null,
  profileLink:    null,
  profileImgLink: null,
  bannerImgLink:  null,
  city:           null,
  country:        null,
  links:          [],
  supportLink:    null,
  favoriteGenres: [],
  followersCount: 0,
  followedCount:  0,
  tracksCount:    0,
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
  },
})

export const { setProfile, setProfileLoading, setProfileError, clearProfile } =
  profileSlice.actions

export default profileSlice.reducer