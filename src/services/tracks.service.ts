import api from "@/lib/api";
import { GetPostedTracksResponse, GetTracksResponse } from "@/types/tracks.types";

import {
	CreateTrackRequest,
	CreateTrackResponse,
	GetTrackByIdResponse,
	UpdateTrackRequest,
	UpdateTrackResponse,
	incrementPlayCountResponse,
	deleteTrackResponse,
	GetUploadQuotaResponse,
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
	getTracks: (page: number, limit: number) =>
		api.get<GetTracksResponse>(
			`/api/public/tracks/v1/?page=${page}&limit=${limit}`,
		),
	getPostedTracks: (userId: string) =>
		api.get<GetPostedTracksResponse>(`/api/public/tracks/v1/posted/${userId}`),
	getTrackById: (id: string) =>
		api.get<GetTrackByIdResponse>(`/api/public/tracks/v1/${id}`),

	UpdateTrack: (data: UpdateTrackRequest) => {
		const formData = new FormData();

		formData.append("id", data.id);
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

		return api.patch<UpdateTrackResponse>("/api/tracks/v1", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
	},

	incrementPlayCount: (id: string) =>
		api.patch<incrementPlayCountResponse>(`/api/tracks/v1/listen/${id}`),

	deleteTrack: (id: string) =>
		api.delete<deleteTrackResponse>(`/api/tracks/v1/${id}`),
	getUploadQuota: (userId: string) =>
		api.get<GetUploadQuotaResponse>(`/api/tracks/v1/quota/${userId}`),
};
