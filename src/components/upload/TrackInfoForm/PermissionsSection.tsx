"use client";

import { CloseOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { Switch } from "antd";
import { IoToggleOutline } from "react-icons/io5";
import { RiLockFill } from "react-icons/ri";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

export const GEOBLOCKING_REGIONS: { continent: string; countries: string[] }[] = [
	{
		continent: "Africa",
		countries: [
			"Africa", "Angola", "Burkina Faso", "Burundi", "Benin", "Botswana",
			"Democratic Republic of the Congo", "Central African Republic", "Republic of the Congo",
			"Ivory Coast", "Cameroon", "Cape Verde", "Djibouti", "Algeria", "Egypt", "Eritrea",
			"Ethiopia", "Gabon", "Ghana", "Gambia", "Guinea", "Equatorial Guinea", "Guinea-Bissau",
			"Kenya", "Comoros", "Liberia", "Lesotho", "Libya", "Morocco", "Madagascar", "Mali",
			"Mauritania", "Mauritius", "Malawi", "Mozambique", "Namibia", "Niger", "Nigeria",
			"Rwanda", "Sudan", "Senegal", "Somalia", "South Sudan", "Sao Tome and Principe",
			"Eswatini", "Seychelles", "Chad", "Togo", "Tunisia", "Tanzania", "Uganda",
			"South Africa", "Zambia", "Zimbabwe",
		],
	},
	{
		continent: "Asia",
		countries: [
			"Asia", "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan",
			"Brunei", "Cambodia", "China", "Cyprus", "Georgia", "India", "Indonesia", "Iran",
			"Iraq", "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos",
			"Lebanon", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea",
			"Oman", "Pakistan", "Palestine", "Philippines", "Qatar", "Saudi Arabia", "Singapore",
			"South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand", "Timor-Leste",
			"Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen",
		],
	},
	{
		continent: "Europe",
		countries: [
			"Europe", "Albania", "Andorra", "Austria", "Belarus", "Belgium",
			"Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czech Republic", "Denmark",
			"Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland",
			"Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta",
			"Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland",
			"Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia",
			"Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Vatican City",
		],
	},
	{
		continent: "North America",
		countries: [
			"North America", "Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Canada",
			"Costa Rica", "Cuba", "Dominica", "Dominican Republic", "El Salvador", "Grenada",
			"Guatemala", "Haiti", "Honduras", "Jamaica", "Mexico", "Nicaragua", "Panama",
			"Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
			"Trinidad and Tobago", "United States",
		],
	},
	{
		continent: "South America",
		countries: [
			"South America", "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador",
			"Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela",
		],
	},
	{
		continent: "Oceania",
		countries: [
			"Oceania", "Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru",
			"New Zealand", "Palau", "Papua New Guinea", "Samoa", "Solomon Islands", "Tonga",
			"Tuvalu", "Vanuatu",
		],
	},
];

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
	geoblockingRegions: string[];
	setGeoblockingRegions: (value: string[]) => void;
	PrettyRadio: ComponentType<{ checked: boolean; onSelect: () => void }>;
	ProLockTooltip: ComponentType<{
		text: TooltipText;
		children: ReactNode;
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
	geoblockingRegions,
	setGeoblockingRegions,
	PrettyRadio,
	ProLockTooltip,
	TOOLTIP_TEXT,
}: PermissionsSectionProps) {
	const [regionMenuOpen, setRegionMenuOpen] = useState(false);
	const [regionSearch, setRegionSearch] = useState("");
	const anchorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setRegionMenuOpen(false);
		setRegionSearch("");
	}, [geoblockingOption]);

	const selectedRegions = geoblockingRegions ?? [];

	// Build a set of continent names whose continent-level entry is selected
	// e.g. if "Africa" is selected, all African countries are greyed out
	const selectedContinentGroups = new Set(
		GEOBLOCKING_REGIONS
			.filter((g) => selectedRegions.includes(g.continent))
			.map((g) => g.continent)
	);

	// Returns true if a country belongs to a continent that is already selected as a whole
	function isGreyedOut(country: string, continent: string): boolean {
		return selectedContinentGroups.has(continent) && country !== continent;
	}

	const filteredRegions = GEOBLOCKING_REGIONS.map((group) => ({
		...group,
		countries: group.countries.filter((c) =>
			c.toLowerCase().includes(regionSearch.toLowerCase())
		),
	})).filter((group) => group.countries.length > 0);

	function toggleRegion(name: string, continent: string) {
		if (selectedRegions.includes(name)) {
			setGeoblockingRegions(selectedRegions.filter((r) => r !== name));
		} else {
			// Block adding a country if its parent continent is already selected
			if (selectedContinentGroups.has(continent) && name !== continent) return;

			// If selecting a continent, remove any individually selected countries from that continent
			if (name === continent) {
				const continentCountries = new Set(
					GEOBLOCKING_REGIONS.find((g) => g.continent === continent)?.countries ?? []
				);
				const filtered = selectedRegions.filter((r) => !continentCountries.has(r));
				setGeoblockingRegions([...filtered, name]);
			} else {
				setGeoblockingRegions([...selectedRegions, name]);
			}
		}
		setRegionMenuOpen(false);
		setRegionSearch("");
	}

	function removeRegion(name: string) {
		setGeoblockingRegions(selectedRegions.filter((r) => r !== name));
	}

	useEffect(() => {
		if (!regionMenuOpen) return;
		const handler = (e: MouseEvent) => {
			if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
				setRegionMenuOpen(false);
				setRegionSearch("");
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [regionMenuOpen]);

	const geoblockingRadios = [
		{ opt: "worldwide", label: "Worldwide",         desc: null },
		{ opt: "exclusive", label: "Exclusive regions", desc: "Only allow this track to be playable in specific countries and continents." },
		{ opt: "blocked",   label: "Blocked regions",   desc: "Block this track from being streamed in specific countries and continents." },
	];

	const regionPickerUI = (
		<div className="mt-3" ref={anchorRef}>
			<div className="flex w-full items-center justify-between border-b border-[#333] pb-2 pt-1">
				<input
					type="text"
					value={regionMenuOpen ? regionSearch : ""}
					placeholder="Add continent or country"
					onFocus={() => {
						setRegionSearch("");
						setRegionMenuOpen(true);
					}}
					onChange={(e) => {
						setRegionSearch(e.target.value);
						setRegionMenuOpen(true);
					}}
					className="w-full bg-transparent text-[13px] text-white-smoke placeholder-[#555] focus:outline-none"
				/>
				<span className="flex items-center gap-3 text-white-smoke">
					{selectedRegions.length > 0 && (
						<CloseOutlined
							onMouseDown={(e) => { e.preventDefault(); setGeoblockingRegions([]); }}
							className="cursor-pointer text-[12px]"
						/>
					)}
					<button
						type="button"
						onMouseDown={(e) => {
							e.preventDefault();
							setRegionMenuOpen((prev) => !prev);
						}}
						className="cursor-pointer"
					>
						{regionMenuOpen
							? <UpOutlined className="text-[11px]" />
							: <DownOutlined className="text-[11px]" />}
					</button>
				</span>
			</div>

			{regionMenuOpen && (
				<div className="mt-2 max-h-72 overflow-y-auto rounded border border-[#2f3035] bg-chinese-black shadow-xl">
					{filteredRegions.length === 0 ? (
						<p className="px-4 py-3 text-[13px] text-white-smoke/50">No results found</p>
					) : (
						filteredRegions.map((group) => (
							<div key={group.continent}>
								<p className="px-4 py-2 text-[13px] text-white-smoke">{group.continent}</p>
								{group.countries.map((country) => {
									const isSelected = selectedRegions.includes(country);
									const isDisabled = isGreyedOut(country, group.continent);
									return (
										<button
											key={country}
											type="button"
											onMouseDown={(e) => {
												e.preventDefault();
												if (!isDisabled) toggleRegion(country, group.continent);
											}}
											className={`block w-full px-4 py-2 text-left text-[13px] text-white-smoke transition-opacity ${
												isDisabled
													? "opacity-30 cursor-not-allowed"
													: "hover:bg-[#3a3b3f] cursor-pointer"
											} ${isSelected ? "bg-[#2a2a2a]" : "bg-off-black"}`}
										>
											<span className="flex items-center justify-between">
												{country}
												{isSelected && (
													<CloseOutlined className="text-[10px] text-white-smoke/50" />
												)}
											</span>
										</button>
									);
								})}
							</div>
						))
					)}
				</div>
			)}

			{selectedRegions.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mt-2">
					{selectedRegions.map((r) => (
						<span
							key={r}
							className="inline-flex items-center gap-1 rounded-full bg-chinese-black px-2.5 py-1 text-[12px] text-white-smoke"
						>
							{r}
							<button
								type="button"
								onClick={() => removeRegion(r)}
								className="ml-0.5 text-white-smoke/60 hover:text-white-smoke"
							>
								<CloseOutlined className="text-[10px]" />
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	);

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
									{ label: "Enable direct downloads", desc: "Allow listeners to download the original audio file.",                                        val: enableDownloads,  set: setEnableDownloads  },
									{ label: "Offline listening",        desc: "Allows this track to be played on devices without an internet connection.",                  val: offlineListening,  set: setOfflineListening  },
									{ label: "Include in RSS feed",      desc: 'Choose whether you want this track to show up in the "Feed" tab.',                           val: includeRssFeed,   set: setIncludeRssFeed   },
									{ label: "Display embed code",       desc: "Choose whether you want this track's embedded player code to be displayed publicly.",        val: displayEmbedCode,  set: setDisplayEmbedCode  },
									{ label: "Enable app playback",      desc: "Choose whether you want this track to be playable outside the app.",                        val: enableAppPlayback, set: setEnableAppPlayback },
								].map(({ label, desc, val, set }) => (
									<div key={label} className="flex items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4 last:border-b-0 last:pb-0">
										<div>
											<p className="text-[15px] font-semibold text-white-smoke">{label}</p>
											<p className="text-[13px] text-white-smoke/55">{desc}</p>
										</div>
										{!isArtistPro && label === "Enable direct downloads" ? (
											<ProLockTooltip text={TOOLTIP_TEXT.proSwitch} referenceClassName="inline-flex h-fit w-fit" placement="bottom-end">
												<span className="inline-flex">
													<Switch checked={val} onChange={set} disabled className={SWITCH_CLS} />
												</span>
											</ProLockTooltip>
										) : (
											<Switch checked={val} onChange={set} className={SWITCH_CLS} />
										)}
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
											<Switch checked={val} onChange={set} disabled={!isArtistPro} className={SWITCH_CLS} />
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
									<div className="flex items-center gap-1.5 mb-1">
										<p className="text-[17px] font-bold text-white-smoke tracking-wide">Geoblocking</p>
									</div>
									<p className="mb-3 text-[14px] text-white-smoke">Customize what countries your track will be available in.</p>

									<div role="radiogroup" className="space-y-2">
										{geoblockingRadios.map(({ opt, label, desc }) => (
											<div key={opt}>
												<label className="flex cursor-pointer items-center gap-2">
													<PrettyRadio
														checked={geoblockingOption === opt}
														onSelect={() => setGeoblockingOption(opt)}
													/>
													<span className="text-[15px] text-white-smoke">{label}</span>
												</label>

												<AnimatePresence initial={false}>
													{geoblockingOption === opt && desc && (
														<motion.div
															key={opt + "-detail"}
															initial={{ opacity: 0, height: 0 }}
															animate={{ opacity: 1, height: "auto" }}
															exit={{ opacity: 0, height: 0 }}
															transition={{ duration: 0.2 }}
															style={{ overflow: "visible" }}
														>
															<div className="ml-6 mt-1">
																<p className="text-[13px] text-white-smoke/60">{desc}</p>
																{(opt === "exclusive" || opt === "blocked") && regionPickerUI}
															</div>
														</motion.div>
													)}
												</AnimatePresence>
											</div>
										))}
									</div>
								</div>
							) : (
								<ProLockTooltip text={TOOLTIP_TEXT.proGeoblocking}>
									<div className="opacity-55">
										<div className="ml-14">
											<div className="flex items-center gap-1.5 mb-1">
												<RiLockFill className="mb-1 text-[20px] text-white-smoke" />
												<p className="text-[17px] font-bold text-white-smoke tracking-wide">Geoblocking</p>
											</div>
											<p className="mb-3 text-[14px] text-white-smoke">Customize what countries your track will be available in.</p>
										</div>
										<div role="radiogroup" className="space-y-2">
											{geoblockingRadios.map(({ opt, label }) => (
												<label key={opt} className="flex cursor-not-allowed items-center gap-2 opacity-60">
													<PrettyRadio
														checked={geoblockingOption === opt}
														onSelect={() => { /* locked */ }}
													/>
													<span className="text-[15px] text-white-smoke">{label}</span>
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
