"use client";

import { CloseOutlined } from "@ant-design/icons";

interface QuitModalProps {
  showQuitModal: boolean;
  onClose: () => void;
  onQuit: () => void;
}

export function QuitModal({ showQuitModal, onClose, onQuit }: QuitModalProps) {
  if (!showQuitModal) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center bg-login px-4">
      <div className="relative w-full max-w-105 rounded-lg bg-chinese-black border border-off-black p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          data-testid="upload-quit-close"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-off-black text-silver transition-colors hover:bg-back cursor-pointer"
          aria-label="Cancel quit"
        >
          <CloseOutlined className="text-[14px]" />
        </button>
        <h2 className="text-[16px] font-bold text-white-smoke pr-10">
          Are you sure you want to quit?
        </h2>
        <p className="mt-3 text-[13px] text-silver">Your changes will not be saved.</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            data-testid="upload-quit-back"
            className="px-4 py-2 text-[13px] font-semibold text-white-smoke rounded transition-colors hover:bg-off-black cursor-pointer"
          >
            Back to upload
          </button>
          <button
            type="button"
            onClick={onQuit}
            data-testid="upload-quit-confirm"
            className="rounded-full bg-[#f25870] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#ff6b81] cursor-pointer"
          >
            Quit upload
          </button>
        </div>
      </div>
    </div>
  );
}
