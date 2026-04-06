export interface ProfileLink {
  linkId: string
  name:   string
  link:   string
}

export interface GetProfileResponse {
  userId:         string
  displayName:    string
  firstName:      string | null
  lastName:       string | null
  profileLink:    string
  profileImgLink: string | null
  bannerImgLink:  string | null
  bio:            string | null
  city:           string | null
  country:        string | null
  links:          ProfileLink[]
  supportLink:    string | null
  favoriteGenres: string[]
  followersCount: number
  followedCount:  number
  trackCount:     number
}

export interface GetProfileErrorResponse {
  success: boolean
  message: string
  code:    number
}

export interface UpdateProfileRequest {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  profileLink?: string;
  bio?: string;
  city?: string;
  country?: string;
  profileImgLink?: string;
  bannerImgLink?: string;
  links?: ProfileLink[];
  bannerLinks?: ProfileLink[];
  supportLink?: string;
  favoriteGenres?: string[];
}

export interface UpdateProfileResponse {
  displayName: string;
  firstName: string;
  lastName: string;
  profileLink: string;
  bio: string;
  city: string;
  country: string;
  profileImgLink: string;
  bannerImgLink: string;
  links: ProfileLink[];
  bannerLinks: ProfileLink[];
  supportLink: string;
  favoriteGenres: string[];
}

export interface UpdateProfileImagesRequest {
  profileImage?: File
  bannerImage?: File
  removeProfileImg?: boolean
  removeBannerImg?: boolean
}

export interface UpdateProfileImagesResponse {
  profileImgLink: string | null
  bannerImgLink:  string | null
}