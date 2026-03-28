"use client";

import { useState, useEffect } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { useDeleteAccount } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { handleDeleteAccount, isLoading, error } = useDeleteAccount();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 20);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      setConfirmed(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const onSuccess = () => {
    onClose();
    router.push("/");
  };

  return (
    <div
      className={`fixed inset-0 z-1001 flex items-start sm:items-center justify-center overflow-y-auto p-4 sm:p-0 bg-login transition-opacity duration-500 ease-in-out ${
        animate ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative mt-6 sm:mt-0 w-full max-w-110 max-h-[95vh] overflow-y-auto pb-10 p-6 sm:p-8 bg-chinese-black text-white-smoke shadow-2xl border rounded border-white/10 transform transition-transform duration-500 ${
          animate ? "translate-y-0" : "-translate-y-[150vh]"
        }`}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <IoWarningOutline size={28} className="text-red-500 shrink-0" />
            <h2 className="text-xl font-bold">Delete Account</h2>
          </div>

          <p className="text-silver text-sm leading-relaxed">
            Are you sure you want to permanently delete your account? This action{" "}
            <span className="text-white-smoke font-semibold">cannot be undone</span> and will
            immediately remove:
          </p>

          <ul className="text-silver text-sm space-y-1 list-disc list-inside">
            <li>Your profile and all account information</li>
            <li>All uploaded tracks and audio content</li>
            <li>All comments, likes, and reposts</li>
            <li>Your followers and following lists</li>
            <li>All stats and listening history</li>
          </ul>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 accent-red-500 cursor-pointer"
            />
            <span className="text-silver text-xs leading-relaxed group-hover:text-white-smoke transition-colors">
              Yes, I understand this is permanent and want to delete my account and all my tracks,
              comments and stats.
            </span>
          </label>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={onClose}
              disabled={isLoading}
              className="text-silver hover:text-white-smoke bg-off-black disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteAccount(onSuccess)}
              disabled={!confirmed || isLoading}
              className="text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? "Deleting..." : "Delete my account"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}