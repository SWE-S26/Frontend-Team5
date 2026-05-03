"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";

import PrivacySettingRow from "@/components/settings/PrivacySettingRow";
import BlockedUserRow from "@/components/settings/BlockedUserRow";
import { usePrivacySettings } from "@/hooks/useSettings";
import { useGetBlockedUsers, useUnblockUser } from "@/hooks/useSocial";
import { PrivacySettings } from "@/types/settings.types";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIVACY_SETTINGS: {
  key: keyof PrivacySettings;
  label: string;
  description: string;
}[] = [
  {
    key: "allowMessagesAnyone",
    label: "Receive messages from anyone",
    description:
      "For your safety, we recommend only allowing messages from people you follow. Turning this on will allow anyone to send you messages.",
  },
  {
    key: "showActivityDiscovery",
    label: "Show my activities in social discovery playlists and modules",
    description:
      "Your Likes, Reactions and other engagement may be shown to other users in discovery features such as 'Liked By' playlists or update feeds. Turning this off won't hide your Likes on your profile or tracks.",
  },
  {
    key: "showFirstTopFan",
    label: "Show when I'm a First or Top Fan",
    description: "Appear in public Top Fans and First Fans lists",
  },
  {
    key: "showTrackTopFans",
    label: "Show First and Top Fans for my tracks",
    description: "Your First and Top Fans will appear on your tracks",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Privacy() {
  const { settings, loading, saveStatus, updateSetting } = usePrivacySettings();
  const { getBlockedUsers, blockedUsers, loading: blockedLoading } = useGetBlockedUsers();
  const { unblockUser } = useUnblockUser();

  useEffect(() => {
    getBlockedUsers();
  }, [getBlockedUsers]);

  const handleUnblock = async (userId: string) => {
    await unblockUser(userId);
    getBlockedUsers();
  };

  return (
    <div className="w-full max-w-3xl text-white-smoke mb-10">
      {/* Privacy settings */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Privacy settings</h2>

        <span
          className={`
            flex items-center gap-1.5 text-sm text-white-smoke/60
            transition-opacity duration-300
            ${saveStatus === "idle" ? "opacity-0" : "opacity-100"}
          `}
        >
          {saveStatus === "saving" && (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white-smoke/30 border-t-white-smoke/80 animate-spin inline-block" />
              Saving...
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check size={14} strokeWidth={2.5} />
              Changes saved
            </>
          )}
          {saveStatus === "error" && <span className="text-red-400">Failed to save</span>}
        </span>
      </div>

      <div>
        {PRIVACY_SETTINGS.map((setting) => (
          <PrivacySettingRow
            key={setting.key}
            label={setting.label}
            description={setting.description}
            checked={loading ? true : (settings?.[setting.key] ?? true)}
            onChange={(value) => updateSetting(setting.key, value)}
          />
        ))}
      </div>

      {/* Blocked users */}
      <div className="pt-15">
        <h2 className="text-lg font-bold mb-4">Blocked users</h2>

        {blockedLoading ? (
          <p className="text-sm text-white-smoke/40">Loading...</p>
        ) : !blockedUsers || blockedUsers.length === 0 ? (
          <p className="text-sm text-white-smoke/40">You haven't blocked anyone.</p>
        ) : (
          <div className="divide-y divide-white-smoke/10">
            {blockedUsers.map((user) => (
              <BlockedUserRow
                key={user.userId}
                userId={user.userId}
                displayName={user.displayName}
                profileImgLink={user.profileImgLink ?? "/placeholder-avatar.png"}
                onUnblock={() => handleUnblock(user.userId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
