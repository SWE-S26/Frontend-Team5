
export interface ProfileLink {
  linkId: string
  name:   string
  link:   string
}
export interface GetProfileResponse {
  userId:          string
  displayName:     string
  firstName:       string
  lastName:        string
  profileLink:     string
  profileImgLink:  string
  bannerImgLink:   string
  bio:             string
  city:            string
  country:         string
  links:           ProfileLink[]
  bannerLinks:     ProfileLink[]
  supportLink:     string
  role:            string
  isPaid:          boolean
  favoriteGenres:  string[]
  followersCount:  number
  followingsCount: number
  trackCount:      number
}
export interface GetProfileErrorResponse {
  success: boolean
  message: string
  code:    number
}