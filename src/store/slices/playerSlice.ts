import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tracks: [],
  index: 0,
  isPlaying: false,
  volume: 1,
  shuffle: false,
  loop: "none", // 'none' | 'one' | 'all'
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    setTrack: (state, action) => {
      state.index = action.payload;
    },
    next: (state) => {
      if (state.shuffle) {
        state.index = Math.floor(Math.random() * state.tracks.length);
      } else {
        state.index = (state.index + 1) % state.tracks.length;
      }
    },
    prev: (state) => {
      state.index =
        (state.index - 1 + state.tracks.length) % state.tracks.length;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    cycleLoop: (state) => {
      if (state.loop === "none") state.loop = "all";
      else if (state.loop === "all") state.loop = "one";
      else state.loop = "none";
    },
  },
});

export const {
  play,
  pause,
  next,
  prev,
  setTrack,
  setVolume,
  toggleShuffle,
  cycleLoop,
} = playerSlice.actions;

export default playerSlice.reducer;
