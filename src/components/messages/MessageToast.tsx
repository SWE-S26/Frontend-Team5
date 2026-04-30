"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  messageToastBus,
  MessageToastData,
} from "@/lib/sockets/messageToastBus";
import { MdErrorOutline } from "react-icons/md";

export default function MessageToast() {
  const [toast, setToast] = useState<MessageToastData | null>(null);

  useEffect(() => {
    messageToastBus.register((data) => {
      setToast(data);
      setTimeout(() => setToast(null), 4000);
    });
    return () => messageToastBus.clear();
  }, []);

  if (!toast) return null;

  // ── Error toast ────────────────────────────────────────────────────────────
  if (toast.type === "error") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-20 right-4 z-[9999] flex items-center gap-3 bg-off-black border border-red-500/30 rounded-md px-4 py-3 shadow-xl max-w-xs cursor-pointer"
          onClick={() => setToast(null)}
        >
          <MdErrorOutline className="text-red-500 text-xl shrink-0" />
          <p className="text-white-smoke text-sm font-bold leading-snug">
            {toast.message}
          </p>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Sent / Received toast ──────────────────────────────────────────────────
  const photoUrl =
    toast.type === "sent" ? toast.recipientPhoto : toast.senderPhoto;
  const text =
    toast.type === "sent"
      ? `Your message to ${toast.recipientName} was sent successfully`
      : `New message from ${toast.senderName}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-20 right-4 z-[9999] flex items-center gap-3 bg-off-black border border-white/10 rounded-md px-4 py-3 shadow-xl max-w-xs cursor-pointer"
        onClick={() => setToast(null)}
      >
        <img
          src={photoUrl || "/profpic.jpg"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <p className="text-white-smoke text-sm font-bold leading-snug">
          {text}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
