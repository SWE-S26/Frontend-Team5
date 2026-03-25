import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// this is for the profile PAGE data — whoever's profile you're viewing
// separate from authSlice because you can view other people's profiles, not just your own
interface ProfileState {
  username: string | null
  displayName: string | null
  bio: string | null
  profileImgLink: string | null
  bannerImgLink: string | null
  followersCount: number
  followingCount: number
  tracksCount: number
  isOwnProfile: boolean   // true when the logged-in user is viewing their own profile
  isLoading: boolean
  error: string | null
}

const initialState: ProfileState = {
  username: null,
  displayName: null,
  bio: null,
  profileImgLink: null,
  bannerImgLink: null,
  followersCount: 0,
  followingCount: 0,
  tracksCount: 0,
  isOwnProfile: false,
  isLoading: false,
  error: null,
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // called when profile data finishes loading from the API
    setProfile: (state, action: PayloadAction<Partial<ProfileState>>) => {
      return { ...state, ...action.payload }
    },

    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setProfileError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // called when navigating away from a profile page
    clearProfile: () => initialState,
  },
})

export const { setProfile, setProfileLoading, setProfileError, clearProfile } =
  profileSlice.actions

export default profileSlice.reducer