"use client";

import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { Switch } from "antd";
import { IoToggleOutline } from "react-icons/io5";
import { RiLockFill } from "react-icons/ri";

interface TooltipText {
	title: string;
	description: string;
}

interface PermissionsSectionProps {
	expanded: boolean;
	onToggle: () => void;
	COLLAPSIBLE_MOTION_PROPS: any;
	SWITCH_CLS: string;
	isArtistPro: boolean;
	enableDownloads: boolean;
	setEnableDownloads: (value: boolean) => void;
	offlineListening: boolean;
	setOfflineListening: (value: boolean) => void;
	includeRssFeed: boolean;
	setIncludeRssFeed: (value: boolean) => void;
	displayEmbedCode: boolean;
	setDisplayEmbedCode: (value: boolean) => void;
	enableAppPlayback: boolean;
	setEnableAppPlayback: (value: boolean) => void;
	allowComments: boolean;
	setAllowComments: (value: boolean) => void;
	showTrackComments: boolean;
	setShowTrackComments: (value: boolean) => void;
	showTrackInsights: boolean;
	setShowTrackInsights: (value: boolean) => void;
	geoblockingOption: string;
	setGeoblockingOption: (value: string) => void;
	PrettyRadio: React.ComponentType<{ checked: boolean; onSelect: () => void }>;
	ProLockTooltip: React.ComponentType<{
		text: TooltipText;
		children: React.ReactNode;
		referenceClassName?: string;
		placement?: any;
	}>;
	TOOLTIP_TEXT: {
		proSwitch: TooltipText;
		proGeoblocking: TooltipText;
	};
}

