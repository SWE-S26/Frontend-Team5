"use client";

import Image from "next/image";
import { CloseOutlined, PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";

interface HeaderProps {
	replaceFileInputRef: React.RefObject<HTMLInputElement | null>;
	handleReplaceTrackChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isTrackDragActive: boolean;
	setIsTrackDragActive: (value: boolean) => void;
	handleTrackDrop: (e: React.DragEvent<HTMLDivElement>) => void;
	showUploadProgress: boolean;
	currentFileName: string;
	roundedUploadProgress: number;
	uploadedFileUrl: string | null;
	togglePlayPause: () => void;
	isPlaying: boolean;
	showReplaceTrack: boolean;
	handleReplaceTrack: () => void;
	onGoHome: () => void;
	onShowQuitModal: () => void;
}

export function Header({
	replaceFileInputRef,
	handleReplaceTrackChange,
	isTrackDragActive,
	setIsTrackDragActive,
	handleTrackDrop,
	showUploadProgress,
	currentFileName,
	roundedUploadProgress,
	uploadedFileUrl,
	togglePlayPause,
	isPlaying,
	showReplaceTrack,
	handleReplaceTrack,
	onGoHome,
	onShowQuitModal,
}: HeaderProps) {
	return (
		<div className="sticky top-0 z-50 bg-chinese-black">
			<div className="mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
				<input
					ref={replaceFileInputRef}
					type="file"
					accept="audio/*,.wav,.flac,.aiff,.aif,.alac,.m4a,.mp3"
					className="hidden"
					onChange={handleReplaceTrackChange}
					data-testid="upload-header-replace-input"
				/>

				<div className="flex items-center gap-3">
					<button
						onClick={onGoHome}
						data-testid="upload-header-home"
						className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#1b1c20] cursor-pointer"
					>
						<Image src="/app-logo/whitelogo.png" alt="BeatZa" width={52} height={52} className="object-contain logo-dark" priority />
						<Image src="/app-logo/blacklogo.png" alt="BeatZa" width={52} height={52} className="object-contain logo-light" priority />
					</button>
					<span className="text-[16px] font-semibold text-white-smoke">Track Info</span>
				</div>

				<div
					className={`flex w-full flex-wrap items-center justify-end gap-3 rounded-md border border-dashed px-3 py-2 transition-colors md:w-auto md:max-w-[65%] ${
						isTrackDragActive ? "border-white-smoke bg-chinese-black" : "border-transparent"
					}`}
					onDragOver={(e) => { e.preventDefault(); if (!isTrackDragActive) setIsTrackDragActive(true); }}
					onDragLeave={(e) => { const rel = e.relatedTarget as Node | null; if (!rel || !e.currentTarget.contains(rel)) setIsTrackDragActive(false); }}
					onDrop={handleTrackDrop}
				>
					{showUploadProgress ? (
						<div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
							<span className="truncate text-[12px] text-white-smoke">{currentFileName}</span>
							<div className="w-24 h-1 bg-[#333] rounded-full overflow-hidden">
								<div
									className={`h-full rounded-full transition-all duration-300 ${roundedUploadProgress > 50 ? "bg-[#1db954]" : "bg-white-smoke"}`}
									style={{ width: `${roundedUploadProgress}%` }}
								/>
							</div>
							<span className="w-10 shrink-0 text-right text-[12px] font-semibold text-white-smoke">
								{roundedUploadProgress}%
							</span>
						</div>
					) : (
						<div className="flex min-w-0 items-center gap-2">
							{uploadedFileUrl && (
								<button
									onClick={togglePlayPause}
									data-testid="upload-header-play-toggle"
									className="flex h-7 w-7 items-center justify-center text-white-smoke hover:text-[#f2f2f2] transition-colors cursor-pointer"
									aria-label={isPlaying ? "Pause" : "Play"}
								>
									{isPlaying ? <PauseCircleOutlined className="text-[16px]" /> : <PlayCircleOutlined className="text-[16px]" />}
								</button>
							)}
							<span className="truncate text-[12px] text-white-smoke">{currentFileName}</span>
						</div>
					)}

					{isTrackDragActive && (
						<span className="text-[11px] font-semibold text-white/85">Drop audio file to upload</span>
					)}
					{showReplaceTrack && (
						<button onClick={handleReplaceTrack} data-testid="upload-header-replace-track" className="text-[12px] font-semibold text-white-smoke hover:underline cursor-pointer">
							Replace track
						</button>
					)}
					<button
						onClick={onShowQuitModal}
						data-testid="upload-header-quit"
						className="flex h-9 w-9 items-center justify-center rounded-full bg-[#222] text-[#ccc] transition-colors hover:bg-[#333] cursor-pointer"
					>
						<CloseOutlined className="text-[14px]" />
					</button>
				</div>
			</div>
		</div>
	);
}
