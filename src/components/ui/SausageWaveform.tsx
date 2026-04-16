"use client";

import React, { useEffect, useRef, useState } from "react";

export default function SausageWaveform({
  samplesUrl,
}: {
  samplesUrl: string;
}) {
  const scwRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [bgTop, setBgTop] = useState<string | null>(null);
  const [bgBottom, setBgBottom] = useState<string | null>(null);
  const [fgTopGradient, setFgTopGradient] = useState<string | null>(null);
  const [fgTopFlat, setFgTopFlat] = useState<string | null>(null);
  const [fgBottom, setFgBottom] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [hoverPct, setHoverPct] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isHoveringTop, setIsHoveringTop] = useState(false);

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

  const getPct = (e: React.MouseEvent) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    );
  };

  const getIsHoveringTop = (e: React.MouseEvent) => {
    if (!containerRef.current) return false;
    const rect = containerRef.current.getBoundingClientRect();
    return e.clientY - rect.top < rect.height / 2;
  };

  const handleClick = (e: React.MouseEvent) => {
    const pct = getPct(e);
    setProgress(pct);

    if (!isTracking) {
      setIsTracking(true);
      setHoverPct(pct);
    } else {
      setIsTracking(false);
      setHoverPct(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setIsHoveringTop(getIsHoveringTop(e));
    if (isTracking) setHoverPct(getPct(e));
  };

  const handleMouseLeave = () => {
    if (!isTracking) setHoverPct(null);
    setIsHoveringTop(false);
  };

  const maskLeft = (pct: number) => ({
    WebkitMaskImage: `linear-gradient(to right, black ${pct}%, transparent ${pct}%)`,
    maskImage: `linear-gradient(to right, black ${pct}%, transparent ${pct}%)`,
  });

  const maskWindow = (from: number, to: number) => ({
    WebkitMaskImage: `linear-gradient(to right,
      transparent ${from}%,
      black ${from}%,
      black ${to}%,
      transparent ${to}%
    )`,
    maskImage: `linear-gradient(to right,
      transparent ${from}%,
      black ${from}%,
      black ${to}%,
      transparent ${to}%
    )`,
  });

  const imgFix = {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden" as const,
    imageRendering: "auto" as const,
    mixBlendMode: "normal" as const,
  };

  const waveformOpacity = isHoveringTop ? "opacity-100" : "opacity-85";

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[60px] cursor-pointer select-none isolate overflow-hidden"
      >
        {/* Background Top */}
        <img
          src={bgTop ?? undefined}
          className="absolute inset-0 w-full h-full grayscale waveform-img z-0"
          style={imgFix}
          alt=""
        />

        {/* Background Bottom */}
        <img
          src={bgBottom ?? undefined}
          className="absolute inset-0 w-full h-full grayscale waveform-img z-0"
          style={imgFix}
          alt=""
        />

        {/* Foreground Gradient */}
        <img
          src={fgTopGradient ?? undefined}
          className={`absolute inset-0 w-full h-full waveform-img z-10 ${waveformOpacity}`}
          style={{ ...imgFix, ...maskLeft(progress) }}
          alt=""
        />

        {/* Hover Window */}
        {hoverPct !== null && (
          <img
            src={fgTopFlat ?? undefined}
            className={`absolute inset-0 w-full h-full waveform-img pointer-events-none z-20 ${waveformOpacity}`}
            style={{
              ...imgFix,
              ...maskWindow(
                Math.min(progress, hoverPct),
                Math.max(progress, hoverPct),
              ),
            }}
            alt=""
          />
        )}

        {/* Bottom Progress */}
        <img
          src={fgBottom ?? undefined}
          className={`absolute inset-0 w-full h-full waveform-img z-10 ${waveformOpacity}`}
          style={{ ...imgFix, ...maskLeft(progress) }}
          alt=""
        />

        {/* Divider */}
        <div className="absolute bottom-[26px] left-0 w-full h-[1px] bg-chinese-black -translate-y-1/2 z-30 pointer-events-none" />

        {/* Timestamps */}
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
