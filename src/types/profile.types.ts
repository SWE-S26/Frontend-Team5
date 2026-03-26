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