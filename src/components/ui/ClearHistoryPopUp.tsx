import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

interface ClearHistoryPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ClearHistoryPopUp = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: ClearHistoryPopUpProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          {/* Popover — positions itself below the trigger button */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed left-3 right-3 top-20 z-50 w-auto p-5 bg-chinese-black rounded-md shadow-2xl border border-white-smoke/20 sm:absolute sm:right-0 sm:left-auto sm:top-10 sm:w-82"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow pointing up toward the button */}
            <div className="absolute -top-2 right-3 hidden h-4 w-4 bg-chinese-black rotate-45 sm:block" />

            <p className="text-white-smoke text-xs mb-5 leading-snug">
              Are you sure you want to clear your entire listening history? You won&apos;t be able
              to undo this action.
            </p>

            <div className="flex justify-end gap-2">
              <Button onClick={onClose} className="bg-off-black text-white-smoke text-sm">
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={loading}
                className="bg-white-smoke text-chinese-black text-sm font-bold disabled:opacity-50"
              >
                {loading ? "Clearing..." : "Clear my history"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClearHistoryPopUp;
