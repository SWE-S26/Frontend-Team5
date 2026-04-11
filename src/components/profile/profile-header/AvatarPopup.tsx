"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/store/hooks"


interface AvatarPopupProps {
  isOpen:   boolean;
  onCancel: () => void;
}

export default function AvatarPopup({ isOpen, onCancel }: AvatarPopupProps) {


   const displayName    = useAppSelector((state) => state.profile.displayName)

   const profileImgLink = useAppSelector((state) => state.profile.profileImgLink)

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-white/30 z-[1001] flex items-start pt-25 justify-center"
          onClick={onCancel}
        >
          <button data-testid="cancel-button-popup"
            className="fixed top-4 right-4 text-white text-2xl font-bold bg-off-black rounded-full w-11 h-11 flex items-center justify-center z-[1002] hover:text-silver cursor-pointer"
            onClick={onCancel}
          >
            ✕
          </button>

          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col w-110  p-6 bg-black rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xl text-white-smoke font-bold mb-1">
               {displayName}
            </p>

            {profileImgLink && (
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={profileImgLink}
                  alt={displayName || "Avatar"}
                  className="w-full h-full object-cover"
                />
              </div>
              )}

           

            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
