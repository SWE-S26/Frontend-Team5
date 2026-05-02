import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import ReportReasonPopUp from "./ReportReasonPopUp";

type TrackReasonKey =
  | "copyright"
  | "privacy"
  | "pornographic"
  | "abuse"
  | "hate_speech"
  | "illegal"
  | "wrong_profile"
  | "other";

interface ReasonConfig {
  label: string;
  reason: string;
  description: string[];
}

const TRACK_REASONS: Record<TrackReasonKey, ReasonConfig> = {
  copyright: {
    label: "Copyright infringement",
    reason: "copyright infringement",
    description: [
      "Flags this track for using copyrighted material without permission",
      "Our team will review and take appropriate action",
    ],
  },
  privacy: {
    label: "Privacy violation",
    reason: "privacy violation",
    description: [
      "Flags this track for violating someone's privacy",
      "Our team will review and take appropriate action",
    ],
  },
  pornographic: {
    label: "Pornographic content",
    reason: "pornographic content",
    description: [
      "Flags this track for containing explicit or pornographic content",
      "Our team will review and take appropriate action",
    ],
  },
  abuse: {
    label: "Abuse",
    reason: "abuse",
    description: [
      "Flags this track for abusive or harmful content",
      "Our team will review and take appropriate action",
    ],
  },
  hate_speech: {
    label: "Hate speech",
    reason: "hate speech",
    description: [
      "Flags this track for containing hate speech or discriminatory content",
      "Our team will review and take appropriate action",
    ],
  },
  illegal: {
    label: "Illegal content",
    reason: "illegal content",
    description: [
      "Flags this track for containing illegal content",
      "Our team will review and take appropriate action",
    ],
  },
  wrong_profile: {
    label: "Content appears on wrong profile",
    reason: "content appears on wrong profile",
    description: [
      "Flags this track as appearing on the wrong profile",
      "Our team will review and take appropriate action",
    ],
  },
  other: {
    label: "Other",
    reason: "other",
    description: [
      "Flags this track for a reason not listed above",
      "Our team will review and take appropriate action",
    ],
  },
};

interface TrackReportPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle: string;
  violatorId: string;
}

const TrackReportPopUp = ({
  isOpen,
  onClose,
  trackTitle,
  violatorId,
}: TrackReportPopUpProps) => {
  const [activeReason, setActiveReason] = useState<TrackReasonKey | null>(null);

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
              <h2 className="text-2xl text-white-smoke font-bold mb-6">
                Report track for
              </h2>

              <div className="flex flex-col gap-2 mb-10 ml-4">
                {(Object.keys(TRACK_REASONS) as TrackReasonKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveReason(key)}
                    className="text-blue-400 hover:underline text-sm w-fit cursor-pointer"
                  >
                    {TRACK_REASONS[key].label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-white-smoke font-bold text-md">Disclaimer</p>
                <p className="text-white-smoke text-[13px]">
                  Reported tracks are reviewed by a specialist team who take
                  action if the content violates our{" "}
                  <Link href="/legal" className="text-blue-400 hover:underline">
                    Guidelines
                  </Link>{" "}
                  or{" "}
                  <Link href="/legal" className="text-blue-400 hover:underline">
                    Terms
                  </Link>
                  . Repeated violation or serious breaches can result in the
                  permanent deletion of accounts.
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
          username={trackTitle}
          violatorId={violatorId}
          violatorType="track"
          reason={TRACK_REASONS[activeReason].reason}
          reasonLabel={TRACK_REASONS[activeReason].label}
          description={TRACK_REASONS[activeReason].description}
        />
      )}
    </>
  );
};

export default TrackReportPopUp;