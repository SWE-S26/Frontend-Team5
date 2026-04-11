import { tracksService } from "@/services/tracks.service";
import { useCallback, useState } from "react";
import { CreateTrackRequest } from "@/types/tracks.types";

export function useCreateTrack() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);

	const createTrack = useCallback(
		async (data: CreateTrackRequest, onUploadProgress?: (progress: number) => void) => {
			setLoading(true);
			setError(null);
			setSuccess(null);
			try {
				const res = await tracksService.createTrack(data, onUploadProgress);
				setSuccess(true);
				return res.data;
			} catch (err: any) {
				const status = err.response?.status;
				const message =
					status === 413
						? "Upload failed: file is too large for the server limit."
						: err.response?.data?.message || "Something went wrong";
				setError(message);
				setSuccess(false);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	return { createTrack, loading, error, success };
}
