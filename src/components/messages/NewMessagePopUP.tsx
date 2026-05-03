"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useSendMessage } from "@/hooks/sockets/useMessaging";
import { messageToastBus } from "@/lib/sockets/messageToastBus";
import { messageLocalBus } from "@/lib/sockets/messageLocalBus";
import { useSearch } from "@/hooks/useSearch";
import { useGetProfile } from "@/hooks/useProfile";
import useDebounce from "@/hooks/useDebounce";
import Button from "@/components/ui/Button";
import { useMessagesContext } from "@/components/messages/MessagesContext";
import { useAppSelector } from "@/store/hooks";

interface PrefilledUser {
  userId: string;
  displayName: string;
  photoUrl: string;
}

interface NewMessagePopUPProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledUser?: PrefilledUser;
  onSent?: (chatId: string) => void;
}

type SearchStatus = "idle" | "searching" | "found" | "not_found";

// ── Each suggestion item resolves its own profile photo via useGetProfile ──
// Same pattern WaveformCard uses for artistId
interface UserSuggestionItemProps {
  userId: string;
  displayName: string;
  onClick: (user: PrefilledUser) => void;
}

function UserSuggestionItem({ userId, displayName, onClick }: UserSuggestionItemProps) {
  const { getProfile, profile } = useGetProfile();

  useEffect(() => {
    if (userId) getProfile(userId);
  }, [userId]);

  const photoUrl = profile?.profileImgLink ?? "/profpic.jpg";

  const handleClick = () => {
    onClick({ userId, displayName, photoUrl });
  };

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // prevent input blur before click fires
      onClick={handleClick}
      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-off-black transition-colors text-left"
    >
      <img
        src={photoUrl}
        alt={displayName}
        className="w-8 h-8 rounded-full object-cover shrink-0"
      />
      <span className="text-sm text-white-smoke font-bold">{displayName}</span>
    </button>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

const NewMessagePopUP = ({ isOpen, onClose, prefilledUser, onSent }: NewMessagePopUPProps) => {
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState<PrefilledUser | null>(prefilledUser ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<{ userId: string; displayName: string }[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");

  const debouncedQuery = useDebounce(searchQuery, 350);
  const { getSuggestions } = useSearch();
  const searchRef = useRef<HTMLDivElement>(null);
  const { updateFromLocalSend, conversations } = useMessagesContext();
  const currentUserId = useAppSelector((state) => state.auth.userId) ?? "";

  // Sync every time the popup opens (unchanged)
  useEffect(() => {
    if (isOpen) {
      setRecipient(prefilledUser ?? null);
      setContent("");
      setSearchQuery("");
      setResults([]);
      setStatus("idle");
    }
  }, [isOpen, prefilledUser?.userId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) {
        setStatus((s) => (s === "found" ? "idle" : s));
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Search when debounced query settles
  useEffect(() => {
    if (recipient) return;
    if (!debouncedQuery.trim()) {
      setStatus("idle");
      setResults([]);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setStatus("searching");
      try {
        const body = await getSuggestions(debouncedQuery);
        if (cancelled) return;

        const raw = Array.isArray(body) ? body : [];

        // Filter to user-type items and map to minimal shape
        // Photo is NOT extracted here — UserSuggestionItem fetches it via useGetProfile
        const users = raw
          .filter((item: any) => {
            const t = String(item.type ?? "").toLowerCase();
            return t === "user" || t === "users";
          })
          .map((item: any) => ({
            userId: String(item.id ?? item._id ?? ""),
            displayName: String(item.title ?? item.displayName ?? ""),
          }))
          .filter((u) => u.userId && u.displayName);

        if (cancelled) return;
        if (users.length > 0) {
          setResults(users);
          setStatus("found");
        } else {
          setResults([]);
          setStatus("not_found");
        }
      } catch {
        if (!cancelled) setStatus("not_found");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, recipient, getSuggestions]);

  const handleSelectUser = useCallback((user: PrefilledUser) => {
    setRecipient(user);
    setSearchQuery("");
    setResults([]);
    setStatus("idle");
  }, []);

  const handleClearRecipient = useCallback(() => {
    setRecipient(null);
    setSearchQuery("");
    setStatus("idle");
  }, []);

  // Send logic — unchanged
  const { send, isSending } = useSendMessage(({ conversation }) => {
    updateFromLocalSend(conversation);
    onSent?.(conversation.chat);
    if (recipient) {
      messageToastBus.emit({
        type: "sent",
        recipientName: recipient.displayName,
        recipientPhoto: recipient.photoUrl,
      });
    }
    setContent("");
    setRecipient(null);
    onClose();
  });

  const handleSend = async () => {
    if (!recipient || !content.trim()) return;
    const trimmed = content.trim();
    const existingChatId = conversations.find((c) => c.receiverId === recipient.userId)?.chatId;

    const clientId = `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    if (existingChatId && currentUserId) {
      messageLocalBus.emit({
        type: "optimistic",
        chatId: existingChatId,
        clientId,
        message: {
          _id: clientId,
          chatId: existingChatId,
          senderId: currentUserId,
          content: trimmed,
          seenBy: [currentUserId],
          createdAt: new Date().toISOString(),
        },
      });
    }

    await send(recipient.userId, trimmed, {
      clientId,
      chatId: existingChatId,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white-smoke/30 z-1001 flex items-start pt-25 justify-center"
          onClick={onClose}
        >
          <button
            className="fixed top-4 right-4 text-white-smoke text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center hover:text-silver cursor-pointer z-1002"
            onClick={onClose}
          >
            <IoClose size={16} />
          </button>

          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-200 p-6 bg-chinese-black rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xl text-white-smoke font-bold mb-8">New message</p>

            {/* ── To field ── */}
            <div className="flex flex-col gap-2 mb-7">
              <p className="text-md font-bold text-white-smoke">
                To<span className="text-red-500">*</span>
              </p>

              {recipient ? (
                // Chip — shown when recipient is set (prefill from profile OR chosen from search)
                <div className="w-full min-h-12 bg-off-black px-3 py-2 rounded flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-chinese-black rounded px-2 py-1">
                    <img
                      src={recipient.photoUrl}
                      alt={recipient.displayName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-white-smoke text-sm font-bold">
                      {recipient.displayName}
                    </span>
                    <button
                      onClick={handleClearRecipient}
                      className="text-silver hover:text-white-smoke text-xs ml-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                // Search input + dropdown
                <div className="relative" ref={searchRef}>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Search for a user..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (status !== "searching") setStatus("idle");
                    }}
                    className={`w-full h-12 bg-off-black px-3 text-white-smoke text-sm rounded outline-none caret-crusta ring-1 transition-all duration-200 ${
                      status === "not_found" ? "ring-red-500" : "ring-transparent focus:ring-silver"
                    }`}
                  />

                  {/* Error — mutually exclusive with dropdown via status */}
                  {status === "not_found" && (
                    <p className="text-red-500 text-xs mt-1">User not found</p>
                  )}

                  {/* Dropdown — each item fetches its own photo via useGetProfile */}
                  {status === "found" && results.length > 0 && (
                    <ul className="absolute left-0 right-0 bg-chinese-black border border-off-black mt-1 rounded z-50 max-h-60 overflow-auto">
                      {results.map((user) => (
                        <li key={user.userId}>
                          <UserSuggestionItem
                            userId={user.userId}
                            displayName={user.displayName}
                            onClick={handleSelectUser}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* ── Message textarea — unchanged ── */}
            <div className="flex flex-col gap-3 mb-5">
              <p className="text-md font-bold text-white-smoke">
                Write your message and add tracks or playlists
                <span className="text-red-500">*</span>
              </p>
              <textarea
                className="w-full h-29 bg-off-black px-3 py-3 text-white-smoke rounded resize-y caret-crusta text-md"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSending}
              />
            </div>

            <div className="ml-auto">
              <Button
                onClick={handleSend}
                disabled={!recipient || !content.trim() || isSending}
                className="text-chinese-black text-sm bg-white-smoke disabled:opacity-50"
              >
                {isSending ? "Sending..." : "Send"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewMessagePopUP;
