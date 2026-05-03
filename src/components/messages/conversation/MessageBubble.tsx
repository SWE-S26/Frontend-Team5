import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import MessageLinkPreview from "@/components/messages/MessageLinkPreview";

interface MessageBubbleProps {
  avatarUrl: string;
  displayName: string;
  senderId: string;
  content: string;
  createdAt: string;
  isMe: boolean;
  myId: string;
}

const BEATZA_URL_RE = /(https:\/\/beatza\.me\/[^\s]+)/;

function renderContent(content: string) {
  const match = content.match(BEATZA_URL_RE);

  if (match) {
    const url = match[0];
    const parts = content.split(BEATZA_URL_RE);
    // parts = [text before url, url itself, text after url]
    // filter out the url and empty strings — keep only actual text
    const textParts = parts.filter((p) => p !== url && p.trim() !== "");

    return (
      <div className="flex flex-col gap-2">
        {textParts.map((part, i) => (
          <p key={i} className="text-sm text-silver wrap-break-word">
            {part.trim()}
          </p>
        ))}
        <MessageLinkPreview url={url} />
      </div>
    );
  }

  if (content.startsWith("http")) {
    // any non-beatza link — plain anchor, unchanged behaviour
    return (
      <a
        href={content}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-blue-400 hover:underline break-all"
      >
        {content}
      </a>
    );
  }

  // plain text — unchanged behaviour
  return <p className="text-sm text-silver wrap-break-word">{content}</p>;
}

const MessageBubble = ({
  avatarUrl,
  displayName,
  senderId,
  content,
  createdAt,
  isMe,
  myId,
}: MessageBubbleProps) => {
  const profileHref = `/profile/${isMe ? myId : senderId}`;

  return (
    <div className="flex gap-3 mb-8">
      <Link href={profileHref}>
        <img
          src={avatarUrl}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover shrink-0 hover:opacity-80 transition-opacity"
        />
      </Link>

      <div className="flex flex-col gap-1 min-w-0 w-full">
        <div className="flex justify-between gap-4">
          <Link
            href={profileHref}
            className="text-sm text-white-smoke font-bold hover:text-silver transition-colors"
          >
            {isMe ? "Me" : displayName}
          </Link>
          <p className="text-sm text-silver shrink-0">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>

        {renderContent(content)}
      </div>
    </div>
  );
};

export default MessageBubble;
