"use client";

import { useEffect, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";

type DeleteTrackModalProps = {
	isOpen: boolean;
	trackTitle?: string;
	isLoading?: boolean;
	error?: string | null;
	onClose: () => void;
	onConfirm: () => void;
};

export function DeleteTrackModal({
	isOpen,
	trackTitle,
	isLoading = false,
	error,
	onClose,
	onConfirm,
}: DeleteTrackModalProps) {
	const [shouldRender, setShouldRender] = useState(false);
	const [animate, setAnimate] = useState(false);
	const [confirmed, setConfirmed] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			const timer = setTimeout(() => setAnimate(true), 20);
			return () => clearTimeout(timer);
		}

		setAnimate(false);
		setConfirmed(false);
		const timer = setTimeout(() => setShouldRender(false), 300);
		return () => clearTimeout(timer);
	}, [isOpen]);

	if (!shouldRender) return null;

	const displayTitle = trackTitle?.trim() || "this track";

	return (
		<div
			className={`fixed inset-0 z-1001 flex items-start sm:items-center justify-center overflow-y-auto p-4 sm:p-0 bg-login transition-opacity duration-500 ease-in-out ${
				animate ? "opacity-100" : "opacity-0"
			}`}
		>
			<div
				className={`relative mt-6 sm:mt-0 w-full max-w-110 max-h-[95vh] overflow-y-auto pb-10 p-6 sm:p-8 bg-chinese-black text-white-smoke shadow-2xl border rounded border-white/10 transform transition-transform duration-500 ${
					animate ? "translate-y-0" : "-translate-y-[150vh]"
				}`}
			>
				<div className="flex flex-col gap-5">
					<div className="flex items-center gap-3">
						<IoWarningOutline size={28} className="text-red-500 shrink-0" />
						<h2 className="text-xl font-bold">Delete Track</h2>
					</div>

					<p className="text-silver text-sm leading-relaxed">
						Are you sure you want to permanently delete <span className="text-white-smoke font-semibold">{displayTitle}</span>? This action <span className="text-white-smoke font-semibold">cannot be undone</span>.
					</p>

					<ul className="text-silver text-sm space-y-1 list-disc list-inside">
						<li>The track file and cover art association</li>
						<li>Track statistics and engagement history</li>
						<li>Its availability in your posted tracks list</li>
					</ul>

					<label className="flex items-start gap-3 cursor-pointer group">
						<input
							type="checkbox"
							checked={confirmed}
							onChange={(e) => setConfirmed(e.target.checked)}
							data-testid="artist-delete-track-confirm-checkbox"
							className="mt-0.5 accent-red-500 cursor-pointer"
						/>
						<span className="text-silver text-xs leading-relaxed group-hover:text-white-smoke transition-colors">
							Yes, I understand this is permanent and I want to delete this track.
						</span>
					</label>

					{error && <p className="text-red-500 text-xs">{error}</p>}

					<div className="flex justify-end gap-3 pt-2">
						<Button
							onClick={onClose}
							disabled={isLoading}
							data-testid="artist-delete-track-cancel"
							className="text-silver hover:text-white-smoke bg-off-black disabled:opacity-40 disabled:cursor-not-allowed"
						>
							Cancel
						</Button>
						<Button
							onClick={onConfirm}
							disabled={!confirmed || isLoading}
							data-testid="artist-delete-track-confirm"
							className="text-white-smoke bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
						>
							{isLoading ? "Deleting..." : "Delete track"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
