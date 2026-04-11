//* ======================== API Integration ======================== */

export interface CreateTrackBasicInfo {
	title: string;
	permalink: string;
	mainArtists: string[];
	genre?: string;
	tags?: string[];
	description?: string;
	isPrivate: boolean;
	caption?: string;
}

export interface CreateTrackPermissions {
	enableDirectDownload?: boolean;
	offlineListening?: boolean;
	includeInRssFeed?: boolean;
	displayedEmbedCode?: boolean;
	enableAppPlayback?: boolean;
}

export interface CreateTrackLicense {
	type?: "allRightsReserved" | "creativeCommons";
	attribution?: boolean;
	nonCommercial?: boolean;
	noDerivativeWorks?: boolean;
	shareAlike?: boolean;
}

export interface CreateTrackAdvanced {
	buyLink?: string;
	recordLabel?: string;
	releaseDate?: string;
	publisher?: string;
	ISRC?: string;
	explicitContent?: boolean;
	pLine?: string;
	audioClipStart?: number;
	audioClipEnd?: number;
	composer?: string;
	ISWC?: string;
	albumTitle?: string;
}

export interface CreateTrackRequest {
	audio: File;
	image?: File;
	basicInfo: CreateTrackBasicInfo;
	permissions?: CreateTrackPermissions;
	license?: CreateTrackLicense;
	advanced?: CreateTrackAdvanced;
}

export interface CreateTrackValidationError {
	field: string;
	message: string;
}

export interface CreateTrackResponse {
	message: string;
	errors?: CreateTrackValidationError[];
	data?: {
		id?: string;
	};
}