"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  interactiveToast,
  interactiveToastBus,
} from "@/lib/interactive-toasts/interactiveToastBus";

import { FaCheckCircle } from "react-icons/fa";

type ToastItem = interactiveToast & {
  id: number;
};

export default function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const idRef = useRef(0);

  useEffect(() => {
    interactiveToastBus.register((data) => {
      const id = ++idRef.current;

      setToasts((prev) => [
        {
          ...data,
          id,
        },
        ...prev,
      ]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 8000);
    });

    return () => {
      interactiveToastBus.clear();
    };
  }, []);

  return (
    <div className="fixed top-20 right-4 z-9999 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          if (toast.type === "reposted") {
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -20, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center gap-3 bg-off-black border border-silver/30 rounded-md px-2 py-2 shadow-xl max-w-sm cursor-pointer w-fit"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              >
                <img
                  src={toast.image}
                  alt="artwork"
                  className="w-12 h-12 rounded object-cover shrink-0"
                />

                <div className="flex flex-col leading-tight mr-12">
                  <p className="text-white text-[13px] font-bold mb-1">{toast.name}</p>

                  <p className="text-silver text-[13px]">
                    was reposted to{" "}
                    <a href="#" className="text-white-smoke no-underline">
                      the feed
                    </a>
                    .
                  </p>
                </div>
              </motion.div>
            );
          }

          if (toast.type === "liked") {
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -20, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center gap-3 bg-off-black border border-silver/30 rounded-md px-2 py-2 shadow-xl max-w-sm cursor-pointer w-fit"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              >
                <img
                  src={toast.image}
                  alt="artwork"
                  className="w-12 h-12 rounded object-cover shrink-0"
                />

                <div className="flex flex-col leading-tight mr-12">
                  <p className="text-white text-[13px] font-bold mb-1">{toast.name}</p>
                  <p className="text-silver text-[13px]">
                    was saved to{" "}
                    <a href="#" className="text-white-smoke no-underline">
                      your Library
                    </a>
                    .
                  </p>{" "}
                </div>
              </motion.div>
            );
          }

          if (toast.type === "queued") {
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -20, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center gap-3 bg-off-black border border-silver/30 rounded-md px-2 py-2 shadow-xl max-w-sm cursor-pointer w-fit"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              >
                <img
                  src={toast.image}
                  alt="artwork"
                  className="w-12 h-12 rounded object-cover shrink-0"
                />

                <div className="flex flex-col leading-tight mr-12">
                  <p className="text-white text-[13px] font-bold mb-1">{toast.name}</p>
                  <p className="text-silver text-[13px]">
                    was added to{" "}
                    <a href="#" className="text-white-smoke no-underline">
                      Next Up
                    </a>
                    .
                  </p>{" "}
                </div>
              </motion.div>
            );
          }

          if (toast.type === "copied") {
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -20, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex w-fit items-center gap-3 bg-off-black border border-silver/30 rounded-md px-4 py-3 shadow-xl cursor-pointer"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              >
                <FaCheckCircle className="text-green-500 text-lg shrink-0" />

                <p className="text-white-smoke text-sm font-bold leading-snug">
                  Link has been copied to the clipboard!
                </p>
              </motion.div>
            );
          }
        })}
      </AnimatePresence>
    </div>
  );
}
