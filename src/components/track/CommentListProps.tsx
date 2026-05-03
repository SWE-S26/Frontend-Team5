"use client";
import { useState, useMemo } from "react";
import { Avatar } from "antd";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useReplies, useMentions } from "@/hooks/useComments";
import { formatDistanceToNow } from "date-fns";
import { TrackComment } from "@/types/comments.types";
import SortDropdown, { SortOption } from "./SortDropdown";
import { PostCommentPayload } from "@/types/comments.types";
import { useRouter } from "next/navigation";
import { LuSend } from "react-icons/lu";
import { useAppSelector } from "@/store/hooks";
import { CgTrash } from "react-icons/cg";
import ConfirmPopover from "@/components/track/ConfirmPopover";
import { MentionUser } from "@/types/comments.types";
import MentionDropdown from "@/components/track/MentionDropdown";

interface CommentListProps {
  trackId: string;
  comments: TrackComment[];
  total: number;
  loading: boolean;
  loadComments: (trackId: string, reset?: boolean) => Promise<void>;
  loadMore: (trackId: string) => void;
  toggleLike: (commentId: string) => Promise<void>;
  submitComment: (
    trackId: string,
    payload: PostCommentPayload,
    meta?: { displayName: string; avatarUrl: string }
  ) => Promise<any>;
  postReply: (trackId: string, payload: PostCommentPayload) => Promise<any>;
  deleteCommentById: (commentId: string) => Promise<void>;
}

const formatTimestamp = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

/**
 * Main comment @mentions.
 * Routes to mentionedUserId if present, otherwise inert blue text.
 */

const renderMentionContent = (
  text: string,
  router: ReturnType<typeof useRouter>,
  mentionedUserId?: string
) => {
  return text.split(/(@[\w-]+)/g).map((part, i) => {
    if (!/^@[\w-]+$/.test(part)) return part;

    return (
      <span
        key={i}
        onClick={() => {
          console.log("CLICKED"); // debug
          router.push(`/profile/${mentionedUserId}`);
        }}
        className="text-blue-400 cursor-pointer hover:text-blue-300"
        style={{ pointerEvents: "auto" }}
      >
        {part}
      </span>
    );
  });
};

const renderReplyContent = (
  text: string,
  router: ReturnType<typeof useRouter>,
  authorUserId: string,
  mentionedUserId?: string,
  mentionedDisplayName?: string
) => {
  const parts = text.split(/(@[\w-]+)/g);
  let firstMentionSeen = false;

  return parts.map((part, i) => {
    if (!/^@[\w-]+$/.test(part)) return part;

    if (mentionedUserId && mentionedDisplayName) {
      const firstName = mentionedDisplayName.split(" ")[0].toLowerCase();
      if (part.toLowerCase() === `@${firstName}:`) {
        return (
          <span
            key={i}
            onClick={() => router.push(`/profile/${mentionedUserId}`)}
            className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
          >
            {part}
          </span>
        );
      }
      // Anything else is the author
      return (
        <span
          key={i}
          onClick={() => router.push(`/profile/${authorUserId}`)}
          className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
        >
          {part}
        </span>
      );
    }

    // Strategy 2: position-based fallback (first @ = author, second @ = mentionedUser)
    if (!firstMentionSeen) {
      firstMentionSeen = true;
      return (
        <span
          key={i}
          onClick={() => router.push(`/profile/${authorUserId}`)}
          className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
        >
          {part}
        </span>
      );
    }

    return (
      <span
        key={i}
        onClick={() => {
          if (mentionedUserId) router.push(`/profile/${mentionedUserId}`);
        }}
        className={`font-medium ${
          mentionedUserId ? "text-blue-400 hover:text-blue-300 cursor-pointer" : "text-blue-400"
        }`}
      >
        {part}
      </span>
    );
  });
};

