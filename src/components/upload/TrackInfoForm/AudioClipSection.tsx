"use client";

import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { RxSpeakerLoud } from "react-icons/rx";
import { FaPause } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";

interface AudioClipSectionProps {
  expanded: boolean;
  onToggle: () => void;
  COLLAPSIBLE_MOTION_PROPS: any;
  baseWaveformBars: React.ReactNode[];
  leftMaskedWaveformBars: React.ReactNode[];
  canSetAudioPreview: boolean;
  clipLeftPercent: number;
  rightShadePercent: number;
  clipTrackRef: React.RefObject<HTMLDivElement | null>;
  clipSelectionRef: React.RefObject<HTMLDivElement | null>;
  clipLeftShadeRef: React.RefObject<HTMLDivElement | null>;
  clipLeftShadeWaveRef: React.RefObject<HTMLDivElement | null>;
  clipRightShadeRef: React.RefObject<HTMLDivElement | null>;
  isDraggingClip: boolean;
  clipWidthPercent: number;
  handleClipDragStart: (event: React.PointerEvent<HTMLDivElement>) => void;
  isClipWindowAtZeroStart: boolean;
  clipPlaybackOverlayPercent: number;
  handleClipPlayPause: () => Promise<void>;
  isClipPlaying: boolean;
  showClipResetButton: boolean;
  handleClipReset: () => void;
  formatTimeLabel: (seconds: number) => string;
  clipDragDisplayRange: { start: number; end: number } | null;
  safeClipStart: number;
  safeClipEnd: number;
  audioClipStartDraft: string;
  setAudioClipStartDraft: React.Dispatch<React.SetStateAction<string>>;
  applyTypedClipTime: (target: "start" | "end") => Promise<void>;
  audioClipEndDraft: string;
  setAudioClipEndDraft: React.Dispatch<React.SetStateAction<string>>;
}

