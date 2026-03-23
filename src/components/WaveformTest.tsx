"use client";

import React, { useState, useRef, useEffect } from "react";

type Tab = "audio" | "json";

export default function WaveformTest() {
  // scwRef holds the SoundCloudWaveform library object after it's imported.
  // We use a ref (instead of state) because changing it shouldn't trigger a re-render.
  const scwRef = useRef<any>(null);

  // Dynamically import the waveform library on the client side only.
  // We can't import it at the top of the file because it uses browser APIs
  // (AudioContext, FileReader, Canvas) that don't exist on the server during SSR.
  useEffect(() => {
    import("@/lib/waveform").then((mod) => {
      scwRef.current = mod.default;
    });
  }, []);

  // Which input tab is active: upload an audio file, or upload a pre-made JSON file
  const [tab, setTab] = useState<Tab>("audio");

  // The waveform image rendered as a base64 PNG data URL from the canvas
  const [waveformUrl, setWaveformUrl] = useState<string | null>(null);

  // Playback progress as a percentage (0–100), controlled by clicking/dragging the waveform
  const [progress, setProgress] = useState(0);

  // The last audio file the user uploaded, kept in state so we can export its JSON later
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Whether the JSON export is in progress (used to show a spinner on the button)
  const [exporting, setExporting] = useState(false);

  // Ref to the waveform container div, used to calculate click position for seeking
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Audio file handler ────────────────────────────────────────────────────
  const handleAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Bail out if no file selected or the library hasn't loaded yet
    if (!file || !scwRef.current) return;

    setAudioFile(file);
    setWaveformUrl(null); // clear any previous waveform
    setProgress(0);

    // Decode the audio file and render the waveform to an offscreen canvas,
    // then hand us back the result as a PNG data URL via onComplete
    scwRef.current.generate(file, {
      canvas_width: 800,
      canvas_height: 80,
      bar_width: 4,
      bar_gap: 0.3,
      wave_color: "#ff5500",
      onComplete: (png: string) => setWaveformUrl(png),
    });
  };

  // ── Export JSON handler ───────────────────────────────────────────────────
  const handleExportJson = () => {
    if (!audioFile || !scwRef.current) return;

    setExporting(true);

    // Decodes the audio, computes 200 amplitude samples, and downloads them as a .json file.
    // Later you can swap the download logic inside exportJson for a fetch() POST to your server.
    scwRef.current.exportJson(
      audioFile,
      200,
      `${audioFile.name.replace(/\.[^.]+$/, "")}-waveform.json`,
    );

    // exportJson triggers the download asynchronously internally,
    // so we just reset the spinner after a short delay
    setTimeout(() => setExporting(false), 1500);
  };

  // ── JSON file handler ─────────────────────────────────────────────────────
  const handleJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !scwRef.current) return;

    setWaveformUrl(null);
    setProgress(0);

    // Read the JSON file as text, parse it into a number array,
    // and pass it to generateFromJson which renders the waveform without needing the audio file
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const samples: number[] = JSON.parse(ev.target?.result as string);
        scwRef.current.generateFromJson(samples, {
          canvas_width: 800,
          canvas_height: 80,
          bar_width: 4,
          bar_gap: 0.3,
          wave_color: "#ff5500",
          onComplete: (png: string) => setWaveformUrl(png),
        });
      } catch {
        alert("Invalid JSON file — expected an array of numbers.");
      }
    };
    reader.readAsText(file);
  };

  // ── Seek interaction ──────────────────────────────────────────────────────
  const handleSeek = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    // Get the bounding box of the waveform container
    const rect = containerRef.current.getBoundingClientRect();

    // Works for both mouse clicks and touch events
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

    // Convert the click position to a 0–100 percentage, clamped to valid range
    const x = clientX - rect.left;
    setProgress(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center p-8 bg-gray-900 min-h-screen text-white">
      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">
          Waveform Tester
        </h2>

        {/* Tab selector — switches between audio upload and JSON upload modes */}
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1 w-fit">
          {(["audio", "json"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setWaveformUrl(null); // clear waveform when switching tabs
                setProgress(0);
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                tab === t
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t === "audio" ? "🎵 Audio File" : "📄 JSON File"}
            </button>
          ))}
        </div>

        {/* ── Audio tab ── */}
        {tab === "audio" && (
          <div className="space-y-3">
            <label className="block text-sm text-gray-400">
              Upload an audio file to generate its waveform
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioFile}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                file:text-sm file:font-semibold file:bg-orange-500 file:text-white
                hover:file:bg-orange-600 transition-all"
            />

            {/* Only show the export button once an audio file has been loaded */}
            {audioFile && (
              <button
                onClick={handleExportJson}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600
                  text-sm text-gray-300 hover:border-orange-400 hover:text-orange-400
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {exporting ? (
                  <>
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full" />
                    Exporting…
                  </>
                ) : (
                  <>⬇ Export waveform as JSON</>
                )}
              </button>
            )}
          </div>
        )}

        {/* ── JSON tab ── */}
        {tab === "json" && (
          <div className="space-y-3">
            <label className="block text-sm text-gray-400">
              Upload a pre-generated waveform JSON file (array of numbers)
            </label>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleJsonFile}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                file:text-sm file:font-semibold file:bg-orange-500 file:text-white
                hover:file:bg-orange-600 transition-all"
            />
          </div>
        )}

        {/* ── Waveform display ── */}
        {waveformUrl ? (
          <div className="space-y-2">
            <div
              ref={containerRef}
              onClick={handleSeek}
              onMouseMove={(e) => e.buttons === 1 && handleSeek(e)} // drag to seek
              className="relative w-full h-20 cursor-pointer select-none"
            >
              {/* Layer 1 — grey "unplayed" waveform, always full width */}
              <img
                src={waveformUrl}
                alt="background waveform"
                className="absolute inset-0 w-full h-full opacity-30 grayscale brightness-200"
              />

              {/* Layer 2 — orange "played" waveform, same image clipped from the right.
                  clipPath inset clips: top=0, right=(remaining %), bottom=0, left=0
                  So as progress increases, less is clipped and more orange is revealed. */}
              <img
                src={waveformUrl}
                alt="active waveform"
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}
              />

              {/* Layer 3 — thin vertical playhead line that tracks progress */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-orange-400 shadow-[0_0_8px_#ff5500] z-10"
                style={{ left: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 font-mono">
              <span>{Math.round(progress)}% played</span>
              <span>click or drag to seek</span>
            </div>
          </div>
        ) : (
          // Placeholder shown before any waveform is generated
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg text-gray-500 text-sm">
            {tab === "audio"
              ? "Upload an audio file to generate the waveform"
              : "Upload a JSON file to render the waveform"}
          </div>
        )}
      </div>
    </div>
  );
}
