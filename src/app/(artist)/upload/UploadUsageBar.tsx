"use client";

import { CloudUploadOutlined } from "@ant-design/icons";

type UploadUsageBarProps = {
  usedTracks: number;
  totalTracks: number;
  usagePercent: number;
  isArtistPro: boolean;
  onUpgradeClick?: () => void;
  className?: string;
};

export default function UploadUsageBar({
  usedTracks,
  totalTracks,
  usagePercent,
  isArtistPro,
  onUpgradeClick,
  className = "",
}: UploadUsageBarProps) {
  return (
    <div className={`rounded-md border border-[#27272d] bg-[#212121] px-4 py-3 ${className}`.trim()}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex h-12 w-5 items-center justify-center text-[10px] text-[#dadadd]">
            <CloudUploadOutlined style={{ fontSize: "24px" }} />
          </div>
          <span className="text-[13px] font-semibold text-[#f1f1f1]">
            {isArtistPro ? (
              <>
                Artist Pro{" "}
                <img
                  src="payment/pro-badge.svg"
                  alt="pro badge"
                  className="inline-block w-4 h-4 mx-1"
                />
                Unlimited uploads
              </>
            ) : (
              `${Math.round(usagePercent)}% of uploads used`
            )}
          </span>
          {!isArtistPro && (
            <div className="relative h-1 w-full rounded-full bg-[#3f4047] sm:flex-1 md:min-w-48">
              <div
                className="absolute left-0 top-0 h-1 rounded-full bg-white transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          )}
          <span className="text-[13px] font-semibold text-[#f1f1f1] sm:whitespace-nowrap">
            {!isArtistPro && `${Math.round(usedTracks)} of ${totalTracks} tracks`}
          </span>
        </div>

        {!isArtistPro && (
          <button
            className="w-full rounded-full border border-silver/30 bg-chinese-black px-5 py-1.5 text-[13px] font-semibold text-white-smoke transition-colors hover:opacity-90 cursor-pointer sm:w-fit"
            type="button"
            onClick={onUpgradeClick}
          >
            Get unlimited uploads
          </button>
        )}
      </div>
    </div>
  );
}