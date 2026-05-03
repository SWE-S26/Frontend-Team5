import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import ReportReasonPopUp from "./ReportReasonPopUp";

type ReasonKey = "spam" | "impersonation" | "abuse" | "trademark";

interface ReasonConfig {
  label: string;
  reason: string;
  description: string[];
}

const REASONS: Record<ReasonKey, ReasonConfig> = {
  spam: {
    label: "Spam",
    reason: "spam",
    description: [
      "Removes their comments, reposts and likes from your tracks and playlists",
      "Blocks them from interacting with you",
      "Sends Beatza a spam report",
    ],
  },
  impersonation: {
    label: "Impersonation",
    reason: "impersonation",
    description: [
      "Flags this account for pretending to be someone else",
      "Our team will review and take appropriate action",
    ],
  },
  abuse: {
    label: "Abuse",
    reason: "abuse",
    description: [
      "Flags this account for abusive or harmful behavior",
      "Our team will review and take appropriate action",
    ],
  },
  trademark: {
    label: "Trademark infringement",
    reason: "trademark infringement",
    description: [
      "Flags this account for unauthorized use of a trademark",
      "Our team will review and take appropriate action",
    ],
  },
};

interface ReportPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  violatorId: string;
  violatorType: "user" | "track";
}

const ReportPopUp = ({
  isOpen,
  onClose,
  username,
  violatorId,
  violatorType,
}: ReportPopUpProps) => {
  const [activeReason, setActiveReason] = useState<ReasonKey | null>(null);

  const handleClose = () => {
    setActiveReason(null);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && !activeReason && (
          <div
            className="fixed inset-0 bg-white-smoke/30 z-1001 flex items-start pt-20 justify-center"
            onClick={handleClose}
          >
            <button
              className="fixed top-4 right-4 text-white-smoke text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center hover:text-silver cursor-pointer z-1002"
              onClick={handleClose}
            >
              <IoClose size={16} />
            </button>
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col w-160 p-6 bg-chinese-black rounded-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-white-smoke font-bold mb-6">Report account for</h2>

              <div className="flex flex-col gap-2 mb-10 ml-4">
                {(Object.keys(REASONS) as ReasonKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveReason(key)}
                    className="text-blue-400 hover:underline text-sm w-fit cursor-pointer"
                  >
                    {REASONS[key].label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-white-smoke font-bold text-md">Disclaimer</p>
                <p className="text-white-smoke text-[13px]">
                  Reported accounts are reviewed by a specialist team who take action if the
                  account's content or activity violates our{" "}
                  <Link href="/legal" className="text-blue-400 hover:underline">
                    Guidelines
                  </Link>{" "}
                  or{" "}
                  <Link href="/legal" className="text-blue-400 hover:underline">
                    Terms
                  </Link>
                  . Repeated violation or serious breaches can result in the permanent deletion of
                  accounts.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {activeReason && (
        <ReportReasonPopUp
          isOpen={!!activeReason}
          onClose={handleClose}
          username={username}
          violatorId={violatorId}
          violatorType={violatorType}
          reason={REASONS[activeReason].reason}
          reasonLabel={REASONS[activeReason].label}
          description={REASONS[activeReason].description}
        />
      )}
    </>
  );
};

export default ReportPopUp;