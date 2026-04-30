export type BaseToast =
  | {
      category: "message";
      type: "sent";
      recipientName: string;
      recipientPhoto: string;
    }
  | {
      category: "message";
      type: "received";
      senderName: string;
      senderPhoto: string;
      content: string;
    }
  | {
      category: "message";
      type: "error";
      message: string;
    }
  | {
      category: "interaction";
      type: "liked";
      name: string;
      image: string;
    }
  | {
      category: "interaction";
      type: "reposted";
      name: string;
      image: string;
    }
  | {
      category: "interaction";
      type: "queued";
      name: string;
      image: string;
    }
  | {
      category: "interaction";
      type: "copied";
    };

type Listener = (data: BaseToast) => void;

let listener: Listener | null = null;

export const toastBus = {
  register: (fn: Listener) => {
    listener = fn;
  },

  emit: (data: BaseToast) => {
    listener?.(data);
  },

  clear: () => {
    listener = null;
  },
};
