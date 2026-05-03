"use client";

import { CloseOutlined } from "@ant-design/icons";

interface ProFeatureModalProps {
  showProFeatureModal: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function ProFeatureModal({ showProFeatureModal, onClose, onUpgrade }: ProFeatureModalProps) {
  if (!showProFeatureModal) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-login px-4">
      <div className="relative w-full max-w-105 rounded-lg bg-chinese-black border border-off-black p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          data-testid="upload-profeature-close"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-off-black text-silver transition-colors hover:bg-back cursor-pointer"
          aria-label="Close pro feature modal"
        >
          <CloseOutlined className="text-[14px]" />
        </button>
        <h2 className="pr-10 text-[16px] font-bold text-white-smoke">Artist Pro feature</h2>
        <p className="mt-3 text-[13px] text-silver">
          Follower Exclusive is available for Artist Pro accounts. Upgrade to unlock this option.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            data-testid="upload-profeature-maybe-later"
            className="px-4 py-2 text-[13px] font-semibold text-white-smoke rounded transition-colors hover:bg-off-black cursor-pointer"
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={onUpgrade}
            data-testid="upload-profeature-upgrade"
            className="rounded-full bg-[#f5a623] px-5 py-2 text-[13px] font-semibold text-chinese-black transition-colors hover:bg-[#ffc55a] cursor-pointer"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}
