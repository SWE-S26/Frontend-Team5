"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import Button from "@/components/ui/Button";
import BlockPopUp from "./BlockPopUp";
import ReportPopUp from "@/components/report/ReportPopUp";
import ArchivePopUp from "./ArchivePopUp";
import { useMessagesContext } from "@/components/messages/MessagesContext";
import { useBlockUser, useUnblockUser } from "@/hooks/useSocial";

interface ConversationHeaderProps {
  displayName: string;
  chatId: string;
  receiverId: string;
  isUnread: boolean;
  initialIsBlocked: boolean;
  markAsUnread: (chatId: string) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  onBack?: () => void;
}

const ConversationHeader = ({
  displayName,
  chatId,
  receiverId,
  isUnread,
  initialIsBlocked,
  markAsUnread,
  markAsRead,
  onBack,
}: ConversationHeaderProps) => {
  const { archiveConversation } = useMessagesContext();
  const { blockUser, loading: blockLoading } = useBlockUser();
  const { unblockUser, loading: unblockLoading } = useUnblockUser();

  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
  const [openBlock, setOpenBlock] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openArchive, setOpenArchive] = useState(false);

  useEffect(() => {
    setIsBlocked(initialIsBlocked);
  }, [initialIsBlocked]);

  const handleBlock = async () => {
    await blockUser(receiverId);
    setIsBlocked(true);
    setOpenBlock(false);
  };

  const handleUnblock = async () => {
    await unblockUser(receiverId);
    setIsBlocked(false);
  };

  const handleArchiveConfirm = async () => {
    setOpenArchive(false);
    await archiveConversation(chatId);
  };

  return (
    <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {onBack && (
          <Button onClick={onBack} className="bg-off-black text-white-smoke md:hidden">
            Back
          </Button>
        )}
        <Link
          href={`/profile/${receiverId}`}
          className="text-md font-bold text-white-smoke px-2 py-2 hover:text-silver"
        >
          {displayName}
        </Link>

        <Button
          onClick={() => (isBlocked ? handleUnblock() : setOpenBlock(true))}
          disabled={blockLoading || unblockLoading}
          className={isBlocked ? "text-crusta bg-chinese-black" : "bg-chinese-black"}
        >
          {isBlocked ? "Blocked" : "Block"}
        </Button>

        <Button onClick={() => setOpenReport(true)} className="bg-chinese-black">
          Report
        </Button>
      </div>

      <BlockPopUp
        isOpen={openBlock}
        onClose={() => setOpenBlock(false)}
        username={displayName}
        onConfirm={handleBlock}
      />
      <ReportPopUp
        isOpen={openReport}
        onClose={() => setOpenReport(false)}
        username={displayName}
        violatorId={receiverId}
        violatorType="user"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          className="font-bold bg-off-black"
          onClick={() => (isUnread ? markAsRead(chatId) : markAsUnread(chatId))}
        >
          {isUnread ? "Mark as read" : "Mark as unread"}
        </Button>

        {/* Relative wrapper so ArchivePopUp positions itself under this button */}
        <div className="relative">
          <button
            className={`flex items-center justify-center bg-off-black rounded-md h-8 w-10 transition-colors relative group/delete ${
              openArchive ? "text-crusta" : "text-white hover:text-silver"
            }`}
            onClick={() => setOpenArchive((prev) => !prev)}
          >
            <FaRegTrashCan size={14} className="cursor-pointer" />
            {!openArchive && (
              <div className="absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 bg-off-black text-white text-[8px] font-medium px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/delete:opacity-100 transition-opacity pointer-events-none">
                Archive this conversation
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-off-black rotate-45" />
              </div>
            )}
          </button>

          <ArchivePopUp
            isOpen={openArchive}
            onClose={() => setOpenArchive(false)}
            onConfirm={handleArchiveConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
