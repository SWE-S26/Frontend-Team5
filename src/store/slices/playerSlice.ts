import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Track = {
  id: string;
  url: string;
  title?: string;
  artist?: string;
  img?: string;
};

type PlayerState = {
  tracks: Track[];
  currentTrackId: string | null;
  currentTrackUrl: string | null;
  isPlaying: boolean;
  volume: number;
  shuffle: boolean;
  loop: "none" | "one" | "all";
};

const initialState: PlayerState = {
  tracks: [],
  currentTrackId: null,
  currentTrackUrl: null,
  isPlaying: false,
  volume: 1,
  shuffle: false,
  loop: "none",
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setTracks(state, action: PayloadAction<Track[]>) {
      state.tracks = action.payload;
    },

    setTrack(state, action: PayloadAction<string>) {
      state.currentTrackId = action.payload;
    },

    setTrackWithUrl(state, action: PayloadAction<{ id: string; url: string }>) {
      state.currentTrackId = action.payload.id;
      state.currentTrackUrl = action.payload.url;
    },

    play(state) {
      state.isPlaying = true;
    },

    pause(state) {
      state.isPlaying = false;
    },

    togglePlay(state) {
      state.isPlaying = !state.isPlaying;
    },

    next(state) {
      if (!state.tracks.length) return;

      const currentIndex = state.tracks.findIndex(
        (t) => t.id === state.currentTrackId,
      );

      if (state.shuffle) {
        state.currentTrackId =
          state.tracks[Math.floor(Math.random() * state.tracks.length)].id;
        return;
      }

      const nextIndex = (currentIndex + 1) % state.tracks.length;
      state.currentTrackId = state.tracks[nextIndex].id;
    },

    prev(state) {
      if (!state.tracks.length) return;

      const currentIndex = state.tracks.findIndex(
        (t) => t.id === state.currentTrackId,
      );

      const prevIndex =
        (currentIndex - 1 + state.tracks.length) % state.tracks.length;

      state.currentTrackId = state.tracks[prevIndex].id;
    },

    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },

    toggleShuffle(state) {
      state.shuffle = !state.shuffle;
    },

    cycleLoop(state) {
      if (state.loop === "none") state.loop = "all";
      else if (state.loop === "all") state.loop = "one";
      else state.loop = "none";
    },
  },
});

export const {
  setTracks,
  setTrack,
  setTrackWithUrl,
  play,
  pause,
  togglePlay,
  next,
  prev,
  setVolume,
  toggleShuffle,
  cycleLoop,
} = playerSlice.actions;

export default playerSlice.reducer;