export function PermissionsSection({
	expanded,
	onToggle,
	COLLAPSIBLE_MOTION_PROPS,
	SWITCH_CLS,
	isArtistPro,
	enableDownloads,
	setEnableDownloads,
	offlineListening,
	setOfflineListening,
	includeRssFeed,
	setIncludeRssFeed,
	displayEmbedCode,
	setDisplayEmbedCode,
	enableAppPlayback,
	setEnableAppPlayback,
	allowComments,
	setAllowComments,
	showTrackComments,
	setShowTrackComments,
	showTrackInsights,
	setShowTrackInsights,
	geoblockingOption,
	setGeoblockingOption,
	PrettyRadio,
	ProLockTooltip,
	TOOLTIP_TEXT,
}: PermissionsSectionProps) {
	return (
		<>
			<button
				onClick={onToggle}
				className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer"
			>
				<div className="flex items-start gap-3">
					<span className="mt-1 pb-2 flex h-5 w-5 shrink-0 items-center justify-center text-white-smoke">
						<IoToggleOutline className="mt-0.5 text-[22px]" />
					</span>
					<div>
						<p className="text-[17px] font-semibold text-white-smoke">Permissions</p>
						<p className="text-[15px] text-white-smoke mt-0.5">
							Control the visibility of engagements on your track, direct downloads, and more.
						</p>
					</div>
				</div>
				{expanded
					? <UpOutlined className="text-[11px] text-white-smoke" />
					: <DownOutlined className="text-[11px] text-white-smoke" />}
			</button>

			<AnimatePresence initial={false}>
				{expanded && (
					<motion.div key="permissions" {...COLLAPSIBLE_MOTION_PROPS}>
						<div className="space-y-4 py-4 pl-14 pr-2">
							<div className="space-y-4 pb-4 border-b border-[#1e1e1e]">
								<p className="text-[16px] font-bold text-white-smoke uppercase tracking-wide">Access settings</p>
								{[
									{ label: "Enable direct downloads", desc: "Allow listeners to download the original audio file.",                                              val: enableDownloads,  set: setEnableDownloads  },
									{ label: "Offline listening",        desc: "Allows this track to be played on devices without an internet connection.",                        val: offlineListening,  set: setOfflineListening  },
									{ label: "Include in RSS feed",      desc: 'Choose whether you want this track to show up in the "Feed" tab.',                                 val: includeRssFeed,   set: setIncludeRssFeed   },
									{ label: "Display embed code",       desc: "Choose whether you want this track's embedded player code to be displayed publicly.",              val: displayEmbedCode,  set: setDisplayEmbedCode  },
									{ label: "Enable app playback",      desc: "Choose whether you want this track to be playable outside the app.",                              val: enableAppPlayback, set: setEnableAppPlayback },
								].map(({ label, desc, val, set }) => (
									<div key={label} className="flex items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4 last:border-b-0 last:pb-0">
										<div>
											<p className="text-[15px] font-semibold text-white-smoke">{label}</p>
											<p className="text-[13px] text-white/55">{desc}</p>
										</div>
										<Switch checked={val} onChange={set} className={SWITCH_CLS} />
									</div>
								))}
							</div>

							<div className="space-y-4 pb-4 border-b border-[#1e1e1e]">
								<p className="text-[16px] font-bold text-white-smoke uppercase tracking-wide">Engagement privacy</p>
								{[
									{ label: "Allow people to comment on your track", val: allowComments,     set: setAllowComments     },
									{ label: "Show track comments to public",          val: showTrackComments, set: setShowTrackComments  },
									{ label: "Show track insights to public",          val: showTrackInsights, set: setShowTrackInsights  },
								].map(({ label, val, set }) =>
									isArtistPro ? (
										<div key={label} className="flex items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4 last:border-b-0 last:pb-0">
											<p className="text-[15px] font-semibold text-white-smoke">{label}</p>
											<div className="flex items-center gap-2">
												<RiLockFill className="text-[20px] text-white-smoke" />
												<Switch checked={val} onChange={set} disabled={!isArtistPro} className={SWITCH_CLS} />
											</div>
										</div>
									) : (
										<div key={label} className="flex items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4 opacity-70 last:border-b-0 last:pb-0">
											<p className="text-[15px] font-semibold text-white-smoke">{label}</p>
											<div className="flex items-center gap-2">
												<RiLockFill className="text-[20px] text-white-smoke" />
												<ProLockTooltip text={TOOLTIP_TEXT.proSwitch} referenceClassName="inline-flex h-fit w-fit" placement="bottom-end">
													<span className="inline-flex">
														<Switch checked={val} onChange={set} disabled={!isArtistPro} className={SWITCH_CLS} />
													</span>
												</ProLockTooltip>
											</div>
										</div>
									)
								)}
							</div>

							{isArtistPro ? (
								<div>
									<div className="ml-14">
										<div className="flex items-center gap-1.5 mb-1">
											<RiLockFill className="mb-1 text-[20px] text-white-smoke" />
											<p className="flex items-center gap-1 text-[17px] font-bold text-white-smoke tracking-wide">Geoblocking</p>
										</div>
										<p className="mb-3 text-[14px] text-white-smoke">Customize what countries your track will be available in.</p>
									</div>
									<div role="radiogroup" className="space-y-2">
										{["worldwide", "exclusive", "blocked"].map((opt) => (
											<label key={opt} className="flex cursor-pointer items-center gap-2">
												<PrettyRadio
													checked={geoblockingOption === opt}
													onSelect={() => { if (!isArtistPro) return; setGeoblockingOption(opt); }}
												/>
												<span className="text-[15px] text-white-smoke">
													{opt === "worldwide" ? "Worldwide" : opt === "exclusive" ? "Exclusive regions" : "Blocked regions"}
												</span>
											</label>
										))}
									</div>
								</div>
							) : (
								<ProLockTooltip text={TOOLTIP_TEXT.proGeoblocking}>
									<div className="opacity-55">
										<div className="ml-14">
											<div className="flex items-center gap-1.5 mb-1">
												<RiLockFill className="mb-1 text-[20px] text-white-smoke" />
												<p className="flex items-center gap-1 text-[17px] font-bold text-white-smoke tracking-wide">Geoblocking</p>
											</div>
											<p className="mb-3 text-[14px] text-white-smoke">Customize what countries your track will be available in.</p>
										</div>
										<div role="radiogroup" className="space-y-2">
											{["worldwide", "exclusive", "blocked"].map((opt) => (
												<label key={opt} className="flex cursor-not-allowed items-center gap-2 opacity-60">
													<PrettyRadio
														checked={geoblockingOption === opt}
														onSelect={() => { if (!isArtistPro) return; setGeoblockingOption(opt); }}
													/>
													<span className="text-[15px] text-white-smoke">
														{opt === "worldwide" ? "Worldwide" : opt === "exclusive" ? "Exclusive regions" : "Blocked regions"}
													</span>
												</label>
											))}
										</div>
									</div>
								</ProLockTooltip>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