function ReplySection({
  comment,
  trackId,
  postReply,
  onDeleteComment,
}: {
  comment: TrackComment;
  trackId: string;
  postReply: (trackId: string, payload: PostCommentPayload) => Promise<any>;
  onDeleteComment: (commentId: string) => Promise<void>;
}) {
  const router = useRouter();
  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);
  const { replies, loading, loadReplies, toggleLike, deleteReply } = useReplies();
  const [showReplies, setShowReplies] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const { suggestions, loadSuggestions, filterSuggestions, clearSuggestions } = useMentions();
  const [mentionedUser, setMentionedUser] = useState<MentionUser | null>(null);

  const handleLoadReplies = () => {
    if (!showReplies) loadReplies(comment.commentId);
    setShowReplies((prev) => !prev);
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setReplyInput(val);

    // Find the last @ that could be a new mention being typed
    // Skip the very first @ (index 0) since that's the auto-prefilled author mention
    const firstAtIndex = val.indexOf("@");
    const lastAtIndex = val.lastIndexOf("@");

    if (lastAtIndex !== -1 && lastAtIndex !== firstAtIndex) {
      // User is typing a second @mention
      loadSuggestions();
      filterSuggestions(val.slice(lastAtIndex + 1));
    } else if (lastAtIndex !== -1 && lastAtIndex === firstAtIndex) {
      // Only one @ exists — could be user clearing the input and retyping
      // Only show suggestions if user is actively typing after the @
      const query = val.slice(lastAtIndex + 1);
      if (query.length > 0) {
        loadSuggestions();
        filterSuggestions(query);
      } else {
        clearSuggestions();
      }
    } else {
      clearSuggestions();
    }

    // Clear mentionedUser only if their @name was removed from the text
    if (mentionedUser) {
      const mentionName = `@${mentionedUser.displayName.split(" ")[0]}`;
      if (!val.includes(mentionName)) {
      }
    }
  };

  const handleSelectMention = (user: MentionUser) => {
    const atIndex = replyInput.lastIndexOf("@");
    const before = replyInput.slice(0, atIndex);
    setReplyInput(`${before}@${user.displayName.split(" ")[0]} `);
    setMentionedUser(user);
    clearSuggestions();
  };

  const handleSubmitReply = async () => {
    if (!replyInput.trim()) return;
    await postReply(trackId, {
      content: replyInput,
      timestamp: comment.timestamp,
      parentCommentId: comment.commentId,
      mentionedUserId: mentionedUser?.userId,
    });
    setReplyInput("");
    setShowInput(false);
    setShowReplies(true);

    clearSuggestions();
    setTimeout(() => loadReplies(comment.commentId), 300);
  };

  return (
    <div className="flex flex-col gap-2 mt-1">
      <div className="flex items-center gap-3">
        <div className="flex gap-5 items-center">
          <button
            onClick={() => {
              setReplyInput(`@${comment.displayName.split(" ")[0]}: `);
              setShowInput((prev) => !prev);
            }}
            className="text-white-smoke font-semibold text-sm hover:text-white-smoke w-fit cursor-pointer"
          >
            Reply
          </button>

          {comment.isOwnComment && (
            <ConfirmPopover onConfirm={() => onDeleteComment(comment.commentId)}>
              <button
                className="text-off-black hover:text-red-500 transition cursor-pointer"
                aria-label="Delete comment"
              >
                <CgTrash size={16} className="text-white-smoke mt-2" />
              </button>
            </ConfirmPopover>
          )}
        </div>

        {comment.replyCount > 0 && (
          <button
            onClick={handleLoadReplies}
            className="text-[#888888] text-sm hover:text-white-smoke cursor-pointer"
          >
            {showReplies
              ? "Hide replies"
              : `${comment.replyCount} ${comment.replyCount === 1 ? "reply" : "replies"}`}
          </button>
        )}
      </div>

      {showInput && (
        <div className="flex items-center gap-2 mt-1">
          <Avatar src={profileImgLink || undefined} size={36} style={{ flexShrink: 0 }} />

          <div className="relative flex-1">
            <input
              type="text"
              value={replyInput}
              onChange={handleReplyChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitReply()}
              placeholder="Write a reply..."
              className="w-full bg-off-black text-white-smoke text-sm outline-none placeholder-silver px-3 py-2 pr-8 rounded-md"
            />
            <button
              onClick={() => {
                setShowInput(false);
                setReplyInput("");
                clearSuggestions();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-silver hover:text-white-smoke transition cursor-pointer"
              aria-label="Close reply"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 2L12 12M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <MentionDropdown suggestions={suggestions} onSelect={handleSelectMention} />
          </div>

          <button
            onClick={handleSubmitReply}
            disabled={!replyInput.trim()}
            className="text-sm  bg-off-black px-3 py-2 rounded-md hover: disabled:opacity-30 cursor-pointer"
          >
            <LuSend size={20} />
          </button>
        </div>
      )}

      {showReplies && (
        <div className="flex flex-col gap-3 mt-2 ml-2 pl-4 border-l-2 border-white/10">
          {loading && <p className="text-silver text-sm">Loading...</p>}
          {replies.map((reply) => (
            <div key={reply.commentId} className="flex gap-3">
              <Avatar src={reply.avatarUrl || undefined} size={36} style={{ flexShrink: 0 }} />

              <div className="flex flex-col flex-1 gap-1">
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-bold text-white-smoke">
                    {reply.isOwnComment ? "You" : reply.displayName}
                  </span>
                  <span>at</span>
                  <span className="text-[#888888] font-bold">
                    {formatTimestamp(reply.timestamp)}
                  </span>
                  <span className="text-[#888888]">·</span>
                  <span className="text-[#888888]">
                    {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                  </span>
                </div>

                <p className="text-white-smoke text-sm">
                  {renderReplyContent(
                    reply.content,
                    router,
                    comment.userId,
                    reply.mentionedUserId ?? undefined,
                    // Pass mentionedDisplayName if your reply type has it
                    (reply as any).mentionedDisplayName ?? undefined
                  )}
                </p>

                {reply.isOwnComment && (
                  <ConfirmPopover onConfirm={() => deleteReply(reply.commentId)}>
                    <button
                      className="text-silver hover:text-red-500 transition cursor-pointer w-fit mt-0.5"
                      aria-label="Delete reply"
                    >
                      <CgTrash size={16} className="text-white-smoke" />
                    </button>
                  </ConfirmPopover>
                )}
              </div>

              <div className="flex flex-col items-center gap-1 text-silver text-sm">
                <button
                  onClick={() => toggleLike(reply.commentId)}
                  className="hover:text-white-smoke transition cursor-pointer"
                >
                  {reply.isLikedByUser ? (
                    <AiFillHeart size={16} className="text-red-500" />
                  ) : (
                    <AiOutlineHeart size={16} className="text-white-smoke" />
                  )}
                </button>
                <span>{reply.numLikes}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentList({
  trackId,
  comments,
  total,
  loading,
  loadComments,
  loadMore,
  toggleLike,
  submitComment,
  postReply,
  deleteCommentById,
}: CommentListProps) {
  const router = useRouter();
  const hasMore = comments.length < total;
  const [sortBy, setSortBy] = useState<SortOption>("Newest");

  const sortedComments = useMemo(() => {
    const copy = [...comments];
    switch (sortBy) {
      case "Newest":
        return copy.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "Oldest":
        return copy.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "Track Time":
        return copy.sort((a, b) => a.timestamp - b.timestamp);
      default:
        return copy;
    }
  }, [comments, sortBy]);

  return (
    <div className="flex flex-col w-full mt-4">
      <div className="flex items-center justify-between mb-6 w-full">
        <h2 className="text-white-smoke font-bold text-lg whitespace-nowrap">
          {total.toLocaleString()} comments
        </h2>
        <SortDropdown value={sortBy} onChange={setSortBy} />
      </div>

      <div className="flex flex-col divide-y divide-white-smoke/10">
        {sortedComments.map((comment) => (
          <div key={comment.commentId} className="flex gap-4 py-5">
            <Avatar src={comment.avatarUrl || undefined} size={48} style={{ flexShrink: 0 }} />

            <div className="flex flex-col flex-1 gap-1">
              <div className="flex items-center gap-1 text-sm">
                <span className="font-bold text-white-smoke">
                  {comment.isOwnComment ? "You" : comment.displayName}
                </span>
                <span>at</span>
                <span className="text-[#888888] font-bold">
                  {formatTimestamp(comment.timestamp)}
                </span>
                <span className="text-[#888888]">·</span>
                <span className="text-[#888888]">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>

              <p className="text-white-smoke text-sm">
                {renderMentionContent(
                  comment.content,
                  router,
                  comment.mentionedUserId ?? undefined
                )}
              </p>

              <ReplySection
                comment={comment}
                trackId={trackId}
                postReply={postReply}
                onDeleteComment={deleteCommentById}
              />
            </div>

            <div className="flex flex-col items-center gap-1 text-silver text-sm">
              <button
                onClick={() => toggleLike(comment.commentId)}
                className="hover:text-white-smoke transition cursor-pointer"
              >
                {comment.isLikedByUser ? (
                  <AiFillHeart size={18} className="text-red-500" />
                ) : (
                  <AiOutlineHeart size={18} className="text-white-smoke" />
                )}
              </button>
              <span>{comment.numLikes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
