export interface ProfileLink {
  linkId: string
  name:   string
  link:   string
}

export interface GetProfileResponse {
  userId:          string
  displayName:     string
  firstName:       string | null
  lastName:        string | null
  profileLink:     string
  profileImgLink:  string | null
  bannerImgLink:   string | null
  bio:             string | null
  city:            string | null
  country:         string | null
  links:           ProfileLink[]
  bannerLinks:     ProfileLink[]
  supportLink:     string | null
  role:            string
  isPaid:          boolean
  isPrivate:       boolean
  favoriteGenres:  string[]
  followersCount:  number
  followedCount:   number
  trackCount:      number
  isFollowed: boolean
  isBlocked:  boolean
  amIBlocked: boolean
}

export interface GetProfileErrorResponse {
  success: boolean
  message: string
  code:    number
}

export interface UpdateProfileRequest {
  displayName?:    string
  firstName?:      string
  lastName?:       string
  profileLink?:    string
  bio?:            string
  city?:           string
  country?:        string
  links?:          ProfileLink[]
  bannerLinks?:    ProfileLink[]
  supportLink?:    string
  favoriteGenres?: string[]
  isPrivate?:      boolean
}

export interface UpdateProfileResponse {
  displayName:    string
  firstName:      string | null
  lastName:       string | null
  profileLink:    string
  bio:            string | null
  city:           string | null
  country:        string | null
  profileImgLink: string | null
  bannerImgLink:  string | null
  links:          ProfileLink[]
  bannerLinks:    ProfileLink[]
  supportLink:    string | null
  favoriteGenres: string[]
  
}

export interface UpdateProfileImagesRequest {
  profileImg?:       File
  bannerImg?:        File
  removeProfileImg?: boolean
  removeBannerImg?:  boolean
}

export interface UpdateProfileImagesResponse {
  userId:          string
  displayName:     string
  firstName:       string | null
  lastName:        string | null
  profileLink:     string
  profileImgLink:  string | null
  bannerImgLink:   string | null
  bio:             string | null
  city:            string | null
  country:         string | null
  links:           ProfileLink[]
  bannerLinks:     ProfileLink[]
  supportLink:     string | null
  role:            string
  isPaid:          boolean
  isPrivate:       boolean
  favoriteGenres:  string[]
  followersCount:  number
  followedCount:   number
  trackCount:      number
}