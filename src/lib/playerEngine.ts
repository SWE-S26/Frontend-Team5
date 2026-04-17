import { Howl } from "howler";

let sound: Howl | null = null;
let pendingSeek: number | null = null;

export const playerEngine = {
  load(src: string, onEnd?: () => void) {
    if (sound) {
      sound.unload();
      sound = null;
    }

    sound = new Howl({
      src: [src],
      html5: true,
      onload: () => {
        // Audio is now fully loaded, apply any pending seek
        if (pendingSeek !== null) {
          const duration = sound!.duration();
          if (duration > 0) {
            sound!.seek((pendingSeek / 100) * duration);
          }
          pendingSeek = null;
        }
      },
      onend: () => {
        onEnd?.();
      },
    });
  },

  play() {
    sound?.play();
  },

  pause() {
    sound?.pause();
  },

  stop() {
    sound?.stop();
  },

  seek(pct: number) {
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

  getCurrentTime(): number {
    if (!sound) return 0;
    return sound.seek() as number;
  },

  getDuration(): number {
    if (!sound) return 0;
    return sound.duration();
  },

  isLoaded(): boolean {
    return sound !== null;
  },
};
