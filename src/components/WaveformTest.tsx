"use client";

import React, { useState, useRef } from "react";

export default function WaveformTest() {
  const [waveformUrl, setWaveformUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      typeof window !== "undefined" &&
      (window as any).SoundCloudWaveform
    ) {
      (window as any).SoundCloudWaveform.generate(file, {
        canvas_width: 800,
        canvas_height: 80,
        bar_width: 4,
        bar_gap: 0.3,
        wave_color: "#ff5500", // We'll use this for the "active" version
        onComplete: (png: string) => {
          setWaveformUrl(png);
        },
      });
    }
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = clientX - rect.left;
    const newProgress = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setProgress(newProgress);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-900 min-h-screen text-white">
      <div className="w-full max-w-3xl space-y-8">
        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">
          Waveform Tester
        </h2>

        {/* File Input */}
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 transition-all"
        />

        {waveformUrl ? (
          <div className="space-y-4">
            {/* INTERACTIVE WAVEFORM CONTAINER */}
            <div
              ref={containerRef}
              onClick={handleInteraction}
              onMouseMove={(e) => e.buttons === 1 && handleInteraction(e)}
              className="relative w-full h-20 cursor-pointer select-none group"
            >
              {/* 1. Background (Unplayed) */}
              <img
                src={waveformUrl}
                alt="background waveform"
                className="absolute inset-0 w-full h-full opacity-30 grayscale brightness-200"
              />

              {/* 2. Progress Layer (Played) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              >
                <img
                  src={waveformUrl}
                  alt="active waveform"
                  className="absolute inset-0 w-[800px] h-full max-w-none"
                  // Note: Width here must match canvas_width
                />
              </div>

              {/* 3. Playhead Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-orange-400 shadow-[0_0_8px_#ff5500] z-10 transition-all duration-100 ease-out"
                style={{ left: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 font-mono">
              <span>{Math.round(progress)}% Played</span>
              <span>Click or drag to seek</span>
            </div>
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg text-gray-500">
            Upload an MP3 to generate the sausage waveform
          </div>
        )}
      </div>
    </div>
  );
}
