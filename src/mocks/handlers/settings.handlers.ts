import { http, HttpResponse } from "msw";
import { 
  GetPrivacySettingsResponse,
  GetNotificationSettingsResponse,
  GetAccountSettingsResponse,
  GetContentSettingsResponse,
} from "@/types/settings.types";



/* --------------- Privacy --------------- */
let mockPrivacySettings: GetPrivacySettingsResponse = {
  allowMessagesAnyone: true,
  showActivityDiscovery: true,
  showFirstTopFan: true,
  showTrackTopFans: true,
};

export const privacyHandlers = [
  http.get("/api/profile/v1/settings/privacy", () => {
    return HttpResponse.json(mockPrivacySettings);
  }),

  http.patch("/api/profile/v1/settings/privacy", async ({ request }) => {
    const body = await request.json() as Partial<GetPrivacySettingsResponse>;
    mockPrivacySettings = { ...mockPrivacySettings, ...body };
    return HttpResponse.json(mockPrivacySettings);
  }),
];



/* --------------- Notifications --------------- */
let mockNotificationSettings: GetNotificationSettingsResponse = {
  newFollower: "devices",
  repostOfYourPost: "devices",
  newPostByFollowedUser: "devices",
  likesAndPlaysOnYourPost: "devices",
  commentOnYourPost: "devices",
  recommendedContent: "devices",
  updatesFromSoundcloud: "devices",
  soundcloudFeatureUpdatesEducation: "devices",
  surveysAndFeedback: "devices",
  promotionalPartnershipContent: "off",
  soundcloudNewsletter: "email",
  newMessage: { email: true, devices: "everyone" },
};

export const notificationHandlers = [
  http.get("/api/profile/v1/settings/notifications", () => {
    return HttpResponse.json(mockNotificationSettings);
  }),

  http.patch("/api/profile/v1/settings/notifications", async ({ request }) => {
    const body = await request.json() as Partial<GetNotificationSettingsResponse>;
    mockNotificationSettings = { ...mockNotificationSettings, ...body };
    return HttpResponse.json(mockNotificationSettings);
  }),
];



/* --------------- Account --------------- */
let mockAccountSettings: GetAccountSettingsResponse = {
  theme: "Dark",
  dateOfBirth: "1988-01-01",
  gender: "Male",
};

export const accountHandlers = [
  http.get("/api/profile/v1/settings/account", () => {
    return HttpResponse.json(mockAccountSettings);
  }),

  http.patch("/api/profile/v1/settings/account", async ({ request }) => {
    const body = await request.json() as Partial<GetAccountSettingsResponse>;
    mockAccountSettings = { ...mockAccountSettings, ...body };
    return HttpResponse.json(mockAccountSettings);
  }),
];



/* --------------- Content --------------- */
let mockContentSettings: GetContentSettingsResponse = {
  rssFeedLink: "https://feeds.beatza.com/users/beatza:users:247604908/sounds.rss",
  rssEmailDisplayed: "none",
  customFieldTitle: "",
  category: "",
  statsServiceUrlPrefix: "",
  customAuthorName: "",
  language: "en",
  subscriberRedirect: "",
  containsExplicitContent: false,
  includeInRssFeed: false,
  creativeCommonsLicense: false,
};

export const contentHandlers = [
  http.get("/api/profile/v1/settings/content", () => {
    return HttpResponse.json(mockContentSettings);
  }),

  http.patch("/api/profile/v1/settings/content", async ({ request }) => {
    const body = await request.json() as Partial<GetContentSettingsResponse>;
    mockContentSettings = { ...mockContentSettings, ...body };
    return HttpResponse.json(mockContentSettings);
  }),
];