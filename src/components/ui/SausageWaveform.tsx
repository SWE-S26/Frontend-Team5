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

  // Playback progress as a percentage (0–100)
  const [progress, setProgress] = useState(0);

  // Mouse X position as a percentage (0–100), only active when tracking
  const [hoverPct, setHoverPct] = useState<number | null>(null);

  // Whether the waveform is in "tracking" mode — first click enables, second click disables
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

    const base = {
      canvas_width: 800,
      canvas_height: 80,
      bar_width: 4,
      bar_gap: 0.3,
    };

    scwRef.current.generateFromJson(samples, {
      ...base,
      wave_color: "#888888",
      half: "top",
      onComplete: (png: string) => setBgTop(png),
    });

    scwRef.current.generateFromJson(samples, {
      ...base,
      wave_color: "#888888",
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

  const handleJsonArray = (samples: number[]) => {
    if (!samples || !scwRef.current) return;
    generateAll(samples);
  };

  const handleJsonFile = (file: File) => {
    if (!file || !scwRef.current) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const samples: number[] = JSON.parse(ev.target?.result as string);
        handleJsonArray(samples);
      } catch {
        alert("Invalid JSON file — expected an array of numbers.");
      }
    };
    reader.readAsText(file);
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
    setProgress(pct); // always snap progress to click position

    if (!isTracking) {
      // First click — snap progress and start tracking
      setIsTracking(true);
      setHoverPct(pct);
    } else {
      // Second click — snap progress and stop tracking
      setIsTracking(false);
      setHoverPct(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only update hover position if we're in tracking mode
    if (isTracking) {
      setHoverPct(getPct(e));
    }
  };

  const handleMouseLeave = () => {
    // If tracking, keep hoverPct where it is — user left the container mid-track
    // If not tracking, nothing to clear
    if (!isTracking) {
      setHoverPct(null);
    }
  };

  // Helper: clip left-to-right up to a percentage
  const clipLeft = (pct: number) => ({
    clipPath: `inset(0 ${100 - pct}% 0 0)`,
  });

  // Helper: clip a window between two percentages
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
        className="relative w-full h-20 cursor-pointer select-none"
      >
        {/* Grey top half — background, always full width */}
        <img
          src={bgTop ?? undefined}
          className="absolute inset-0 w-full h-full opacity-30 grayscale brightness-200"
        />

        {/* Grey bottom half — background, always full width */}
        <img
          src={bgBottom ?? undefined}
          className="absolute inset-0 w-full h-full opacity-30 grayscale brightness-200"
        />

        {/* Gradient top — shown on played portion (left of progress) */}
        <img
          src={fgTopGradient ?? undefined}
          className="absolute inset-0 w-full h-full"
          style={clipLeft(progress)}
        />

        {/* Flat top — shown between progress and cursor when cursor is ahead of progress */}
        {hoverPct !== null && hoverPct > progress && (
          <img
            src={fgTopFlat ?? undefined}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={clipWindow(progress, hoverPct)}
          />
        )}

        {/* Flat top — shown between cursor and progress when cursor is behind progress
            This replaces the gradient under the cursor on the already-played portion */}
        {hoverPct !== null && hoverPct <= progress && (
          <img
            src={fgTopFlat ?? undefined}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={clipWindow(hoverPct, progress)}
          />
        )}

        {/* Flat bottom — only follows progress, never the cursor */}
        <img
          src={fgBottom ?? undefined}
          className="absolute inset-0 w-full h-full"
          style={clipLeft(progress)}
        />
      </div>
    </div>
  );
}
