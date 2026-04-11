import api from "@/lib/api";

import {
	CreateTrackRequest,
	CreateTrackResponse,
} from "@/types/tracks.types";

export const tracksService = {
	createTrack: (data: CreateTrackRequest, onUploadProgress?: (progress: number) => void) => {
		const formData = new FormData();

		formData.append("audio", data.audio);
		if (data.image) {
			formData.append("image", data.image);
		}

		formData.append("basicInfo", JSON.stringify(data.basicInfo));
		if (data.permissions) {
			formData.append("permissions", JSON.stringify(data.permissions));
		}
		if (data.license) {
			formData.append("license", JSON.stringify(data.license));
		}
		if (data.advanced) {
			formData.append("advanced", JSON.stringify(data.advanced));
		}

		return api.post<CreateTrackResponse>("/api/tracks/v1", formData, {
			headers: { "Content-Type": "multipart/form-data" },
			onUploadProgress: onUploadProgress
				? (event) => {
						if (!event.total) return;
						const percent = Math.round((event.loaded / event.total) * 100);
						onUploadProgress(percent);
					}
				: undefined,
		});
	},
};