export function AudioClipSection({
  expanded,
  onToggle,
  COLLAPSIBLE_MOTION_PROPS,
  baseWaveformBars,
  leftMaskedWaveformBars,
  canSetAudioPreview,
  clipLeftPercent,
  rightShadePercent,
  clipTrackRef,
  clipSelectionRef,
  clipLeftShadeRef,
  clipLeftShadeWaveRef,
  clipRightShadeRef,
  isDraggingClip,
  clipWidthPercent,
  handleClipDragStart,
  isClipWindowAtZeroStart,
  clipPlaybackOverlayPercent,
  handleClipPlayPause,
  isClipPlaying,
  showClipResetButton,
  handleClipReset,
  formatTimeLabel,
  clipDragDisplayRange,
  safeClipStart,
  safeClipEnd,
  audioClipStartDraft,
  setAudioClipStartDraft,
  applyTypedClipTime,
  audioClipEndDraft,
  setAudioClipEndDraft,
}: AudioClipSectionProps) {
  return (
    <>
      <button
        onClick={onToggle}
        data-testid="upload-clip-toggle"
        className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <span className="mt-1 pb-2 flex h-5 w-5 shrink-0 items-center justify-center text-white-smoke">
            <RxSpeakerLoud className="mt-1 text-[20px]" />
          </span>
          <div>
            <p className="text-[17px] font-semibold text-white-smoke">Audio clip</p>
            <p className="text-[14px] text-white-smoke mt-0.5">
              Pick the 20 second clip you&apos;d like to use as your track preview. This will live
              on your feed and socials.
            </p>
          </div>
        </div>
        {expanded ? (
          <UpOutlined className="text-[13px] text-white-smoke" />
        ) : (
          <DownOutlined className="text-[13px] text-white-smoke" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div key="audio-clip" {...COLLAPSIBLE_MOTION_PROPS}>
            <div className="py-4">
              <div className="relative overflow-hidden bg-chinese-black">
                <div className="relative h-28 px-1.5 pt-3 sm:h-30 sm:px-2 sm:pt-6">
                  <div className="pointer-events-none absolute inset-0 opacity-85">
                    <div className="flex h-full w-full items-center gap-px px-1">
                      {baseWaveformBars}
                    </div>
                  </div>
                  <div className="pointer-events-none absolute bottom-0 left-1 right-1 top-1/2 bg-chinese-black/38" />
                  <div className="pointer-events-none absolute left-1 right-1 top-1/2 z-10 h-0.5 -translate-y-1/2 bg-chinese-black/80 shadow-[0_0_6px_rgba(0,0,0,0.35)]" />

                  {!canSetAudioPreview ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-chinese-black/55">
                      <p className="px-4 text-center text-[14px] font-semibold leading-tight text-white/85 sm:text-[22px]">
                        Can&apos;t set audio preview, because this track is shorter than preview
                        time.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        ref={clipLeftShadeRef}
                        className="pointer-events-none absolute inset-y-0 left-1 overflow-hidden"
                        style={{ width: `${clipLeftPercent}%` }}
                      >
                        <div
                          ref={clipLeftShadeWaveRef}
                          className="flex h-full items-center gap-px px-1"
                        >
                          {leftMaskedWaveformBars}
                        </div>
                      </div>

                      <div
                        ref={clipRightShadeRef}
                        className="pointer-events-none absolute inset-y-0 right-0"
                        style={{ width: `${rightShadePercent}%` }}
                      />

                      <div ref={clipTrackRef} className="absolute inset-y-0 left-1 right-1">
                        <div
                          ref={clipSelectionRef}
                          className={`absolute inset-y-0 z-30 cursor-grab overflow-hidden rounded-sm border border-white bg-transparent isolate will-change-transform ${isDraggingClip ? "cursor-grabbing" : ""}`}
                          style={{
                            left: `${clipLeftPercent}%`,
                            width: `${clipWidthPercent}%`,
                            touchAction: "none",
                            transform: "translate3d(0px, 0, 0)",
                          }}
                          onPointerDown={handleClipDragStart}
                        >
                          <div
                            className="pointer-events-none absolute inset-px z-0 rounded-sm"
                            style={{
                              backgroundColor: isClipWindowAtZeroStart
                                ? "var(--waveform-window-fill-zero)"
                                : "var(--waveform-window-fill)",
                            }}
                          />
                          <div className="pointer-events-none absolute inset-px z-5 overflow-hidden rounded-sm">
                            <div className="flex h-full w-full items-center gap-px px-1">
                              {baseWaveformBars}
                            </div>
                          </div>
                          <div
                            className="pointer-events-none absolute bottom-px left-px top-px z-10 overflow-hidden rounded-l-sm"
                            style={{
                              backgroundColor: "var(--waveform-playback-mask)",
                              width: `${clipPlaybackOverlayPercent}%`,
                            }}
                          >
                            <div className="h-full w-full" />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleClipPlayPause();
                            }}
                            data-testid="upload-clip-play-toggle"
                            data-clip-control="true"
                            className="absolute left-1/2 top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white-smoke text-chinese-black shadow-lg cursor-pointer"
                            aria-label={isClipPlaying ? "Pause clip preview" : "Play clip preview"}
                          >
                            {isClipPlaying ? (
                              <FaPause className="text-[16px] sm:text-[20px]" />
                            ) : (
                              <FaPlay className="text-[16px] sm:text-[20px]" />
                            )}
                          </button>
                          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-2 bg-white-smoke sm:h-3" />
                          <div className="pointer-events-none absolute inset-0 z-30 rounded-sm border border-white-smoke" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-end justify-between border-t border-[#2a2a2a] px-2 pb-2 pt-2 sm:px-4 sm:pb-3">
                  <div className="flex min-w-14 flex-col gap-1 sm:min-w-16 sm:gap-1.5">
                    <input
                      value={
                        isDraggingClip
                          ? formatTimeLabel(clipDragDisplayRange?.start ?? safeClipStart)
                          : audioClipStartDraft
                      }
                      onChange={(e) => setAudioClipStartDraft(e.target.value)}
                      onBlur={() => void applyTypedClipTime("start")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void applyTypedClipTime("start");
                        }
                      }}
                      data-testid="upload-clip-start"
                      className="w-14 bg-transparent text-[16px] font-semibold leading-none text-white-smoke outline-none sm:w-18 sm:text-[22px]"
                      aria-label="Audio clip start time"
                    />
                    <span className="h-px w-10 bg-[#4a4a4a] sm:w-12" />
                  </div>

                  <div className="flex flex-col items-center justify-end gap-1 sm:gap-1.5">
                    {showClipResetButton ? (
                      <button
                        type="button"
                        onClick={handleClipReset}
                        data-testid="upload-clip-reset"
                        className="rounded border border-white-smoke/30 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white-smoke hover:border-white-smoke hover:bg-white-smoke/10 cursor-pointer"
                      >
                        Reset
                      </button>
                    ) : (
                      <div className="h-5.75" />
                    )}
                  </div>

                  <div className="flex min-w-14 flex-col items-end gap-1 sm:min-w-16 sm:gap-1.5">
                    <input
                      value={
                        isDraggingClip
                          ? formatTimeLabel(clipDragDisplayRange?.end ?? safeClipEnd)
                          : audioClipEndDraft
                      }
                      onChange={(e) => setAudioClipEndDraft(e.target.value)}
                      onBlur={() => void applyTypedClipTime("end")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void applyTypedClipTime("end");
                        }
                      }}
                      data-testid="upload-clip-end"
                      className="w-14 bg-transparent text-right text-[16px] font-semibold leading-none text-white-smoke outline-none sm:w-18 sm:text-[22px]"
                      aria-label="Audio clip end time"
                    />
                    <span className="h-px w-10 bg-[#4a4a4a] sm:w-12" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
