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

    // Generate at 2x for crisp rendering on all screens
    const base = {
      canvas_width: 1264, // 632 × 2
      canvas_height: 120, // 60 × 2
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
      wave_color: "#ffffff",
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
      wave_color: "#c49478",
      half: "top",
      onComplete: (png: string) => setFgTopFlat(png),
    });

    scwRef.current.generateFromJson(samples, {
      ...base,
      wave_color: "#c49478",
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
    if (isTracking) {
      setHoverPct(getPct(e));
    }
  };

  const handleMouseLeave = () => {
    if (!isTracking) {
      setHoverPct(null);
    }
  };

  const clipLeft = (pct: number) => ({
    clipPath: `inset(0 ${100 - pct}% 0 0)`,
  });

  const clipWindow = (fromPct: number, toPct: number) => ({
    clipPath: `inset(0 ${100 - toPct}% 0 ${fromPct}%)`,
  });

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        // Fluid width, fixed visual height (60px)
        className="relative w-full h-[60px] cursor-pointer select-none"
      >
        {/* Shared image classes: crisp scaling */}
        {/* 
          - w-full h-full: fill the 60px-tall container
          - image-rendering: auto lets browser smooth the 2x→1x downscale
          - will-change: transform improves perf during hover/progress updates
        */}
        <style jsx global>{`
          .waveform-img {
            image-rendering: auto;
            will-change: transform;
          }
        `}</style>

        {/* Grey top half */}
        <img
          src={bgTop ?? undefined}
          className="absolute inset-0 w-full h-full opacity-80 grayscale brightness-200 waveform-img"
          alt=""
        />

        {/* Grey bottom half */}
        <img
          src={bgBottom ?? undefined}
          className="absolute inset-0 w-full h-full opacity-80 grayscale brightness-200 waveform-img"
          alt=""
        />

        {/* Gradient top — played portion */}
        <img
          src={fgTopGradient ?? undefined}
          className="absolute inset-0 w-full h-full waveform-img"
          style={clipLeft(progress)}
          alt=""
        />

        {/* Flat top — cursor ahead of progress */}
        {hoverPct !== null && hoverPct > progress && (
          <img
            src={fgTopFlat ?? undefined}
            className="absolute inset-0 w-full h-full pointer-events-none waveform-img"
            style={clipWindow(progress, hoverPct)}
            alt=""
          />
        )}

        {/* Flat top — cursor behind progress */}
        {hoverPct !== null && hoverPct <= progress && (
          <img
            src={fgTopFlat ?? undefined}
            className="absolute inset-0 w-full h-full pointer-events-none waveform-img"
            style={clipWindow(hoverPct, progress)}
            alt=""
          />
        )}

        {/* Flat bottom — follows progress only */}
        <img
          src={fgBottom ?? undefined}
          className="absolute inset-0 w-full h-full waveform-img"
          style={clipLeft(progress)}
          alt=""
        />
      </div>
    </div>
  );
}
