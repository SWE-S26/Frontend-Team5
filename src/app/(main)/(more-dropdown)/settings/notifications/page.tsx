"use client";

import React, { useState, useEffect } from "react";
import { Select } from "antd";
import Button from "@/components/ui/Button";
import InfoPopover from "@/components/settings/InfoPopover"
import CB from "@/components/settings/CB"

import { useNotificationSettings } from "@/hooks/useSettings";
import {
  NotificationChannel,
  NotificationSettings,
  NewMessageNotification,
} from "@/types/settings.types";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifVal = boolean | string;
type SectionState = Record<string, { email: boolean; devices: NotifVal }>;

// ─── Constants ────────────────────────────────────────────────────────────────

const ACTIVITY_ROWS = [
  { key: "newFollower",  label: "New follower" },
  { key: "repost",       label: "Repost of your post" },
  { key: "newPost",      label: "New post by followed user" },
  { key: "likesPlays",   label: "Likes and plays on your post" },
  { key: "comment",      label: "Comment on your post" },
  { key: "recommended",  label: "Recommended Content" },
  { key: "newMessage",   label: "New message", hasInfo: true, dropdown: true },
];

const BEATZA_ROWS = [
  { key: "featureUpdates", label: "Beatza Feature Updates & Education" },
  { key: "surveys",        label: "Surveys and feedback" },
  { key: "promotional",    label: "Promotional & Partnership Content" },
  { key: "newsletter",     label: "Beatza newsletter" },
];

const DROPDOWN_OPTIONS = [
  { value: "everyone",  label: "Everyone" },
  { value: "followed",  label: "Following" },
  { value: "off",       label: "Off" },
];

const INFO_TEXT =
  "If you have disabled 'Receive messages from anyone' in your privacy settings, you will only ever receive messages and notifications from people you follow.";

const CELL = "w-[52px]";

const UI_KEY_TO_API_KEY: Record<string, keyof NotificationSettings> = {
  newFollower:    "newFollower",
  repost:         "repostOfYourPost",
  newPost:        "newPostByFollowedUser",
  likesPlays:     "likesAndPlaysOnYourPost",
  comment:        "commentOnYourPost",
  recommended:    "recommendedContent",
  newMessage:     "newMessage",
  featureUpdates: "soundcloudFeatureUpdatesEducation",
  surveys:        "surveysAndFeedback",
  promotional:    "promotionalPartnershipContent",
  newsletter:     "soundcloudNewsletter",
};

// ─── Conversion helpers ───────────────────────────────────────────────────────

const channelToState = (val: NotificationChannel) => ({
  email:   val === "email"   || val === "both",
  devices: val === "devices" || val === "both",
});

const stateToChannel = (email: boolean, devices: boolean): NotificationChannel => {
  if (email && devices) return "both";
  if (email)            return "email";
  if (devices)          return "devices";
  return "off";
};

const apiSettingsToSectionState = (
  settings: NotificationSettings,
  rows: typeof ACTIVITY_ROWS
): SectionState =>
  Object.fromEntries(
    rows.map((r) => {
      const apiKey = UI_KEY_TO_API_KEY[r.key];

      if (r.dropdown) {
        const val = settings[apiKey] as NewMessageNotification;
        return [r.key, { email: val.email, devices: val.devices }];
      }

      const val = settings[apiKey] as NotificationChannel;
      return [r.key, channelToState(val)];
    })
  );

const sectionStateToPatchPayload = (
  rows: typeof ACTIVITY_ROWS,
  state: SectionState
): Record<string, unknown> =>
  Object.fromEntries(
    rows.map((r) => {
      const apiKey = UI_KEY_TO_API_KEY[r.key];
      if (r.dropdown) {
        return [apiKey, { email: state[r.key].email, devices: state[r.key].devices }];
      }
      return [apiKey, stateToChannel(state[r.key].email, state[r.key].devices as boolean)];
    })
  );

// ─── Header checked helper ────────────────────────────────────────────────────

