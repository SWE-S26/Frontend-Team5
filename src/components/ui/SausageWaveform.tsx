"use client";

import React, { useEffect, useRef, useState } from "react";

export default function SausageWaveform({
  samplesUrl,
  externalProgress,
  onSeek,
  onPlay,
  isPlaying = false,
}: {
  samplesUrl: string;
  externalProgress?: number;
  onSeek?: (percentage: number) => void;
  onPlay?: (seekPercentage?: number) => void;
  isPlaying?: boolean;
}) {
  const scwRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [bgTop, setBgTop] = useState<string | null>(null);
  const [bgBottom, setBgBottom] = useState<string | null>(null);
  const [fgTopGradient, setFgTopGradient] = useState<string | null>(null);
  const [fgTopFlat, setFgTopFlat] = useState<string | null>(null);
  const [fgBottom, setFgBottom] = useState<string | null>(null);

  const [isHovering, setIsHovering] = useState(false);

  const [playbackStarted, setPlaybackStarted] = useState(false);

  // Click-preview state: flat top follows mouse, playback unaffected
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewPct, setPreviewPct] = useState<number | null>(null);

  // Drag state: immediate seek, gradient follows mouse, no flat top
  const [isDragging, setIsDragging] = useState(false);
  const [dragPct, setDragPct] = useState<number | null>(null);
  const dragEndedRef = useRef(false);

  const progress = externalProgress ?? 0;

  useEffect(() => {
    import("@/lib/waveform").then((mod) => {
      scwRef.current = mod.default;
      fetch(samplesUrl)
        .then((res) => res.json())
        .then((samples: number[]) => generateAll(samples));
    });
  }, [samplesUrl]);

  const generateAll = (samples: number[]) => {
    if (!scwRef.current) return;
    const base = {
      canvas_width: 1264,
      canvas_height: 120,
      bar_width: 8,
      bar_gap: 0.3,
    };
    scwRef.current.generateFromJson(samples, {
      ...base,
      wave_color: "#ffffff",
      half: "top",
      onComplete: (png: string) => setBgTop(png),
    });
    scwRef.current.generateFromJson(samples, {
      ...base,
      wave_color: "#e5e5e5",
      half: "bottom",
      onComplete: (png: string) => setBgBottom(png),
    });
    scwRef.current.generateFromJson(samples, {
      ...base,
      wave_color: "gradient",
      half: "top",
      onComplete: (png: string) => setFgTopGradient(png),
    });
    scwRef.current.generateFromJson(samples, {
      ...base,
      wave_color: "#faad87",
      half: "top",
      onComplete: (png: string) => setFgTopFlat(png),
    });
    scwRef.current.generateFromJson(samples, {
      ...base,
      wave_color: "#faad87",
      half: "bottom",
      onComplete: (png: string) => setFgBottom(png),
    });
  };

  const getPct = (e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    );
  };

  // Detect when mousedown becomes an actual drag
  const [isPendingDrag, setIsPendingDrag] = useState(false);

  // Global listeners activate on mousedown and stay active until mouseup
  useEffect(() => {
    if (!isPendingDrag) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const pct = getPct(e);
      // First move confirms this is a drag, not a click
      if (!isDragging) {
        setIsDragging(true);
        setIsPreviewing(false); // cancel any preview mode
        setPreviewPct(null);
        onPlay?.(pct); // Start playback at drag position if not playing
      }
      setDragPct(pct);
      onSeek?.(pct); // scrub audio as mouse moves
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      const pct = getPct(e);
      if (isDragging) {
        onSeek?.(pct); // final seek on release
        dragEndedRef.current = true;
      }
      setIsDragging(false);
      setIsPendingDrag(false);
      setDragPct(null);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isPendingDrag, isDragging, onSeek, onPlay]);

  // mousedown: prepare for drag, but don't commit to it yet
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const pct = getPct(e);
    setDragPct(pct);
    setIsPendingDrag(true); // Listeners will activate, waiting for mousemove to confirm drag
  };

  // click: if paused, seek and play; if playing, toggle preview mode
  const handleClick = (e: React.MouseEvent) => {
    // Suppress click if it was the result of a completed drag
    if (dragEndedRef.current) {
      dragEndedRef.current = false;
      return;
    }

    const pct = getPct(e);

    // If not playing, start playback at clicked position
    if (!isPlaying) {
      onPlay?.(pct); // Pass the percentage so it seeks after loading
      return;
    }

    // If already playing, toggle preview mode
    if (!isPreviewing) {
      // 1st click: enter preview mode
      setIsPreviewing(true);
      setPreviewPct(pct);
    } else {
      // 2nd click: seek to position, exit preview
      onSeek?.(pct);
      setIsPreviewing(false);
      setPreviewPct(null);
    }
  };

  // While in preview mode, flat top follows the mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPreviewing && !isDragging) {
      setPreviewPct(getPct(e));
    }
  };

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Leaving the waveform cancels preview mode
    setIsPreviewing(false);
    setPreviewPct(null);
  };

  // Gradient always shows real playback progress, never follows drag
  const gradientMaskPct = progress;

  // Bottom foreground also always shows real playback progress
  const bottomMaskPct = progress;

  const maskLeft = (pct: number) => ({
    WebkitMaskImage: `linear-gradient(to right, black ${pct}%, transparent ${pct}%)`,
    maskImage: `linear-gradient(to right, black ${pct}%, transparent ${pct}%)`,
  });

  const maskWindow = (from: number, to: number) => ({
    WebkitMaskImage: `linear-gradient(to right, transparent ${from}%, black ${from}%, black ${to}%, transparent ${to}%)`,
    maskImage: `linear-gradient(to right, transparent ${from}%, black ${from}%, black ${to}%, transparent ${to}%)`,
  });

  const imgFix = {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden" as const,
    imageRendering: "auto" as const,
    mixBlendMode: "normal" as const,
  };

  const waveformOpacity =
    isPlaying || isHovering ? "opacity-100" : "opacity-70";

  // Flat top window: only shown in preview mode (not during drag)
  const showFlatWindow = isPreviewing && previewPct !== null && !isDragging;

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[60px] cursor-pointer select-none isolate overflow-hidden"
      >
        {/* Background Top — z-0 */}
        <img
          src={bgTop ?? undefined}
          className={`absolute inset-0 w-full h-full grayscale waveform-img z-0 transition-opacity duration-150 ${waveformOpacity}`}
          style={imgFix}
          alt=""
        />

        {/* Background Bottom — z-0 */}
        <img
          src={bgBottom ?? undefined}
          className={`absolute inset-0 w-full h-full grayscale waveform-img z-0 transition-opacity duration-150 ${waveformOpacity}`}
          style={imgFix}
          alt=""
        />

        {/* Foreground Gradient top — z-10, follows drag or real progress */}
        <img
          src={fgTopGradient ?? undefined}
          className={`absolute inset-0 w-full h-full waveform-img z-10 transition-opacity duration-150 ${waveformOpacity}`}
          style={{ ...imgFix, ...maskLeft(gradientMaskPct) }}
          alt=""
        />

        {/* Flat top preview window — z-20, only in preview mode */}
        {showFlatWindow && (
          <img
            src={fgTopFlat ?? undefined}
            className={`absolute inset-0 w-full h-full waveform-img pointer-events-none z-20 transition-opacity duration-150 ${waveformOpacity}`}
            style={{
              ...imgFix,
              ...maskWindow(
                Math.min(progress, previewPct!),
                Math.max(progress, previewPct!),
              ),
            }}
            alt=""
          />
        )}

        {/* Bottom foreground — z-10, follows drag or real progress */}
        <img
          src={fgBottom ?? undefined}
          className={`absolute inset-0 w-full h-full waveform-img z-10 transition-opacity duration-150 ${waveformOpacity}`}
          style={{ ...imgFix, ...maskLeft(bottomMaskPct) }}
          alt=""
        />

        {/* Divider — z-30 */}
        <div className="absolute bottom-[26px] left-0 w-full h-[1px] bg-chinese-black -translate-y-1/2 z-30 pointer-events-none" />

        {/* Timestamps — z-40 */}
        <div className="absolute left-0 w-full flex justify-between text-[10px] z-40 bottom-[26px]">
          <span className="bg-black px-[3px] flex items-center justify-center text-papaya">
            0:00
          </span>
          <span className="bg-black px-[3px] flex items-center justify-center text-gray-500">
            1:00
          </span>
        </div>
      </div>
    </div>
  );
}
