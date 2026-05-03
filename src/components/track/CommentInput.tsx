"use client";
import { useState } from "react";
import { Avatar } from "antd";
import { LuSend } from "react-icons/lu";
import { useAppSelector } from "@/store/hooks";
import { PostCommentPayload, MentionUser } from "@/types/comments.types";
import { useMentions } from "@/hooks/useComments";
import MentionDropdown from "@/components/track/MentionDropdown";

interface CommentInputProps {
  trackId: string;
  loading: boolean;
  currentTime: number;
  submitComment: (
    trackId: string,
    payload: PostCommentPayload,
    meta?: { displayName: string; avatarUrl: string }
  ) => Promise<any>;
}

export default function CommentInput({
  trackId,
  submitComment,
  loading,
  currentTime,
}: CommentInputProps) {
  const [comment, setComment] = useState("");
  const [mentionedUser, setMentionedUser] = useState<MentionUser | null>(null);
  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);
  const displayName = useAppSelector((state) => state.auth.displayName);
  const { suggestions, loadSuggestions, filterSuggestions, clearSuggestions } = useMentions();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setComment(val);

    // If a mention was already selected, check if they deleted it
    if (mentionedUser) {
      const mentionName = `@${mentionedUser.displayName.split(" ")[0]}`;
      if (!val.includes(mentionName)) {
        // User deleted the mention — clear it and reset suggestions
        setMentionedUser(null);
        clearSuggestions();
      }
      // Either way, don't re-open the dropdown while a mention is selected
      return;
    }

    // No mention selected yet — show dropdown as user types @
    const atIndex = val.lastIndexOf("@");
    if (atIndex !== -1) {
      const query = val.slice(atIndex + 1);
      loadSuggestions();
      filterSuggestions(query);
    } else {
      clearSuggestions();
    }
  };

  const handleSelectMention = (user: MentionUser) => {
    const atIndex = comment.lastIndexOf("@");
    const before = comment.slice(0, atIndex);
    setComment(`${before}@${user.displayName.split(" ")[0]} `);
    setMentionedUser(user);
    clearSuggestions();
  };

  const handleSubmit = async () => {
    if (!comment.trim() || loading) return;
    await submitComment(
      trackId,
      {
        content: comment,
        timestamp: Math.floor(currentTime),
        mentionedUserId: mentionedUser?.userId ?? undefined,
      },
      {
        displayName: displayName ?? "",
        avatarUrl: profileImgLink ?? "",
      }
    );
    setComment("");
    setMentionedUser(null);
    clearSuggestions();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex flex-col w-full border-t border-white-smoke/10">
      <div className="flex items-center gap-3 w-full py-3">
        <Avatar src={profileImgLink ?? undefined} size={36} style={{ flexShrink: 0 }} />

        <div className="relative flex-1">
          <div className="flex items-center bg-off-black border-none rounded-md h-10">
            <input
              type="text"
              value={comment}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Write a comment"
              className="flex-1 bg-transparent text-white-smoke text-sm outline-none placeholder-silver px-4 h-full"
            />
          </div>
          <MentionDropdown suggestions={suggestions} onSelect={handleSelectMention} />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!comment.trim() || loading}
          className="w-10 h-10 flex items-center justify-center bg-off-black border-none rounded-md hover:text-white-smoke transition disabled:opacity-30 cursor-pointer"
        >
          <LuSend size={20} />
        </button>
      </div>
    </div>
  );
}
