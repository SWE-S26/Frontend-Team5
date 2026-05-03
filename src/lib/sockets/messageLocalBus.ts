export type LocalMessage = {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  seenBy: string[];
  createdAt: string;
};

export type LocalMessagePayload =
  | { type: "optimistic"; chatId: string; clientId: string; message: LocalMessage }
  | { type: "final"; chatId: string; clientId?: string; message: LocalMessage }
  | { type: "rollback"; chatId: string; clientId: string };

type Listener = (data: LocalMessagePayload) => void;

let listener: Listener | null = null;

export const messageLocalBus = {
  register: (fn: Listener) => {
    listener = fn;
  },
  emit: (data: LocalMessagePayload) => {
    listener?.(data);
  },
  clear: () => {
    listener = null;
  },
};
