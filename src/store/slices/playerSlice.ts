import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Track {
  id: string;
  title: string;
  artist: string;
  img: string;
  audioUrl: string;
}

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.progress = 0;
      state.duration = 0;
      state.isPlaying = true;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    clearPlayer: () => initialState,
  },
});

export const {
  setTrack,
  togglePlay,
  setIsPlaying,
  setProgress,
  setDuration,
  setVolume,
  clearPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
