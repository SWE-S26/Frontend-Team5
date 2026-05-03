"use client";

import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdCalendar } from "react-icons/io";
import { BsExplicitFill } from "react-icons/bs";

interface AdvancedDetailsSectionProps {
  expanded: boolean;
  onToggle: () => void;
  COLLAPSIBLE_MOTION_PROPS: any;
  LABEL_CLS: string;
  ADV_FIELD_CLS: string;
  buyLink: string;
  setBuyLink: (value: string) => void;
  recordLabel: string;
  setRecordLabel: (value: string) => void;
  releaseCalendarRef: React.RefObject<HTMLDivElement | null>;
  releaseDate: string;
  formatDisplayDate: (value: string) => string;
  openReleaseCalendar: () => void;
  setReleaseCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  releaseCalendarOpen: boolean;
  shiftReleaseCalendarMonth: (delta: number) => void;
  calendarMonthStart: Date;
  calendarDays: Date[];
  selectedReleaseDate: Date | null;
  isSameDay: (a: Date, b: Date) => boolean;
  handleSelectReleaseDate: (date: Date) => void;
  publisher: string;
  setPublisher: (value: string) => void;
  isrc: string;
  setIsrc: (value: string) => void;
  explicitContent: boolean;
  setExplicitContent: (value: boolean) => void;
  PrettyCheckbox: React.ComponentType<{ checked: boolean; onChange: (next: boolean) => void }>;
  pline: string;
  setPline: (value: string) => void;
}

