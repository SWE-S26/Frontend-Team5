"use client";
import {
  AudioOutlined,
  DownOutlined,
  UpOutlined,
  CheckCircleFilled,
  CheckOutlined,
  UndoOutlined,
  RedoOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { MicrophoneDevice } from "@/types/upload.types";

interface MicrophoneSectionProps {
  micOpen: boolean;
  setMicOpen: (v: boolean) => void;
  micDropdownRef: React.RefObject<HTMLDivElement | null>;
  micDropdownOpen: boolean;
  setMicDropdownOpen: (v: boolean) => void;
  isRecording: boolean;
  isPaused: boolean;
  hasRecording: boolean;
  isPreviewMode: boolean;
  isPlaying: boolean;
  recordingSeconds: number;
  progressPercent: number;
  microphones: MicrophoneDevice[];
  selectedMicId: string;
  canUndo: boolean;
  canRedo: boolean;
  canDelete: boolean;
  canConfirm: boolean;
  getMicrophones: () => Promise<void>;
  handleMicSelect: (deviceId: string) => void;
  startRecording: () => Promise<void>;
  togglePauseResume: () => void;
  resumeRecording: () => void;
  handleStopAndUpload: () => void;
  handleCheckmark: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleDeleteRecording: () => void;
  handleBackToRecording: () => void;
  handleClearAndRestart: () => void;
  handleUpload: () => void;
  togglePlayPause: () => void;
}

export function MicrophoneSection({
  micOpen,
  setMicOpen,
  micDropdownRef,
  micDropdownOpen,
  setMicDropdownOpen,
  isRecording,
  isPaused,
  hasRecording,
  isPreviewMode,
  isPlaying,
  recordingSeconds,
  progressPercent,
  microphones,
  selectedMicId,
  canUndo,
  canRedo,
  canDelete,
  canConfirm,
  getMicrophones,
  handleMicSelect,
  startRecording,
  togglePauseResume,
  resumeRecording,
  handleStopAndUpload,
  handleCheckmark,
  handleUndo,
  handleRedo,
  handleDeleteRecording,
  handleBackToRecording,
  handleClearAndRestart,
  handleUpload,
  togglePlayPause,
}: MicrophoneSectionProps) {
  const formattedRecordingTime = `${Math.floor(recordingSeconds / 60)}:${Math.floor(
    recordingSeconds % 60,
  )
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="mt-10 rounded-md border border-[#2b2c31] bg-[#212121]">
      {/* Header */}
      <button
        type="button"
        onClick={() => {
          setMicOpen(!micOpen);
          if (!micOpen) getMicrophones();
        }}
        data-testid="upload-mic-toggle"
        className="flex w-full flex-wrap items-start justify-between gap-3 px-4 py-4 sm:items-center sm:px-5 cursor-pointer"
      >
        {/* Left: mic icon + dropdown */}
        <div className="relative order-1" ref={micDropdownRef}>
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setMicDropdownOpen(!micDropdownOpen);
              getMicrophones();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setMicDropdownOpen(!micDropdownOpen);
                getMicrophones();
              }
            }}
            className={`flex items-center gap-1 h-8 px-2  cursor-pointer transition-colors focus:outline-none
        ${
          isRecording
            ? "animate-pulse border-red-500 text-red-400"
            : "border-[#5b5c64] text-[#f2f2f2] hover:border-[#8b8c94]"
        }`}
            data-testid="upload-mic-dropdown-toggle"
            aria-label="Select microphone"
            aria-expanded={micDropdownOpen}
          >
            <span className="text-[18px]">
              <AudioOutlined />
            </span>
            <span className="text-[14px] text-[#d0d0d4]">
              <DownOutlined />
            </span>
          </div>

          {micDropdownOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2.5rem))] rounded-md border border-[#3f4047] bg-[#1b1c20] py-2 shadow-xl">
              {microphones.length === 0 ? (
                <div className="px-4 py-2 text-[13px] text-[#888]">
                  No microphones found
                </div>
              ) : (
                microphones.map((mic) => (
                  <div
                    key={mic.deviceId}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMicSelect(mic.deviceId);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMicSelect(mic.deviceId);
                      }
                    }}
                    className={`w-full px-4 py-2.5 text-left text-[13px] transition-colors cursor-pointer focus:outline-none
                ${
                  selectedMicId === mic.deviceId
                    ? "text-[#f2f2f2] bg-[#2b2c31]"
                    : "text-[#ceced0] hover:bg-[#25262b] hover:text-[#f2f2f2]"
                }`}
                    data-testid={`upload-mic-option-${mic.deviceId}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{mic.label}</span>
                      {selectedMicId === mic.deviceId && (
                        <CheckCircleFilled className="text-[#6fcf6f] text-[14px]" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Center text */}
        <div className="order-3 w-full text-left sm:order-2 sm:flex-1 sm:text-center">
          <p className="text-[16px] font-extrabold tracking-[-0.02em] text-[#f5f5f5] sm:text-[18px]">
            Or record with a microphone
          </p>
          <p className="mt-1 text-[13px] text-[#ececef]">
            Upload recorded voice memos, updates, news, or intros to new
            releases.
          </p>
        </div>

        {/* Right: collapse/expand */}
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            setMicOpen(!micOpen);
            if (!micOpen) getMicrophones();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setMicOpen(!micOpen);
              if (!micOpen) getMicrophones();
            }
          }}
          className="order-2 ml-auto flex items-center justify-center rounded text-[14px] text-[#d0d0d4] transition-all duration-200 hover:text-[#f2f2f2] focus:outline-none sm:order-3 sm:ml-0 cursor-pointer"
          data-testid="upload-mic-collapse"
          aria-label={
            micOpen ? "Collapse recording options" : "Expand recording options"
          }
          aria-expanded={micOpen}
        >
          {micOpen ? <UpOutlined /> : <DownOutlined />}
        </div>
      </button>

      {micOpen && (
        <>
          {/* Progress Bar */}
          {(isRecording || isPaused || isPreviewMode) && (
            <div className="px-5 pt-2">
              <div className="relative h-1 w-full rounded-full bg-[#3f4047]">
                <div
                  className={`absolute left-0 top-0 h-1 rounded-full bg-orange-500 ${isPreviewMode ? "" : "transition-[width] duration-120 ease-linear"}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="px-4 py-4 sm:px-5">
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Left Icons */}
              <div className="flex items-center justify-center gap-1 sm:justify-start">
                {isPreviewMode ? (
                  /* Preview mode: back arrow + play + delete */
                  <>
                    <button
                      type="button"
                      onClick={handleBackToRecording}
                      data-testid="upload-mic-back"
                      className="flex h-9 w-9 items-center justify-center rounded text-[#f2f2f2] hover:bg-[#2b2c31] transition-colors cursor-pointer"
                      aria-label="Back"
                      title="Back to recording"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M10 3L5 8l5 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      data-testid="upload-mic-play-toggle"
                      className="flex h-9 w-9 items-center justify-center rounded text-[#f2f2f2] hover:bg-[#2b2c31] transition-colors cursor-pointer"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="3.5"
                            height="10"
                            rx="1"
                            fill="currentColor"
                          />
                          <rect
                            x="9.5"
                            y="3"
                            width="3.5"
                            height="10"
                            rx="1"
                            fill="currentColor"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M5 3.5L13 8L5 12.5V3.5Z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </button>
                  </>
                ) : (
                  /* Recording/paused mode: checkmark + undo + redo + delete */
                  <>
                    <button
                      type="button"
                      onClick={handleCheckmark}
                      disabled={!canConfirm}
                      data-testid="upload-mic-confirm"
                      className={`flex h-9 w-9 items-center justify-center rounded transition-all 
                        ${
                          canConfirm
                            ? "text-[#f2f2f2] hover:bg-[#2b2c31] cursor-pointer"
                            : "text-[#3a3b40] cursor-not-allowed"
                        }`}
                      aria-label="Confirm"
                    >
                      <CheckOutlined className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={!canUndo}
                      data-testid="upload-mic-undo"
                      className={`flex h-9 w-9 items-center justify-center rounded transition-all
                         ${
                           canUndo
                             ? "text-[#f2f2f2] hover:bg-[#2b2c31] cursor-pointer"
                             : "text-[#3a3b40] cursor-not-allowed"
                         }`}
                      aria-label="Undo"
                    >
                      <UndoOutlined className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRedo}
                      disabled={!canRedo}
                      data-testid="upload-mic-redo"
                      className={`flex h-9 w-9 items-center justify-center rounded transition-all
                         ${
                           canRedo
                             ? "text-[#f2f2f2] hover:bg-[#2b2c31] cursor-pointer"
                             : "text-[#3a3b40] cursor-not-allowed"
                         }`}
                      aria-label="Redo"
                    >
                      <RedoOutlined className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteRecording}
                      disabled={!canDelete}
                      data-testid="upload-mic-delete"
                      className={`flex h-9 w-9 items-center justify-center rounded transition-all
                        ${
                          canDelete
                            ? "text-[#f2f2f2] hover:bg-[#2b2c31] cursor-pointer"
                            : "text-[#3a3b40] cursor-not-allowed"
                        }`}
                      aria-label="Delete"
                    >
                      <DeleteFilled className="text-[15px]" />
                    </button>
                  </>
                )}
              </div>

              {/* Center Button */}
              <div className="flex items-center justify-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                {isPreviewMode ? (
                  <button
                    onClick={handleUpload}
                    data-testid="upload-mic-upload"
                    className="flex items-center gap-2 rounded-full bg-[#3a3b40] px-8 py-2.5 text-[14px] font-semibold text-[#f2f2f2] transition-opacity hover:opacity-90 cursor-pointer"
                    type="button"
                  >
                    Upload
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={resumeRecording}
                    data-testid="upload-mic-resume"
                    className="flex items-center gap-2 rounded-full bg-[#3a3b40] px-5 py-2.5 text-[14px] font-semibold text-[#f2f2f2] transition-opacity hover:opacity-90 cursor-pointer"
                    type="button"
                  >
                    <span className="flex h-3.5 w-3.5 items-center justify-center">
                      <span className="h-3 w-3 rounded-full bg-[#e84c3d]" />
                    </span>
                    Resume recording
                  </button>
                ) : !isRecording && !isPaused ? (
                  <button
                    onClick={startRecording}
                    data-testid="upload-mic-start"
                    className="flex items-center gap-2 rounded-full bg-[#3a3b40] px-5 py-2.5 text-[14px] font-semibold text-[#f2f2f2] transition-opacity hover:opacity-90 cursor-pointer"
                    type="button"
                  >
                    <span className="flex h-3.5 w-3.5 items-center justify-center">
                      <span className="h-3 w-3 rounded-full bg-[#e84c3d]" />
                    </span>
                    Start recording
                  </button>
                ) : (
                  <button
                    onClick={togglePauseResume}
                    data-testid="upload-mic-pause"
                    className="flex items-center gap-2 rounded-full bg-[#3a3b40] px-5 py-2.5 text-[14px] font-semibold text-[#f2f2f2] transition-opacity hover:opacity-90 cursor-pointer"
                    type="button"
                  >
                    <span className="flex h-3.5 w-3.5 items-center justify-center">
                      <span
                        className={`h-3 w-3 rounded-full bg-[#e84c3d] ${isRecording && !isPaused ? "animate-pulse" : ""}`}
                      />
                    </span>
                    Pause recording
                  </button>
                )}
              </div>

              {/* Right - Timer */}
              <div className="flex min-w-12 items-center justify-center sm:justify-end">
                <span className="font-mono text-[13px] font-semibold text-[#f2f2f2]">
                  {formattedRecordingTime}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
