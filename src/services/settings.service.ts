import api from "@/lib/api";

import {
  GetPrivacySettingsResponse, UpdatePrivacySettingsRequest, UpdatePrivacySettingsResponse,
  GetNotificationSettingsResponse, UpdateNotificationSettingsRequest, UpdateNotificationSettingsResponse,
  GetAccountSettingsResponse, UpdateAccountSettingsRequest, UpdateAccountSettingsResponse,
  GetContentSettingsResponse, UpdateContentSettingsRequest, UpdateContentSettingsResponse,
} from "@/types/settings.types";



/* --------------- Privacy --------------- */
export const getPrivacySettings = async (): Promise<GetPrivacySettingsResponse> => {
  const response = await api.get<GetPrivacySettingsResponse>(
    "/api/profile/v1/settings/privacy"
  );
  return response.data;
};

export const updatePrivacySettings = async (
  data: UpdatePrivacySettingsRequest
): Promise<UpdatePrivacySettingsResponse> => {
  const response = await api.patch<UpdatePrivacySettingsResponse>(
    "/api/profile/v1/settings/privacy",
    data
  );
  return response.data;
};



/* --------------- Notifications --------------- */
export const getNotificationSettings = async (): Promise<GetNotificationSettingsResponse> => {
  const response = await api.get<GetNotificationSettingsResponse>(
    "/api/profile/v1/settings/notifications"
  );
  return response.data;
};

export const updateNotificationSettings = async (
  data: UpdateNotificationSettingsRequest
): Promise<UpdateNotificationSettingsResponse> => {
  const response = await api.patch<UpdateNotificationSettingsResponse>(
    "/api/profile/v1/settings/notifications",
    data
  );
  return response.data;
};



/* --------------- Account --------------- */
export const getAccountSettings = async (): Promise<GetAccountSettingsResponse> => {
  const response = await api.get<GetAccountSettingsResponse>(
    "/api/profile/v1/settings/account"
  );
  return response.data;
};

export const updateAccountSettings = async (
  data: UpdateAccountSettingsRequest
): Promise<UpdateAccountSettingsResponse> => {
  const response = await api.patch<UpdateAccountSettingsResponse>(
    "/api/profile/v1/settings/account",
    data
  );
  return response.data;
};



/* --------------- Content --------------- */
export const getContentSettings = async (): Promise<GetContentSettingsResponse> => {
  const response = await api.get<GetContentSettingsResponse>(
    "/api/profile/v1/settings/content"
  );
  return response.data;
};

export const updateContentSettings = async (
  data: UpdateContentSettingsRequest
): Promise<UpdateContentSettingsResponse> => {
  const response = await api.patch<UpdateContentSettingsResponse>(
    "/api/profile/v1/settings/content",
    data
  );
  return response.data;
};