export function AdvancedDetailsSection({
  expanded,
  onToggle,
  COLLAPSIBLE_MOTION_PROPS,
  LABEL_CLS,
  ADV_FIELD_CLS,
  buyLink,
  setBuyLink,
  recordLabel,
  setRecordLabel,
  releaseCalendarRef,
  releaseDate,
  formatDisplayDate,
  openReleaseCalendar,
  setReleaseCalendarOpen,
  releaseCalendarOpen,
  shiftReleaseCalendarMonth,
  calendarMonthStart,
  calendarDays,
  selectedReleaseDate,
  isSameDay,
  handleSelectReleaseDate,
  publisher,
  setPublisher,
  isrc,
  setIsrc,
  explicitContent,
  setExplicitContent,
  PrettyCheckbox,
  pline,
  setPline,
}: AdvancedDetailsSectionProps) {
  return (
    <>
      <button
        onClick={onToggle}
        data-testid="upload-advanced-toggle"
        className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer"
      >
        <div>
          <p className="text-[13px] font-semibold text-white-smoke">Advanced details</p>
          <p className="text-[11px] text-white-smoke mt-0.5">
            Buy link, record label, release date, publisher...
          </p>
        </div>
        {expanded ? (
          <UpOutlined className="text-[11px] text-white-smoke" />
        ) : (
          <DownOutlined className="text-[11px] text-white-smoke" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div key="advanced-details" {...COLLAPSIBLE_MOTION_PROPS}>
            <div className="space-y-5 py-4">
              {[
                {
                  label: "Buy link",
                  value: buyLink,
                  setter: setBuyLink,
                  placeholder: "Add a link to let your fans purchase the track from another site",
                  info: "",
                },
                {
                  label: "Record label",
                  value: recordLabel,
                  setter: setRecordLabel,
                  placeholder:
                    "If your track is released under a specific record label, you can add that here.",
                  info: "",
                },
              ].map(({ label, value, setter, placeholder, info }) => (
                <div key={label}>
                  <label className={LABEL_CLS}>{label}</label>
                  <small className="flex pb-2 text-[12px] text-white/55">{info}</small>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    data-testid={`upload-advanced-${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={ADV_FIELD_CLS}
                  />
                </div>
              ))}

              <div>
                <label className={LABEL_CLS}>Release date</label>
                <small className="flex pb-2 text-[12px] text-white-smoke/55">
                  If your track has a specific release date, you can add that here.
                </small>
                <div className="relative" ref={releaseCalendarRef}>
                  <div className="relative max-w-45">
                    <input
                      type="text"
                      value={formatDisplayDate(releaseDate)}
                      readOnly
                      onClick={openReleaseCalendar}
                      placeholder="MM/DD/YYYY"
                      data-testid="upload-advanced-release-date"
                      className={`${ADV_FIELD_CLS} pr-9 w-full cursor-pointer`}
                    />
                    <button
                      type="button"
                      onClick={() => setReleaseCalendarOpen((prev) => !prev)}
                      data-testid="upload-advanced-release-calendar-toggle"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white-smoke/85 hover:text-white-smoke cursor-pointer"
                      aria-label="Open release date calendar"
                    >
                      <IoMdCalendar className="text-[22px]" />
                    </button>
                  </div>

                  {releaseCalendarOpen && (
                    <div className="absolute left-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-2.5rem))] rounded-md border border-[#2f3035] bg-chinese-black p-3 shadow-xl sm:w-72">
                      <div className="mb-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => shiftReleaseCalendarMonth(-1)}
                          data-testid="upload-advanced-release-prev"
                          className="rounded px-2 py-1 text-white-smoke/80 hover:bg-[#2a2b31] hover:text-white-smoke"
                          aria-label="Previous month"
                        >
                          {"<"}
                        </button>
                        <p className="text-[12px] font-semibold text-white-smoke">
                          {calendarMonthStart.toLocaleString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <button
                          type="button"
                          onClick={() => shiftReleaseCalendarMonth(1)}
                          data-testid="upload-advanced-release-next"
                          className="rounded px-2 py-1 text-white-smoke/80 hover:bg-[#2a2b31] hover:text-white-smoke"
                          aria-label="Next month"
                        >
                          {">"}
                        </button>
                      </div>
                      <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-[#8a8a91]">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <span key={day}>{day}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day) => {
                          const inCurrentMonth = day.getMonth() === calendarMonthStart.getMonth();
                          const isSelected = selectedReleaseDate
                            ? isSameDay(day, selectedReleaseDate)
                            : false;
                          const isToday = isSameDay(day, new Date());
                          return (
                            <button
                              key={day.toISOString()}
                              type="button"
                              onClick={() => handleSelectReleaseDate(day)}
                              className={`h-8 rounded text-[11px] transition-colors ${
                                isSelected
                                  ? "bg-[#1db954] text-chinese-black font-bold"
                                  : inCurrentMonth
                                    ? isToday
                                      ? "border border-[#1db954] text-white-smoke"
                                      : "text-white-smoke hover:bg-[#2a2b31]"
                                    : "text-[#666] hover:bg-[#222]"
                              }`}
                            >
                              {day.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {[
                {
                  label: "Publisher",
                  value: publisher,
                  setter: setPublisher,
                  placeholder: "",
                  info: "If you have a publisher, you can add that here. A music publisher is a person or organization that helps songwriters promote and monetize their songs and ensure that they are properly compensated when their songs are used.",
                },
                {
                  label: "ISRC",
                  value: isrc,
                  setter: setIsrc,
                  placeholder: "",
                  info: "An ISRC (International Standard Recording Code) is a unique identifier that is assigned to a track. Use the same ISRC for a given track wherever you distribute it. If you work with a record label or distributor, ask them if they already have ISRCs for your tracks.",
                },
              ].map(({ label, value, setter, placeholder, info }) => (
                <div key={label}>
                  <label className={LABEL_CLS}>{label}</label>
                  <small className="flex pb-2 text-[12px] text-white-smoke/55">{info}</small>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    data-testid={`upload-advanced-${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={ADV_FIELD_CLS}
                  />
                </div>
              ))}

              <div>
                <label className={LABEL_CLS}>Contains explicit content</label>
                <small className="flex pb-2 text-[12px] text-white-smoke/55">
                  Please check this if your track contains explicit content. The badge will be
                  displayed next to your track title.
                </small>
                <label className="flex items-center gap-2">
                  <PrettyCheckbox checked={explicitContent} onChange={setExplicitContent} />
                  <span className="text-[12px] text-white-smoke">Explicit content</span>
                  <BsExplicitFill className="logo-dark" />
                  <BsExplicitFill className="invert logo-light" />
                </label>
              </div>

              <div>
                <label className={LABEL_CLS}>P line</label>
                <small className="text-[12px] flex pb-2 text-white-smoke/55">
                  P line notice identify the owner of the rights in the original sound recording
                  (the masters) at the time the CD/carrier/file is manufactured.
                </small>
                <input
                  type="text"
                  value={pline}
                  onChange={(e) => setPline(e.target.value)}
                  placeholder=""
                  data-testid="upload-advanced-p-line"
                  className={ADV_FIELD_CLS}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
