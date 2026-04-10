/* --------------- Privacy --------------- */
export interface PrivacySettings {
  allowMessagesAnyone: boolean;
  showActivityDiscovery: boolean;
  showFirstTopFan: boolean;
  showTrackTopFans: boolean;
}

export interface GetPrivacySettingsResponse {
  allowMessagesAnyone: boolean;
  showActivityDiscovery: boolean;
  showFirstTopFan: boolean;
  showTrackTopFans: boolean;
}

export interface UpdatePrivacySettingsRequest {
  allowMessagesAnyone?: boolean;
  showActivityDiscovery?: boolean;
  showFirstTopFan?: boolean;
  showTrackTopFans?: boolean;
}

export interface UpdatePrivacySettingsResponse {
  allowMessagesAnyone: boolean;
  showActivityDiscovery: boolean;
  showFirstTopFan: boolean;
  showTrackTopFans: boolean;
}



/* --------------- Notifications --------------- */
export type NotificationChannel = "email" | "devices" | "both" | "off";
export type NewMessageDevices = "everyone" | "followed" | "off";

export interface NewMessageNotification {
  email: boolean;
  devices: NewMessageDevices;
}

export interface NotificationSettings {
  newFollower: NotificationChannel;
  repostOfYourPost: NotificationChannel;
  newPostByFollowedUser: NotificationChannel;
  likesAndPlaysOnYourPost: NotificationChannel;
  commentOnYourPost: NotificationChannel;
  recommendedContent: NotificationChannel;
  updatesFromSoundcloud: NotificationChannel;
  soundcloudFeatureUpdatesEducation: NotificationChannel;
  surveysAndFeedback: NotificationChannel;
  promotionalPartnershipContent: NotificationChannel;
  soundcloudNewsletter: NotificationChannel;
  newMessage: NewMessageNotification;
}

export interface GetNotificationSettingsResponse extends NotificationSettings {}

export interface UpdateNotificationSettingsRequest {
  newFollower?: NotificationChannel;
  repostOfYourPost?: NotificationChannel;
  newPostByFollowedUser?: NotificationChannel;
  likesAndPlaysOnYourPost?: NotificationChannel;
  commentOnYourPost?: NotificationChannel;
  recommendedContent?: NotificationChannel;
  updatesFromSoundcloud?: NotificationChannel;
  soundcloudFeatureUpdatesEducation?: NotificationChannel;
  surveysAndFeedback?: NotificationChannel;
  promotionalPartnershipContent?: NotificationChannel;
  soundcloudNewsletter?: NotificationChannel;
  newMessage?: Partial<NewMessageNotification>;
}

export interface UpdateNotificationSettingsResponse extends NotificationSettings {}



/* --------------- Account --------------- */
export type Theme = "Light" | "Dark" | "Automatic";
export type Gender = "Male" | "Female";

export interface AccountSettings {
  theme: Theme;
  dateOfBirth: string; // "YYYY-MM-DD"
  gender: Gender;
}

export interface GetAccountSettingsResponse extends AccountSettings {}

export interface UpdateAccountSettingsRequest {
  theme?: Theme;
  dateOfBirth?: string;
  gender?: Gender;
}

export interface UpdateAccountSettingsResponse extends AccountSettings {}



/* --------------- Content --------------- */
export interface ContentSettings {
  rssFeedLink?: string;
  rssEmailDisplayed?: string;
  customFieldTitle?: string;
  category?: string;
  statsServiceUrlPrefix?: string;
  customAuthorName?: string;
  language?: string;
  subscriberRedirect?: string;
  containsExplicitContent?: boolean;
  includeInRssFeed?: boolean;
  creativeCommonsLicense?: boolean;
}

export interface GetContentSettingsResponse extends ContentSettings {}

export interface UpdateContentSettingsRequest extends ContentSettings {}

export interface UpdateContentSettingsResponse extends ContentSettings {}