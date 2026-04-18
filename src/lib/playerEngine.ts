import { Howl } from "howler";

let sound: Howl | null = null;
let pendingSeek: number | null = null;
let loopMode: "none" | "one" | "all" = "none";

export const playerEngine = {
  load(src: string, onEnd?: () => void) {
    if (sound) {
      sound.off(); // remove all event listeners first
      sound.stop();
      sound.unload();
      sound = null;
    }

    sound = new Howl({
      src: [src],
      html5: true,
      onload: () => {
        if (pendingSeek !== null) {
          const duration = sound!.duration();
          if (duration > 0) {
            sound!.seek((pendingSeek / 100) * duration);
          }
          pendingSeek = null;
        }
      },
      onend: () => {
        if (loopMode === "one") {
          sound!.seek(0);
          sound!.play();
        } else {
          onEnd?.();
        }
      },
    });
  },

  setLoop(mode: "none" | "one" | "all") {
    loopMode = mode;
  },

  play() {
    sound?.play();
  },

  pause() {
    sound?.pause();
  },

  // INTERNAL: Seek to a percentage of the track (0-100)
  // Use useAudioProgress.seekToPercentage() instead - it manages state correctly
  _seekPercentage(pct: number) {
    if (!sound) return;

    // Store the seek request to apply after audio loads
    pendingSeek = pct;

    const duration = sound.duration();
    // If audio is already loaded, seek immediately
    if (duration > 0) {
      sound.seek((pct / 100) * duration);
      pendingSeek = null;
    }
    // Otherwise, the onload callback will apply this seek
  },

  setVolume(v: number) {
    sound?.volume(v);
  },

  // Get current playback position in seconds
  getCurrentTime(): number {
    if (!sound) return 0;
    return sound.seek() as number;
  },

  // Get total duration in seconds
  getDuration(): number {
    if (!sound) return 0;
    return sound.duration();
  },

  isLoaded(): boolean {
    return sound !== null;
  },
};

/**
 * PUBLIC API for audio control:
 * - playerEngine.load(src)        : Load audio source
 * - playerEngine.play()           : Start playback
 * - playerEngine.pause()          : Pause playback
 * - playerEngine.setVolume(0-1)   : Set volume level
 * - playerEngine.getCurrentTime() : Get current position (seconds)
 * - playerEngine.getDuration()    : Get total duration (seconds)
 *
 * For seeking: Use useAudioProgress.seekToPercentage() instead
 * This ensures React state stays synchronized with audio position
 */
