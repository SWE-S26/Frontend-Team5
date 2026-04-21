"use client";

import React, { useEffect, useRef, useState } from "react";
import { useStatelessComments } from "@/hooks/useComments";
import { TrackComment } from "@/types/comments.types";

const imgFix = {
  transform: "translateZ(0)",
  backfaceVisibility: "hidden" as const,
  imageRendering: "auto" as const,
  mixBlendMode: "normal" as const,
};

const LAYER_OPACITIES = {
  bgTop: 0.85,
  bgBottom: 0.82,
  fgTopGradient: 1.1,
  fgTopFlat: 0.8,
  fgBottom: 1,
} as const;

const maskLeft = (pct: number) => ({
  WebkitMaskImage: `linear-gradient(to right, black ${pct}%, transparent ${pct}%)`,
  maskImage: `linear-gradient(to right, black ${pct}%, transparent ${pct}%)`,
});

const maskWindow = (from: number, to: number) => ({
  WebkitMaskImage: `linear-gradient(to right, transparent ${from}%, black ${from}%, black ${to}%, transparent ${to}%)`,
  maskImage: `linear-gradient(to right, transparent ${from}%, black ${from}%, black ${to}%, transparent ${to}%)`,
});

type WaveLayer = {
  src: string | null;
  style?: React.CSSProperties;
  z: string;
  extra?: string;
};

function WaveImg({ src, style, z, extra = "" }: WaveLayer) {
  return (
    <img
      src={src ?? undefined}
      className={`absolute inset-0 w-full h-full waveform-img ${z} ${extra}`}
      style={{ ...imgFix, ...style }}
      alt=""
    />
  );
}

