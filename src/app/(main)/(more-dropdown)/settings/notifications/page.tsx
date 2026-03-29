"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Select } from "antd";
import Button from "@/components/ui/Button";

type NotifVal = boolean | string;
type SectionState = Record<string, { email: boolean; devices: NotifVal }>;

const ACTIVITY_ROWS = [
  { key: "newFollower", label: "New follower" },
  { key: "repost",      label: "Repost of your post" },
  { key: "newPost",     label: "New post by followed user" },
  { key: "likesPlays",  label: "Likes and plays on your post" },
  { key: "comment",     label: "Comment on your post" },
  { key: "recommended", label: "Recommended Content" },
  { key: "newMessage",  label: "New message", hasInfo: true, dropdown: true },
];

const BEATZA_ROWS = [
  { key: "featureUpdates", label: "Beatza Feature Updates & Education" },
  { key: "surveys",        label: "Surveys and feedback" },
  { key: "promotional",    label: "Promotional & Partnership Content" },
  { key: "newsletter",     label: "Beatza newsletter" },
];

const DROPDOWN_OPTIONS = [
  { value: "everyone",  label: "Everyone" },
  { value: "following", label: "Following" },
  { value: "off",       label: "Off" },
];

const INFO_TEXT = "If you have disabled 'Receive messages from anyone' in your privacy settings, you will only ever receive messages and notifications from people you follow.";

const makeState = (rows: typeof ACTIVITY_ROWS): SectionState =>
  Object.fromEntries(
    rows.map((r) => [r.key, { email: !r.dropdown, devices: r.dropdown ? "everyone" : true }])
  );

const INITIAL_ACTIVITIES = makeState(ACTIVITY_ROWS);
const INITIAL_BEATZA     = makeState(BEATZA_ROWS);

const headerChecked = (rows: typeof ACTIVITY_ROWS, state: SectionState, col: "email" | "devices") =>
  rows.every((r) =>
    col === "devices" && r.dropdown ? state[r.key].devices !== "off" : state[r.key][col] === true
  );

function InfoPopover({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex ml-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#999999] text-[10px] select-none cursor-pointer hover:bg-white/30 transition-colors"
      >
        i
      </button>
      {open && (
        <div className="absolute left-0 top-6 z-50 w-84 rounded-lg bg-[#999999] p-4 shadow-xl">
          <p className="text-sm text-black leading-relaxed">{text}</p>
        </div>
      )}
    </div>
  );
}

function CB({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors border ${
        checked ? "bg-white-smoke border-white-smoke" : "bg-transparent border-white-smoke/50"
      }`}
    >
      {checked && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4L4 7.5L10 1" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// Each column is a fixed px width. The checkbox is always centered in that px box.
// The header label is rendered AFTER the checkbox, outside the box, so it never affects centering.
const CELL = "w-[52px]"; // same fixed width for header cell and row cell

export default function Notifications() {
  const [activities, setActivities] = useState<SectionState>(INITIAL_ACTIVITIES);
  const [beatza, setBeatza]         = useState<SectionState>(INITIAL_BEATZA);

  const isDirty = useMemo(
    () =>
      JSON.stringify(activities) !== JSON.stringify(INITIAL_ACTIVITIES) ||
      JSON.stringify(beatza)     !== JSON.stringify(INITIAL_BEATZA),
    [activities, beatza]
  );

  const update = (setter: typeof setActivities, key: string, col: "email" | "devices", val: NotifVal) =>
    setter((prev) => ({ ...prev, [key]: { ...prev[key], [col]: val } }));

  const updateAll = (setter: typeof setActivities, rows: typeof ACTIVITY_ROWS, col: "email" | "devices", checked: boolean) =>
    setter((prev) =>
      Object.fromEntries(
        rows.map((r) => [
          r.key,
          { ...prev[r.key], [col]: col === "devices" && r.dropdown ? (checked ? "everyone" : "off") : checked },
        ])
      )
    );

  const renderSection = (
    title: string,
    rows: typeof ACTIVITY_ROWS,
    state: SectionState,
    setter: typeof setActivities
  ) => (
    <div>
      {/* Header: checkbox cell is CELL wide, label floats after it */}
      <div className="flex items-center mb-2">
        <span className="flex-1 text-base font-bold text-white-smoke">{title}</span>

        {/* Email header */}
        <div className="flex items-center gap-2 mr-6">
          <div className={`${CELL} flex justify-center`}>
            <CB
              checked={headerChecked(rows, state, "email")}
              onChange={(v) => updateAll(setter, rows, "email", v)}
            />
          </div>
          <span className="text-xs font-bold text-white-smoke">Email</span>
        </div>

        {/* Devices header */}
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

      {/* Rows */}
      {rows.map((row) => {
        const devicesVal = state[row.key].devices;
        return (
          <div key={row.key} className="flex items-center py-3 font-bold">
            <span className="flex-1 text-sm text-white-smoke flex items-center">
              {row.label}
              {row.hasInfo && <InfoPopover text={INFO_TEXT} />}
            </span>

            {/* Email cell — same CELL width + mr-6 to match header gap */}
            <div className="flex items-center gap-2 mr-6">
              <div className={`${CELL} flex justify-center`}>
                <CB
                  checked={state[row.key].email}
                  onChange={(v) => update(setter, row.key, "email", v)}
                />
              </div>
              {/* invisible spacer to match "Email" label width so columns stay aligned */}
              <span className="text-xs invisible select-none">Email</span>
            </div>

            {/* Devices cell */}
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

  return (
    <>
      <style>{`
        .notif-select, .notif-select *, .notif-select .ant-select-selector,
        .notif-select .ant-select-selection-item, .notif-select .ant-select-selection-placeholder,
        .notif-select input { color: #f5f5f5 !important; }
        .notif-select .ant-select-selector { background-color: transparent !important; border-color: rgba(245,245,245,0.5) !important; box-shadow: none !important; }
        .notif-select.ant-select-focused .ant-select-selector { border-color: #f5f5f5 !important; box-shadow: none !important; }
        .notif-select .ant-select-arrow { color: rgba(245,245,245,0.6) !important; }
        .notif-dropdown-popup { background-color: #1a1a1a !important; }
        .notif-dropdown-popup .ant-select-item { color: #f5f5f5 !important; }
        .notif-dropdown-popup .ant-select-item-option-active { background-color: #2a2a2a !important; }
        .notif-dropdown-popup .ant-select-item-option-selected { background-color: #333 !important; }
        .notif-dropdown-popup .ant-select-item-option-selected .ant-select-item-option-content { color: #f5f5f5 !important; }

      `}</style>

      <div className="max-w-2xl text-white-smoke space-y-10">
        {renderSection("Activities",          ACTIVITY_ROWS, activities, setActivities)}
        {renderSection("Updates from Beatza", BEATZA_ROWS,   beatza,     setBeatza)}

        <div className="flex justify-end gap-3">
          <Button onClick={() => { setActivities(INITIAL_ACTIVITIES); setBeatza(INITIAL_BEATZA); }}
            className="text-white-smoke">
            Cancel
          </Button>
          <Button
            disabled={!isDirty}
            className="bg-white-smoke text-chinese-black disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save changes
          </Button>
        </div>
      </div>
    </>
  );
}