import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// mirrors exactly what authStore.ts currently tracks
// once all components are migrated off authStore.ts, this becomes the only source of truth
interface AuthState {
  isAuthenticated: boolean
  hasHydrated: boolean       // true once we've checked localStorage on first load
  userId: string | null
  displayName: string | null
  profileImgLink: string | null
  bannerImgLink: string | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  hasHydrated: false,
  userId: null,
  displayName: null,
  profileImgLink: null,
  bannerImgLink: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // called after login — sets everything at once from the login response
    setAuth: (state, action: PayloadAction<Omit<AuthState, "isAuthenticated" | "hasHydrated">>) => {
      state.isAuthenticated = true
      state.hasHydrated = true
      state.userId = action.payload.userId
      state.displayName = action.payload.displayName
      state.profileImgLink = action.payload.profileImgLink
      state.bannerImgLink = action.payload.bannerImgLink
    },

    // called on logout — wipes everything
    clearAuth: (state) => {
      state.isAuthenticated = false
      state.userId = null
      state.displayName = null
      state.profileImgLink = null
      state.bannerImgLink = null
    },

    // called once on app load after reading localStorage
    hydrateAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload, hasHydrated: true }
    },

    // individual field updates — used when user edits profile pic, name, etc.
    setProfileImgLink: (state, action: PayloadAction<string | null>) => {
      state.profileImgLink = action.payload
    },

    setBannerImgLink: (state, action: PayloadAction<string | null>) => {
      state.bannerImgLink = action.payload
    },

    setDisplayName: (state, action: PayloadAction<string | null>) => {
      state.displayName = action.payload
    },
  },
})

export const {
  setAuth,
  clearAuth,
  hydrateAuth,
  setProfileImgLink,
  setBannerImgLink,
  setDisplayName,
} = authSlice.actions

export default authSlice.reducer

/*
authSlice (your own data as the logged in user)
profileImgLink, bannerImgLink, and displayName in authSlice represent who you are.
used in places like:
    The navbar avatar (top right)
    The sidebar showing your name
    Any "posted by you" indicator
This data comes from the login/refresh response and stays alive for your entire session.


profileSlice (WHOEVER'S profile page you're viewing)
The same fields in profileSlice represent the page you're currently looking at, which could be:
    Someone else's profile
    your own profile page when you navigate to it
This data is fetched from the API when you visit /profile/[username] and cleared when you leave.
*/