export type interactiveToast =
  | { type: "liked"; name: string; image: string }
  | { type: "reposted"; name: string; image: string }
  | { type: "queued"; name: string; image: string }
  | { type: "copied" };

type Listener = (data: interactiveToast) => void;

// 1. Define the Bus first
let listener: Listener | null = null;

export const interactiveToastBus = {
  register: (fn: Listener) => {
    listener = fn;
  },
  emit: (data: interactiveToast) => {
    if (listener) {
      listener(data);
    } else {
      console.warn(
        "No toast listener registered. Is the Toast component mounted?",
      );
    }
  },
  clear: () => {
    listener = null;
  },
};

// 2. Define the helpers that use the Bus
export const interactionToast = {
  liked: (name: string, image: string) => {
    interactiveToastBus.emit({ type: "liked", name, image });
  },
  reposted: (name: string, image: string) => {
    interactiveToastBus.emit({ type: "reposted", name, image });
  },
  queued: (name: string, image: string) => {
    interactiveToastBus.emit({ type: "queued", name, image });
  },
  copied: () => {
    interactiveToastBus.emit({ type: "copied" });
  },
};
