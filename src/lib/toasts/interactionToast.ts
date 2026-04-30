import { toastBus } from "./toastBus";

export const interactionToast = {
  liked: (name: string, image: string) => {
    toastBus.emit({
      category: "interaction",
      type: "liked",
      name,
      image,
    });
  },

  reposted: (name: string, image: string) => {
    toastBus.emit({
      category: "interaction",
      type: "reposted",
      name,
      image,
    });
  },

  queued: (name: string, image: string) => {
    toastBus.emit({
      category: "interaction",
      type: "queued",
      name,
      image,
    });
  },
};
