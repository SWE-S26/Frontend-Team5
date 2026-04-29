"use client";

interface FooterProps {
	isSubmitting: boolean;
	handleSave: () => void;
}

export function Footer({ isSubmitting, handleSave }: FooterProps) {
	return (
		<div className="fixed z-100 bottom-0 left-0 right-0 border-t border-silver/25 bg-chinese-black/90 px-4 py-4 sm:px-6 sm:py-5">
			<div className="relative mx-auto flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
				<p className="text-center text-[11px] text-white-smoke sm:pointer-events-none sm:absolute sm:left-1/2 sm:-translate-x-1/2">
					By uploading, you confirm that your sounds comply with our{" "}
					<button data-testid="upload-terms" className="pointer-events-auto text-white-smoke underline cursor-pointer">Terms of Use</button>{" "}
					and you don&apos;t infringe anyone else&apos;s rights.
				</p>
				<button
					onClick={handleSave}
					disabled={isSubmitting}
					data-testid="upload-submit"
					className="w-full rounded-full bg-[#1db954] px-12 py-2 text-[13px] font-bold text-chines-black transition-colors hover:bg-[#1ed760] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
				>
					{isSubmitting ? "Uploading..." : "Upload"}
				</button>
			</div>
		</div>
	);
}