function CommentAvatar({
  comment,
  leftPct,
  zIndex,
  expanded,
  dimmed,
  onEnter,
  onLeave,
}: {
  comment: TrackComment;
  leftPct: number;
  zIndex: number;
  expanded: boolean;
  dimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const isLeft = leftPct <= 50;

  return (
    <div
      className="absolute cursor-pointer transition-opacity duration-200"
      style={{
        left: `${leftPct}%`,
        top: "calc(100% - 30px)",
        zIndex: expanded ? 460 : zIndex,
        opacity: dimmed ? 0.5 : 1,
        width: 20,
        height: 20,
        transform: "translateX(-50%)",
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Bubble — always in DOM, fades in/out, anchored to fixed container */}
      <div
        className="absolute top-full mt-1 pointer-events-none flex items-baseline gap-1.5 bg-off-black text-white text-[11px] rounded px-2 py-1.5 shadow-lg overflow-hidden transition-opacity duration-150"
        style={{
          maxWidth: 220,
          opacity: expanded ? 1 : 0,
          ...(isLeft ? { left: 0 } : { right: 0 }),
        }}
      >
        {isLeft ? (
          <>
            <span className="font-semibold truncate shrink-0 max-w-[80px]">
              {comment.displayName}
            </span>
            <span className="text-white/60 truncate">{comment.content}</span>
          </>
        ) : (
          <>
            <span className="text-white/60 truncate">{comment.content}</span>
            <span className="font-semibold truncate shrink-0 max-w-[80px]">
              {comment.displayName}
            </span>
          </>
        )}
      </div>
      {/* Avatar */}
      <img
        src={comment.avatarUrl}
        alt={comment.displayName}
        className="rounded-full object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: expanded ? 18 : 12, height: expanded ? 18 : 12 }}
      />
    </div>
  );
}

function PendingAvatar({
  avatarUrl,
  leftPct,
  flashText,
  containerRef,
  onDrag,
}: {
  avatarUrl?: string;
  leftPct: number;
  flashText: string | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onDrag?: (pct: number) => void;
}) {
  const isLeft = leftPct <= 50;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (flashText !== null) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [flashText]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
      );
      onDrag?.(pct);
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="absolute -translate-x-1/2 flex flex-col items-center"
      style={{
        left: `${leftPct}%`,
        top: "calc(100% - 26px)",
        zIndex: 500,
        cursor: "ew-resize",
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute top-full mt-1 bg-off-black text-white text-[11px] rounded px-2 py-1.5 flex items-baseline gap-1.5 shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200"
        style={{
          maxWidth: 220,
          opacity: visible ? 1 : 0,
          ...(isLeft
            ? { left: "calc(-50% + 10px)" }
            : { right: "calc(-50% + 10px)" }),
        }}
      >
        <span className="text-white/60 truncate">{flashText ?? ""}</span>
      </div>
      <img
        src={avatarUrl}
        alt=""
        className="rounded-full object-cover"
        style={{ width: 20, height: 20 }}
      />
    </div>
  );
}

export default function SausageWaveform({
  trackId,
  samplesUrl,
  externalProgress,
  onSeek,
  onPlay,
  onAvatarHover,
  onTimestampChange,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  isCommenting = false,
  commentTimestamp = 0,
  profileAvatarUrl,
  flashComment = null,
  reloadTrigger = 0,
}: {
  trackId?: string;
  samplesUrl: string;
  externalProgress?: number;
  onSeek?: (percentage: number) => void;
  onPlay?: (seekPercentage?: number) => void;
  onAvatarHover?: () => void;
  onTimestampChange?: (seconds: number) => void;
  isPlaying?: boolean;
  currentTime: number;
  duration?: number;
  isCommenting?: boolean;
  commentTimestamp?: number;
  profileAvatarUrl?: string;
  flashComment?: string | null;
  reloadTrigger?: number;
}) {
  const scwRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [bgTop, setBgTop] = useState<string | null>(null);
  const [bgBottom, setBgBottom] = useState<string | null>(null);
  const [fgTopGradient, setFgTopGradient] = useState<string | null>(null);
  const [fgTopFlat, setFgTopFlat] = useState<string | null>(null);
  const [fgBottom, setFgBottom] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const loadedCountRef = useRef(0);

  const [isHovering, setIsHovering] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewPct, setPreviewPct] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragEndedRef = useRef(false);
  const [isPendingDrag, setIsPendingDrag] = useState(false);

  const lastProgressRef = useRef(0);
  const hasPlayedRef = useRef(false);

  if (externalProgress === 0 && !isPlaying) {
    lastProgressRef.current = 0;
    hasPlayedRef.current = false;
  } else if (isPlaying && externalProgress != null) {
    lastProgressRef.current = externalProgress;
    hasPlayedRef.current = true;
  }

  const progress =
    (isPlaying ? externalProgress : lastProgressRef.current) ?? 0;

  const { comments, loadComments } = useStatelessComments();
  useEffect(() => {
    if (trackId) loadComments(trackId);
  }, [trackId, reloadTrigger]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const atCurrentTime = isPlaying
    ? (comments.find((c) => Math.floor(c.timestamp) === Math.floor(currentTime))
        ?.commentId ?? null)
    : null;
  const isActive = isCommenting || flashComment !== null;
  const expandedId = isActive ? hoveredId : (hoveredId ?? atCurrentTime);

  const pendingLeftPct = duration > 0 ? (commentTimestamp / duration) * 100 : 0;

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
    loadedCountRef.current = 0;
    const markLoaded = () => {
      loadedCountRef.current += 1;
      if (loadedCountRef.current === 5) setIsReady(true);
    };
    const base = {
      canvas_width: 1264,
      canvas_height: 120,
      bar_width: 8,
      bar_gap: 0.3,
    };
    const layers: [string, (png: string) => void][] = [
      [
        "#ffffff",
        (png) => {
          setBgTop(png);
          markLoaded();
        },
      ],
      [
        "#e5e5e5",
        (png) => {
          setBgBottom(png);
          markLoaded();
        },
      ],
      [
        "gradient",
        (png) => {
          setFgTopGradient(png);
          markLoaded();
        },
      ],
      [
        "#faad87",
        (png) => {
          setFgTopFlat(png);
          markLoaded();
        },
      ],
      [
        "#faad87",
        (png) => {
          setFgBottom(png);
          markLoaded();
        },
      ],
    ];
    const halves = ["top", "bottom", "top", "top", "bottom"];
    layers.forEach(([wave_color, onComplete], i) => {
      scwRef.current.generateFromJson(samples, {
        ...base,
        wave_color,
        half: halves[i],
        onComplete,
      });
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (!isPendingDrag) return;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const pct = getPct(e);
      if (!isDragging) {
        setIsDragging(true);
        setIsPreviewing(false);
        setPreviewPct(null);
        onPlay?.(pct);
      }
      onSeek?.(pct);
    };
    const handleGlobalMouseUp = (e: MouseEvent) => {
      const pct = getPct(e);
      if (isDragging) {
        onSeek?.(pct);
        dragEndedRef.current = true;
      }
      setIsDragging(false);
      setIsPendingDrag(false);
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isPendingDrag, isDragging, onSeek, onPlay]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsPendingDrag(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (dragEndedRef.current) {
      dragEndedRef.current = false;
      return;
    }
    const pct = getPct(e);
    if (!isPlaying) {
      onPlay?.(pct);
      return;
    }
    if (!isPreviewing) {
      setIsPreviewing(true);
      setPreviewPct(pct);
    } else {
      onSeek?.(pct);
      setIsPreviewing(false);
      setPreviewPct(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPreviewing && !isDragging) setPreviewPct(getPct(e));
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsPreviewing(false);
    setPreviewPct(null);
  };

  const hoverFade = isPlaying || isHovering ? 1 : 0.7;
  const fadeIn = "transition-opacity duration-150";
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
        className="relative w-full h-[60px] cursor-pointer select-none isolate overflow-visible pt-5"
        style={{ opacity: isReady ? 1 : 0, transition: "opacity 300ms ease" }}
      >
        <WaveImg
          src={bgTop}
          z="z-0"
          extra={`grayscale ${fadeIn}`}
          style={{ opacity: LAYER_OPACITIES.bgTop * hoverFade }}
        />
        <WaveImg
          src={bgBottom}
          z="z-0"
          extra={`grayscale ${fadeIn}`}
          style={{ opacity: LAYER_OPACITIES.bgBottom * hoverFade }}
        />
        <WaveImg
          src={fgTopGradient}
          z="z-10"
          extra={fadeIn}
          style={{
            ...maskLeft(progress),
            opacity: LAYER_OPACITIES.fgTopGradient * hoverFade,
          }}
        />
        {showFlatWindow && (
          <WaveImg
            src={fgTopFlat}
            z="z-20"
            extra={`pointer-events-none ${fadeIn}`}
            style={{
              ...maskWindow(
                Math.min(progress, previewPct!),
                Math.max(progress, previewPct!),
              ),
              opacity: LAYER_OPACITIES.fgTopFlat * hoverFade,
            }}
          />
        )}
        <WaveImg
          src={fgBottom}
          z="z-10"
          extra={fadeIn}
          style={{
            ...maskLeft(progress),
            opacity: LAYER_OPACITIES.fgBottom * hoverFade,
          }}
        />

        <div className="absolute bottom-[26px] left-0 w-full h-[1px] bg-chinese-black -translate-y-1/2 z-30 pointer-events-none" />

        <div className="absolute left-0 w-full flex justify-between text-[10px] z-40 bottom-[27px]">
          {hasPlayedRef.current ? (
            <span className="bg-black px-[3px] flex items-center justify-center text-papaya">
              {formatTime(currentTime)}
            </span>
          ) : (
            <span className="bg-black px-[3px] flex items-center justify-center text-papaya opacity-0">
              0:00
            </span>
          )}
          <span className="bg-black px-[3px] flex items-center justify-center text-white/50">
            {formatTime(duration)}
          </span>
        </div>

        {duration > 0 &&
          comments.map((comment, i) => (
            <CommentAvatar
              key={comment.commentId}
              comment={comment}
              leftPct={(comment.timestamp / duration) * 100}
              zIndex={400 + Math.min(i, 50)}
              expanded={!isActive && expandedId === comment.commentId}
              dimmed={isActive}
              onEnter={() => {
                setHoveredId(comment.commentId);
                onAvatarHover?.();
              }}
              onLeave={() => setHoveredId(null)}
            />
          ))}

        {duration > 0 && (isCommenting || flashComment !== null) && (
          <PendingAvatar
            avatarUrl={profileAvatarUrl}
            leftPct={pendingLeftPct}
            flashText={flashComment ?? null}
            containerRef={containerRef}
            onDrag={(pct) => onTimestampChange?.((pct / 100) * (duration ?? 0))}
          />
        )}
      </div>
    </div>
  );
}
