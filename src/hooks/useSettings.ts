import { useState, useEffect, useRef } from "react";

import {
  PrivacySettings,
  NotificationSettings, UpdateNotificationSettingsRequest,
  AccountSettings, UpdateAccountSettingsRequest,
  ContentSettings, UpdateContentSettingsRequest,
} from "@/types/settings.types";

import {
  getPrivacySettings, updatePrivacySettings,
  getNotificationSettings, updateNotificationSettings,
  getAccountSettings, updateAccountSettings,
  getContentSettings, updateContentSettings,
} from "@/services/settings.service";

type SaveStatus = "idle" | "saving" | "saved" | "error";

/* --------------- Privacy --------------- */
interface UsePrivacySettingsReturn {
  settings: PrivacySettings | null;
  loading: boolean;
  saveStatus: SaveStatus;
  updateSetting: (key: keyof PrivacySettings, value: boolean) => Promise<void>;
}

export const usePrivacySettings = (): UsePrivacySettingsReturn => {
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getPrivacySettings();
        setSettings(data);
      } catch {
        // handle error if needed
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSetting = async (key: keyof PrivacySettings, value: boolean) => {
    if (!settings) return;

    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));

    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("saving");

    try {
      const updated = await updatePrivacySettings({ [key]: value });
      setSettings(updated);
      setSaveStatus("saved");
    } catch {
      setSettings((prev) => (prev ? { ...prev, [key]: !value } : prev));
      setSaveStatus("error");
    } finally {
      timerRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
    }
  };

  return { settings, loading, saveStatus, updateSetting };
};



/* --------------- Notifications --------------- */
interface UseNotificationSettingsReturn {
  settings: NotificationSettings | null;
  loading: boolean;
  saveStatus: SaveStatus;
  updateSettings: (data: UpdateNotificationSettingsRequest) => Promise<void>;
}

export const useNotificationSettings = (): UseNotificationSettingsReturn => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getNotificationSettings();
        setSettings(data);
      } catch {
        // handle error if needed
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (data: UpdateNotificationSettingsRequest) => {
    if (!settings) return;

    setSettings((prev) => {
      if (!prev) return prev;
      if (data.newMessage) {
        return {
          ...prev,
          ...data,
          newMessage: { ...prev.newMessage, ...data.newMessage } as NotificationSettings["newMessage"],
        };
      }
      return { ...prev, ...data } as NotificationSettings;
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("saving");

    try {
      const updated = await updateNotificationSettings(data);
      setSettings(updated);
      setSaveStatus("saved");
    } catch {
      setSettings(settings);
      setSaveStatus("error");
    } finally {
      timerRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
    }
  };

  return { settings, loading, saveStatus, updateSettings };
};



/* --------------- Account --------------- */
interface UseAccountSettingsReturn {
  settings: AccountSettings | null;
  loading: boolean;
  saveStatus: SaveStatus;
  updateSettings: (data: UpdateAccountSettingsRequest) => Promise<void>;
}

export const useAccountSettings = (): UseAccountSettingsReturn => {
  const [settings, setSettings] = useState<AccountSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getAccountSettings();
        setSettings(data);
      } catch {
        // handle error if needed
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (data: UpdateAccountSettingsRequest) => {
    if (!settings) return;

    setSettings((prev) => (prev ? { ...prev, ...data } : prev));

    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("saving");

    try {
      const updated = await updateAccountSettings(data);
      setSettings(updated);
      setSaveStatus("saved");
    } catch {
      setSettings(settings);
      setSaveStatus("error");
    } finally {
      timerRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
    }
  };

  return { settings, loading, saveStatus, updateSettings };
};



/* --------------- Content --------------- */
interface UseContentSettingsReturn {
  settings: ContentSettings | null;
  loading: boolean;
  saveStatus: SaveStatus;
  updateSettings: (data: UpdateContentSettingsRequest) => Promise<void>;
}

export const useContentSettings = (): UseContentSettingsReturn => {
  const [settings, setSettings] = useState<ContentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getContentSettings();
        setSettings(data);
      } catch {
        // handle error if needed
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (data: UpdateContentSettingsRequest) => {
    if (!settings) return;

    setSettings((prev) => (prev ? { ...prev, ...data } : prev));

    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("saving");

    try {
      const updated = await updateContentSettings(data);
      setSettings(updated);
      setSaveStatus("saved");
    } catch {
      setSettings(settings);
      setSaveStatus("error");
    } finally {
      timerRef.current = setTimeout(() => setSaveStatus("idle"), 2500);
    }
  };

  return { settings, loading, saveStatus, updateSettings };
};