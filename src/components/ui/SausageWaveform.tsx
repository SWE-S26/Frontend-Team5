"use client";

import React, { useEffect, useRef, useState } from "react";

export default function SausageWaveform() {
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
      fetch("/waveform.json")
        .then((res) => res.json())
        .then((samples: number[]) => generateAll(samples));
    });
  }, []);

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
    const relativeY = e.clientY - rect.top;
    return relativeY < rect.height / 2;
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
    if (isTracking) {
      setHoverPct(getPct(e));
    }
  };

  const handleMouseLeave = () => {
    if (!isTracking) {
      setHoverPct(null);
    }
    setIsHoveringTop(false);
  };

  const clipLeft = (pct: number) => ({
    clipPath: `inset(0 ${100 - pct}% 0 0)`,
  });

  const clipWindow = (fromPct: number, toPct: number) => ({
    clipPath: `inset(0 ${100 - toPct}% 0 ${fromPct}%)`,
  });

  // Dynamic opacity for all waveform layers
  const waveformOpacity = isHoveringTop ? "opacity-100" : "opacity-85";

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[60px] cursor-pointer select-none"
      >
        {/* Grey top half */}
        <img
          src={bgTop ?? undefined}
          className={`absolute inset-0 w-full h-full grayscale waveform-img ${waveformOpacity}`}
          alt=""
        />

        {/* Grey bottom half */}
        <img
          src={bgBottom ?? undefined}
          className={`absolute inset-0 w-full h-full grayscale waveform-img ${waveformOpacity}`}
          alt=""
        />

        {/* Gradient top — played portion */}
        <img
          src={fgTopGradient ?? undefined}
          className={`absolute inset-0 w-full h-full waveform-img ${waveformOpacity}`}
          style={clipLeft(progress)}
          alt=""
        />

        {/* Flat top — cursor ahead of progress */}
        {hoverPct !== null && hoverPct > progress && (
          <img
            src={fgTopFlat ?? undefined}
            className={`absolute inset-0 w-full h-full pointer-events-none waveform-img ${waveformOpacity}`}
            style={clipWindow(progress, hoverPct)}
            alt=""
          />
        )}

        {/* Flat top — cursor behind progress */}
        {hoverPct !== null && hoverPct <= progress && (
          <img
            src={fgTopFlat ?? undefined}
            className={`absolute inset-0 w-full h-full pointer-events-none waveform-img ${waveformOpacity}`}
            style={clipWindow(hoverPct, progress)}
            alt=""
          />
        )}

        {/* Flat bottom — follows progress only */}
        <img
          src={fgBottom ?? undefined}
          className={`absolute inset-0 w-full h-full waveform-img ${waveformOpacity}`}
          style={clipLeft(progress)}
          alt=""
        />
      </div>
    </div>
  );
}
