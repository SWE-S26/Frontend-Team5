import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { restoreState } from "@/store/slices/playerSlice";

const PLAYER_STATE_KEY = "player_state";

export function usePlayerPersistence() {
  const dispatch = useDispatch();
  const playerState = useSelector((state: RootState) => state.player);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PLAYER_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch(
          restoreState({
            tracks: parsed.tracks ?? [],
            volume: parsed.volume,
            shuffle: parsed.shuffle,
            shuffleQueue: parsed.shuffleQueue ?? [],
            shuffleIndex: parsed.shuffleIndex ?? -1,
            loop: "none",
            currentTrackId: parsed.currentTrackId,
            currentTrackUrl: parsed.currentTrackUrl,
            currentTrackTitle: parsed.currentTrackTitle,
            currentTrackArtist: parsed.currentTrackArtist,
            currentTrackImage: parsed.currentTrackImage,
            currentTrackDuration: parsed.currentTrackDuration,
          }),
        );
      }
    } catch (error) {
      console.error("Failed to restore player state:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    try {
      localStorage.setItem(
        PLAYER_STATE_KEY,
        JSON.stringify({
          tracks: playerState.tracks,
          volume: playerState.volume,
          shuffle: playerState.shuffle,
          shuffleQueue: playerState.shuffleQueue,
          shuffleIndex: playerState.shuffleIndex,
          currentTrackId: playerState.currentTrackId,
          currentTrackUrl: playerState.currentTrackUrl,
          currentTrackTitle: playerState.currentTrackTitle,
          currentTrackArtist: playerState.currentTrackArtist,
          currentTrackImage: playerState.currentTrackImage,
          currentTrackDuration: playerState.currentTrackDuration,
        }),
      );
    } catch (error) {
      console.error("Failed to save player state:", error);
    }
  }, [playerState]);
}
