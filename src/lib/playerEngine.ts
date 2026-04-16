import { Howl } from "howler";

let sound: Howl | null = null;

export const playerEngine = {
  load(src: string, onEnd?: () => void) {
    if (sound) {
      sound.unload();
      sound = null;
    }

    sound = new Howl({
      src: [src],
      html5: true,
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
    const duration = sound.duration();
    sound.seek((pct / 100) * duration);
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
