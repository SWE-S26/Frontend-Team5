"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { messageToastBus } from "@/lib/sockets/messageToastBus";

interface ConversationInputProps {
  receiverId: string;
  onSend: (receiverId: string, content: string) => Promise<void>;
  isSending: boolean;
  disabled: boolean;
}

const ConversationInput = ({ receiverId, onSend, isSending, disabled }: ConversationInputProps) => {
  const [content, setContent] = useState("");

  const handleSend = async () => {
    if (disabled) {
      messageToastBus.emit({
        type: "error",
        message: "Unable to send message to this user.",
      });
      return;
    }
    if (!content.trim() || isSending) return;
    await onSend(receiverId, content);
    setContent("");
  };

  return (
    <div className="flex flex-col gap-3 mb-5 mt-20 ml-2 mr-2">
      <p className="text-md font-bold text-white-smoke">
        Write your message and add tracks or playlists
        <span className="text-red-500">*</span>
      </p>
      <textarea
        className="w-full h-25 bg-off-black px-3 py-3 text-white-smoke rounded resize-y caret-crusta text-md"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSend}
          className="text-chinese-black text-sm bg-white-smoke disabled:opacity-50"
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default ConversationInput;
