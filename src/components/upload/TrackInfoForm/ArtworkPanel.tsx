"use client";

import Image from "next/image";
import { MinusOutlined, PictureOutlined, PlusOutlined } from "@ant-design/icons";
import { GrEdit } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";

interface ArtworkPanelProps {
	artworkInputRef: React.RefObject<HTMLInputElement | null>;
	handleArtworkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	artworkFrameRef: React.RefObject<HTMLDivElement | null>;
	artworkUrl: string | null;
	isArtworkDragActive: boolean;
	isPanningArtwork: boolean;
	artworkPosition: { x: number; y: number };
	artworkZoom: number;
	handleArtworkPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
	handleArtworkPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
	handleArtworkPointerUp: (e?: React.PointerEvent<HTMLDivElement>) => void;
	setIsArtworkDragActive: (value: boolean) => void;
	handleArtworkDrop: (e: React.DragEvent<HTMLDivElement>) => void;
	handleArtworkPick: () => void;
	handleDeleteArtwork: () => void;
	setArtworkZoom: React.Dispatch<React.SetStateAction<number>>;
}

export function ArtworkPanel({
	artworkInputRef,
	handleArtworkChange,
	artworkFrameRef,
	artworkUrl,
	isArtworkDragActive,
	isPanningArtwork,
	artworkPosition,
	artworkZoom,
	handleArtworkPointerDown,
	handleArtworkPointerMove,
	handleArtworkPointerUp,
	setIsArtworkDragActive,
	handleArtworkDrop,
	handleArtworkPick,
	handleDeleteArtwork,
	setArtworkZoom,
}: ArtworkPanelProps) {
	return (
		<div className="lg:col-span-4">
			<div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-90">
				<input ref={artworkInputRef} type="file" accept="image/*" className="hidden" onChange={handleArtworkChange} data-testid="upload-artwork-input" />

				<div
					ref={artworkFrameRef}
					className={`group relative aspect-square w-full overflow-hidden rounded border bg-chinese-black transition-colors ${
						artworkUrl
							? "border-transparent"
							: isArtworkDragActive
								? "border-dashed border-white-smoke"
								: "border-dashed border-[#444] hover:border-white-smoke"
					} ${artworkUrl ? (isPanningArtwork ? "cursor-grabbing" : "cursor-grab") : ""}`}
					style={{ touchAction: artworkUrl ? "none" : "auto", userSelect: "none" }}
					onPointerDown={handleArtworkPointerDown}
					onPointerMove={handleArtworkPointerMove}
					onPointerUp={handleArtworkPointerUp}
					onPointerCancel={handleArtworkPointerUp}
					onDragOver={(e) => {
						const isFileDrag = Array.from(e.dataTransfer.types || []).includes("Files");
						if (!isFileDrag) return;
						e.preventDefault();
						if (!isArtworkDragActive) setIsArtworkDragActive(true);
					}}
					onDragLeave={(e) => {
						const rel = e.relatedTarget as Node | null;
						if (!rel || !e.currentTarget.contains(rel)) setIsArtworkDragActive(false);
					}}
					onDrop={handleArtworkDrop}
				>
					{artworkUrl ? (
						<Image
							src={artworkUrl}
							alt="Artwork"
							fill
							className="object-cover"
							style={{
								transform: `translate(${artworkPosition.x * (artworkZoom - 1) * 50}%, ${artworkPosition.y * (artworkZoom - 1) * 50}%) scale(${artworkZoom})`,
								objectPosition: "50% 50%",
							}}
							draggable={false}
							onDragStart={(e) => e.preventDefault()}
							unoptimized
						/>
					) : (
						<button type="button" onClick={handleArtworkPick} data-testid="upload-artwork-add" className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 cursor-pointer">
							<PictureOutlined className="text-[100px] text-white-smoke transition-colors" />
							<span className="text-[15px] font-semibold text-white-smoke transition-colors">Add new artwork</span>
						</button>
					)}

					{isArtworkDragActive && (
						<div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/45">
							<span className="rounded-full border border-white/55 px-4 py-2 text-[12px] font-semibold text-white-smoke">
								Drop image here
							</span>
						</div>
					)}

					{artworkUrl && (
						<div
							className="absolute bottom-3 right-3 flex flex-col gap-2"
							data-artwork-control="true"
							onPointerDown={(e) => e.stopPropagation()}
						>
							<button
								type="button"
								title="Replace Image"
								onClick={handleArtworkPick}
								data-testid="upload-artwork-replace"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-chinese-black text-white-smoke transition-colors hover:bg-[#2a2b31] cursor-pointer"
								aria-label="Replace artwork"
							>
								<GrEdit className="text-[18px]" />
							</button>
							<button
								type="button"
								title="Remove Image"
								onClick={handleDeleteArtwork}
								data-testid="upload-artwork-delete"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-chinese-black text-white-smoke transition-colors hover:bg-[#2a2b31] cursor-pointer"
								aria-label="Delete artwork"
							>
								<RiDeleteBinLine className="text-[18px]" />
							</button>
						</div>
					)}
				</div>

				{artworkUrl && (
					<div className="mt-3 flex items-center gap-3 rounded-md bg-chinese-black px-3 py-2" data-artwork-control="true">
						<button
							type="button"
							onClick={() => setArtworkZoom((z) => Math.max(1, Number((z - 0.1).toFixed(2))))}
							data-testid="upload-artwork-zoom-out"
							className="text-white-smoke/90 hover:text-white"
							aria-label="Zoom out"
						>
							<MinusOutlined />
						</button>
						<input
							type="range"
							min={1} max={3} step={0.01}
							value={artworkZoom}
							onChange={(e) => setArtworkZoom(Number(e.target.value))}
							data-testid="upload-artwork-zoom-range"
							className="w-full accent-white-smoke"
							aria-label="Artwork zoom"
						/>
						<button
							type="button"
							onClick={() => setArtworkZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))))}
							data-testid="upload-artwork-zoom-in"
							className="text-white-smoke/90 hover:text-white"
							aria-label="Zoom in"
						>
							<PlusOutlined />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
