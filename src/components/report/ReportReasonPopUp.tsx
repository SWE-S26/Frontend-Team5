// src/components/report/ReportReasonPopUp.tsx

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Button from "@/components/ui/Button";
import { useSubmitReport } from "@/hooks/admin-dash/useSubmitReport";

interface ReportReasonPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  violatorId: string;
  violatorType: "user" | "track";
  reason: string;
  reasonLabel: string;
  description: string[];
}

const ReportReasonPopUp = ({
  isOpen,
  onClose,
  username,
  violatorId,
  violatorType,
  reason,
  reasonLabel,
  description,
}: ReportReasonPopUpProps) => {
  const { submitReport, loading, success, error } = useSubmitReport();

  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  const handleSubmit = async () => {
    await submitReport(violatorId, violatorType, reason);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white-smoke/30 z-1001 flex items-start pt-20 justify-center"
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
            className="flex flex-col w-160 p-5 px-8 bg-black rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <div className="flex flex-col gap-4">
                <p className="text-xl text-white-smoke font-bold">Report submitted</p>
                <p className="text-sm text-silver">
                  Thank you. Our team will review your report shortly.
                </p>
                <Button onClick={onClose} className="bg-white-smoke text-chinese-black ml-auto">
                  Close
                </Button>
              </div>
            ) : (
              <>
                <p className="text-xl text-white-smoke font-bold mb-6">
                  Report {reasonLabel}
                </p>
                <p className="text-sm text-white-smoke font-bold mb-2">
                  Reporting {username} for {reasonLabel.toLowerCase()}:
                </p>
                <ul className="list-disc list-inside text-white-smoke mb-5 ml-7 text-sm">
                  {description.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>

                {error && <p className="text-anger text-sm mb-3">{error}</p>}

                <div className="flex gap-2 ml-auto">
                  <Button onClick={onClose} className="bg-off-black">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-white-smoke text-chinese-black disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : `Report ${reasonLabel}`}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReportReasonPopUp;