import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Track = {
  id: string;
  url: string;
  title?: string;
  artist?: string;
  img?: string;
  duration?: number;
};

type PlayerState = {
  tracks: Track[];
  currentTrackId: string | null;
  currentTrackUrl: string | null;
  currentTrackTitle: string | null;
  currentTrackArtist: string | null;
  currentTrackImage: string | null;
  currentTrackDuration: number;
  isPlaying: boolean;
  volume: number;
  shuffle: boolean;
  shuffleQueue: string[];
  shuffleIndex: number;
  loop: "none" | "one" | "all";
  isCurrentTrackLiked: boolean;
  currentTrackLikeCount: number;
};

const initialState: PlayerState = {
  tracks: [],
  currentTrackId: null,
  currentTrackUrl: null,
  currentTrackTitle: null,
  currentTrackArtist: null,
  currentTrackImage: null,
  currentTrackDuration: 0,
  isPlaying: false,
  volume: 70,
  shuffle: false,
  shuffleQueue: [],
  shuffleIndex: -1,
  loop: "none",
  isCurrentTrackLiked: false,
  currentTrackLikeCount: 0,
};

function applyTrackMetadata(state: PlayerState, track: Track) {
  state.currentTrackId = track.id;
  state.currentTrackUrl = track.url;
  state.currentTrackTitle = track.title ?? null;
  state.currentTrackArtist = track.artist ?? null;
  state.currentTrackImage = track.img ?? null;
  state.currentTrackDuration = track.duration ?? 0;
  state.isCurrentTrackLiked = false;
  state.currentTrackLikeCount = 0;
}

function buildShuffleQueue(tracks: Track[], currentId: string): string[] {
  const lastTrack = tracks[tracks.length - 1];
  const pool = tracks
    .filter((t) => t.id !== currentId && t.id !== lastTrack.id)
    .map((t) => t.id);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  if (lastTrack.id !== currentId) shuffled.push(lastTrack.id);
  return shuffled;
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playAudio(
      state,
      action: PayloadAction<{ tracks: Track[]; startId?: string }>,
    ) {
      const { tracks, startId } = action.payload;

      if (tracks.length > 1) {
        state.tracks = tracks;
        const track = startId
          ? (tracks.find((t) => t.id === startId) ?? tracks[0])
          : tracks[0];
        applyTrackMetadata(state, track);
      } else {
        const incoming = tracks[0];
        if (!incoming) return;

        const existingIndex = state.tracks.findIndex(
          (t) => t.id === incoming.id,
        );

        if (state.tracks.length === 0 || existingIndex === -1) {
          state.tracks = [incoming];
        }

        applyTrackMetadata(state, incoming);
      }

      if (state.shuffle && state.tracks.length > 1) {
        state.shuffleQueue = buildShuffleQueue(
          state.tracks,
          state.currentTrackId!,
        );
        state.shuffleIndex = 0;
      }
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

      let nextTrack: Track;

      if (state.shuffle) {
        if (!state.shuffleQueue.length) return;

        if (state.shuffleIndex >= state.shuffleQueue.length) {
          if (state.loop === "none") return;
          state.shuffleQueue = buildShuffleQueue(
            state.tracks,
            state.currentTrackId!,
          );
          state.shuffleIndex = 0;
        }

        const nextId = state.shuffleQueue[state.shuffleIndex];
        nextTrack = state.tracks.find((t) => t.id === nextId)!;
        state.shuffleIndex += 1;
      } else {
        const currentIndex = state.tracks.findIndex(
          (t) => t.id === state.currentTrackId,
        );
        const isLast = currentIndex === state.tracks.length - 1;

        if (isLast && state.loop === "none") return;

        nextTrack = isLast ? state.tracks[0] : state.tracks[currentIndex + 1];
      }

      applyTrackMetadata(state, nextTrack);
    },

    prev(state) {
      if (!state.tracks.length) return;

      const currentIndex = state.tracks.findIndex(
        (t) => t.id === state.currentTrackId,
      );

      if (currentIndex === 0 && state.loop !== "all") {
        state.isPlaying = true;
        return;
      }

      const prevIndex =
        (currentIndex - 1 + state.tracks.length) % state.tracks.length;
      const prevTrack = state.tracks[prevIndex];

      applyTrackMetadata(state, prevTrack);
      state.isPlaying = true;
    },

    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },

    toggleShuffle(state) {
      state.shuffle = !state.shuffle;
      if (state.shuffle && state.tracks.length > 1) {
        state.shuffleQueue = buildShuffleQueue(
          state.tracks,
          state.currentTrackId!,
        );
        state.shuffleIndex = 0;
      } else {
        state.shuffleQueue = [];
        state.shuffleIndex = -1;
      }
    },

    cycleLoop(state) {
      if (state.loop === "none") state.loop = "all";
      else if (state.loop === "all") state.loop = "one";
      else state.loop = "none";
    },

    setTrackDuration(state, action: PayloadAction<number>) {
      state.currentTrackDuration = action.payload;
    },

    setTrackLiked(state, action: PayloadAction<{ liked: boolean; likeCount: number }>) {
      state.isCurrentTrackLiked = action.payload.liked;
      state.currentTrackLikeCount = action.payload.likeCount;
    },


    addToQueue(state, action: PayloadAction<Track>) {
      const exists = state.tracks.some((t) => t.id === action.payload.id);
      if (!exists) state.tracks.push(action.payload);
    },

    playNext(state, action: PayloadAction<{ tracks: Track | Track[] }>) {
      const { tracks } = action.payload;
      const incomingTracks = Array.isArray(tracks) ? tracks : [tracks];
      const incomingIds = new Set(incomingTracks.map((t) => t.id));

      // 1. Find where to insert (after current track)
      const currentIndex = state.tracks.findIndex(
        (t) => t.id === state.currentTrackId,
      );
      const insertAt = currentIndex === -1 ? 0 : currentIndex + 1;

      // 2. Filter out the incoming tracks from the current queue to prevent duplicates
      const filteredQueue = state.tracks.filter((t) => !incomingIds.has(t.id));

      // 3. Insert the new tracks at the correct position
      filteredQueue.splice(insertAt, 0, ...incomingTracks);

      state.tracks = filteredQueue;

      // 4. If shuffle is on, we should technically rebuild or update the shuffle queue
      if (state.shuffle && state.tracks.length > 1) {
        state.shuffleQueue = buildShuffleQueue(
          state.tracks,
          state.currentTrackId!,
        );
        state.shuffleIndex = 0;
      }
    },

    removeFromQueue(state, action: PayloadAction<string>) {
      state.tracks = state.tracks.filter((t) => t.id !== action.payload);
    },

    reorderQueue(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      const [moved] = state.tracks.splice(from, 1);
      state.tracks.splice(to, 0, moved);
    },

    clearQueue(state) {
      const current = state.tracks.find((t) => t.id === state.currentTrackId);
      state.tracks = current ? [current] : [];
    },

    restoreState(state, action: PayloadAction<Partial<PlayerState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  playAudio,
  play,
  pause,
  togglePlay,
  next,
  prev,
  setVolume,
  toggleShuffle,
  cycleLoop,
  setTrackLiked,
  setTrackDuration,
  addToQueue,
  playNext,
  removeFromQueue,
  reorderQueue,
  clearQueue,
  restoreState,
} = playerSlice.actions;

export default playerSlice.reducer;
