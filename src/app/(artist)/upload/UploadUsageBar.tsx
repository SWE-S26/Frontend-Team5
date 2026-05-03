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
    <div
      className={`rounded-md border border-off-black bg-chinese-black px-4 py-3 ${className}`.trim()}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex h-12 w-5 items-center justify-center text-[10px] text-silver">
            <CloudUploadOutlined style={{ fontSize: "24px" }} />
          </div>
          <span className="text-[13px] font-semibold text-white-smoke">
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
            <div className="relative h-1 w-full rounded-full bg-off-black sm:flex-1 md:min-w-48">
              <div
                className="absolute left-0 top-0 h-1 rounded-full bg-white-smoke transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          )}
          <span className="text-[13px] font-semibold text-white-smoke sm:whitespace-nowrap">
            {!isArtistPro && `${Math.round(usedTracks)} of ${totalTracks} tracks`}
          </span>
        </div>

        {!isArtistPro && (
          <button
            className="w-full rounded-full border border-silver/30 bg-chinese-black px-5 py-1.5 text-[13px] font-semibold text-white-smoke transition-colors hover:opacity-90 cursor-pointer sm:w-fit"
            type="button"
            onClick={onUpgradeClick}
            data-testid="upload-usage-upgrade"
          >
            Get unlimited uploads
          </button>
        )}
      </div>
    </div>
  );
}
