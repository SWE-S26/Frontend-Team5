import { interactiveToastBus } from "./interactiveToastBus";

export const interactionToast = {
  liked: (name: string, image: string) => {
    interactiveToastBus.emit({
      type: "liked",
      name,
      image,
    });
  },

  reposted: (name: string, image: string) => {
    interactiveToastBus.emit({
      type: "reposted",
      name,
      image,
    });
  },

  queued: (name: string, image: string) => {
    interactiveToastBus.emit({
      type: "queued",
      name,
      image,
    });
  },
};
