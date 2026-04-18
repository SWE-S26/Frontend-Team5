import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import messagesReducer from "./slices/messagesSlice";
import playerReducer from "./slices/playerSlice";
import trackReducer from "./slices/trackSlice";
import commentReducer from "@/store/slices/commentSlice"
import likesReducer from "@/store/slices/likeSlice"

// the root store — combines all slices into one object
// shape will be: { auth: {...}, profile: {...}, messages: {...}, player: {...} }
export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    messages: messagesReducer,
    player: playerReducer,
    track: trackReducer,
    comments: commentReducer,
    likes: likesReducer,
  },
});

// these two types are derived from the store itself
// RootState = the shape of the entire store (used in selectors)
// AppDispatch = the type of the dispatch function (used when dispatching actions)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