const headerChecked = (
  rows: typeof ACTIVITY_ROWS,
  state: SectionState,
  col: "email" | "devices"
) =>
  rows.every((r) =>
    col === "devices" && r.dropdown
      ? state[r.key].devices !== "off"
      : state[r.key][col] === true
  );

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Notifications() {
  const { settings, loading, saveStatus, updateSettings } = useNotificationSettings();

  const [activities, setActivities] = useState<SectionState | null>(null);
  const [beatza, setBeatza]         = useState<SectionState | null>(null);

  // Snapshot of what was last fetched from the API — used for Cancel rollback
  const [savedActivities, setSavedActivities] = useState<SectionState | null>(null);
  const [savedBeatza, setSavedBeatza]         = useState<SectionState | null>(null);

  useEffect(() => {
    if (!settings) return;
    const a = apiSettingsToSectionState(settings, ACTIVITY_ROWS);
    const b = apiSettingsToSectionState(settings, BEATZA_ROWS);
    setActivities(a);
    setBeatza(b);
    setSavedActivities(a);
    setSavedBeatza(b);
  }, [settings]);

  const isDirty =
    JSON.stringify(activities) !== JSON.stringify(savedActivities) ||
    JSON.stringify(beatza)     !== JSON.stringify(savedBeatza);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const update = (
    setter: typeof setActivities,
    key: string,
    col: "email" | "devices",
    val: NotifVal
  ) => {
    setter((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: { ...prev[key], [col]: val } };
    });
  };

  const updateAll = (
    setter: typeof setActivities,
    rows: typeof ACTIVITY_ROWS,
    col: "email" | "devices",
    checked: boolean
  ) => {
    setter((prev) => {
      if (!prev) return prev;
      return Object.fromEntries(
        rows.map((r) => [
          r.key,
          {
            ...prev[r.key],
            [col]: col === "devices" && r.dropdown ? (checked ? "everyone" : "off") : checked,
          },
        ])
      );
    });
  };

  const handleSave = () => {
    if (!activities || !beatza) return;

    const payload = {
      ...sectionStateToPatchPayload(ACTIVITY_ROWS, activities),
      ...sectionStateToPatchPayload(BEATZA_ROWS, beatza),
    };

    updateSettings(payload);

    // Update snapshot so isDirty resets after save
    setSavedActivities(activities);
    setSavedBeatza(beatza);
  };

  const handleCancel = () => {
    setActivities(savedActivities);
    setBeatza(savedBeatza);
  };

  // ── Render section ───────────────────────────────────────────────────────────

  const renderSection = (
    title: string,
    rows: typeof ACTIVITY_ROWS,
    state: SectionState,
    setter: typeof setActivities
  ) => (
    <div>
      <div className="flex items-center mb-2">
        <span className="flex-1 text-base font-bold text-white-smoke">{title}</span>

        <div className="flex items-center gap-2 mr-6">
          <div className={`${CELL} flex justify-center`}>
            <CB
              checked={headerChecked(rows, state, "email")}
              onChange={(v) => updateAll(setter, rows, "email", v)}
            />
          </div>
          <span className="text-xs font-bold text-white-smoke">Email</span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`${CELL} flex justify-center`}>
            <CB
              checked={headerChecked(rows, state, "devices")}
              onChange={(v) => updateAll(setter, rows, "devices", v)}
            />
          </div>
          <span className="text-xs font-bold text-white-smoke">Devices</span>
        </div>
      </div>

      {rows.map((row) => {
        const devicesVal = state[row.key].devices;
        return (
          <div key={row.key} className="flex items-center py-3 font-bold">
            <span className="flex-1 text-sm text-white-smoke flex items-center">
              {row.label}
              {row.hasInfo && <InfoPopover text={INFO_TEXT} className="w-90"/>}
            </span>

            <div className="flex items-center gap-2 mr-6">
              <div className={`${CELL} flex justify-center`}>
                <CB
                  checked={state[row.key].email}
                  onChange={(v) => update(setter, row.key, "email", v)}
                />
              </div>
              <span className="text-xs invisible select-none">Email</span>
            </div>

            <div className="flex items-center gap-2">
              <div className={`${CELL} flex justify-center`}>
                {row.dropdown ? (
                  <Select
                    value={devicesVal as string}
                    onChange={(val) => update(setter, row.key, "devices", val)}
                    options={DROPDOWN_OPTIONS}
                    size="small"
                    style={{ width: 110 }}
                    classNames={{ popup: { root: "notif-dropdown-popup" } }}
                    className="notif-select"
                  />
                ) : (
                  <CB
                    checked={devicesVal as boolean}
                    onChange={(v) => update(setter, row.key, "devices", v)}
                  />
                )}
              </div>
              <span className="text-xs invisible select-none">Devices</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading || !activities || !beatza) {
    return <div className="max-w-2xl text-white-smoke/40 text-sm">Loading...</div>;
  }

  return (
    <>
      <div className="max-w-2xl text-white-smoke space-y-10">
        {renderSection("Activities",          ACTIVITY_ROWS, activities, setActivities)}
        {renderSection("Updates from Beatza", BEATZA_ROWS,   beatza,     setBeatza)}

        <div className="flex justify-end gap-3">
          <Button
            onClick={handleCancel}
            className="text-white-smoke"
          >
            Cancel
          </Button>
          <Button
            disabled={!isDirty || saveStatus === "saving"}
            onClick={handleSave}
            className="bg-white-smoke text-chinese-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saveStatus === "saving" ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </>
  );
}