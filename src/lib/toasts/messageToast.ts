import { toastBus } from "./toastBus";

export const messageToast = {
  sent: (recipientName: string, recipientPhoto: string) => {
    toastBus.emit({
      category: "message",
      type: "sent",
      recipientName,
      recipientPhoto,
    });
  },

  received: (senderName: string, senderPhoto: string, content: string) => {
    toastBus.emit({
      category: "message",
      type: "received",
      senderName,
      senderPhoto,
      content,
    });
  },

  error: (message: string) => {
    toastBus.emit({
      category: "message",
      type: "error",
      message,
    });
  },
};
