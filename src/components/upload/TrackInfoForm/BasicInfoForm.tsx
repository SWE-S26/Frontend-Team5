"use client";

import { CloseOutlined, DownOutlined, UpOutlined, UserAddOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import { FiLock } from "react-icons/fi";
import { CiGlobe } from "react-icons/ci";
import { FaRegClock } from "react-icons/fa";

interface TooltipText {
	title: string;
	description: string;
}

interface BasicInfoFormProps {
	submitError: string | null;
	LABEL_CLS: string;
	FIELD_CLS: string;
	TOOLTIP_TEXT: {
		trackTitle: TooltipText;
		mainArtists: TooltipText;
		tags: TooltipText;
		proFollowerExclusive: TooltipText;
		proScheduleRelease: TooltipText;
	};
	InfoTooltip: React.ComponentType<{ text: TooltipText }>;
	ProLockTooltip: React.ComponentType<{
		text: TooltipText;
		children: React.ReactNode;
		referenceClassName?: string;
		placement?: any;
	}>;
	SWITCH_CLS: string;
	trackTitle: string;
	setTrackTitle: (value: string) => void;
	permalink: string;
	setPermalink: (value: string) => void;
	permalinkProfileLink?: string | null;
	showPermalink?: boolean;
	permalinkReadOnly?: boolean;
	artistName: string;
	setArtistName: (value: string) => void;
	genre: string;
	setGenre: (value: string) => void;
	genreMenuRef: React.RefObject<HTMLDivElement | null>;
	genreMenuOpen: boolean;
	setGenreMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	genreSearch: string;
	setGenreSearch: React.Dispatch<React.SetStateAction<string>>;
	commitGenreSearch: () => void;
	shouldShowAddCustomGenre: boolean;
	filteredMusicGenres: string[];
	filteredAudioGenres: string[];
	tags: string;
	setTags: (value: string) => void;
	description: string;
	setDescription: (value: string) => void;
	privacyMenuRef: React.RefObject<HTMLDivElement | null>;
	privacyMenuOpen: boolean;
	setPrivacyMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	visibilityOption: "public" | "private" | "followerExclusive";
	setVisibilityOption: React.Dispatch<React.SetStateAction<"public" | "private" | "followerExclusive">>;
	isArtistPro: boolean;
	setShowProFeatureModal: React.Dispatch<React.SetStateAction<boolean>>;
	scheduleRelease: boolean;
	setScheduleRelease: (value: boolean) => void;
}

export function BasicInfoForm({
	submitError,
	LABEL_CLS,
	FIELD_CLS,
	TOOLTIP_TEXT,
	InfoTooltip,
	ProLockTooltip,
	SWITCH_CLS,
	trackTitle,
	setTrackTitle,
	permalink,
	setPermalink,
	permalinkProfileLink,
	showPermalink = true,
	permalinkReadOnly = false,
	artistName,
	setArtistName,
	genre,
	setGenre,
	genreMenuRef,
	genreMenuOpen,
	setGenreMenuOpen,
	genreSearch,
	setGenreSearch,
	commitGenreSearch,
	shouldShowAddCustomGenre,
	filteredMusicGenres,
	filteredAudioGenres,
	tags,
	setTags,
	description,
	setDescription,
	privacyMenuRef,
	privacyMenuOpen,
	setPrivacyMenuOpen,
	visibilityOption,
	setVisibilityOption,
	isArtistPro,
	setShowProFeatureModal,
	scheduleRelease,
	setScheduleRelease,
}: BasicInfoFormProps) {
	const rawPermalink = permalink.trim();
	const strippedPermalink = rawPermalink
		.replace(/^https?:\/\/beatza\.me\//i, "")
		.replace(/^beatza\.me\//i, "")
		.replace(/^\/+/, "");
	const normalizedProvidedProfileLink = (permalinkProfileLink ?? "")
		.trim()
		.replace(/^https?:\/\/beatza\.me\//i, "")
		.replace(/^beatza\.me\//i, "")
		.replace(/^\/+|\/+$/g, "");
	const [profileLinkPart, ...restParts] = strippedPermalink.split("/").filter(Boolean);
	const permalinkPrefix = normalizedProvidedProfileLink
		? `https://beatza.me/${normalizedProvidedProfileLink}/`
		: profileLinkPart
			? `https://beatza.me/${profileLinkPart}/`
			: "https://beatza.me/";

	const permalinkSuffix = normalizedProvidedProfileLink
		? strippedPermalink.toLowerCase().startsWith(`${normalizedProvidedProfileLink.toLowerCase()}/`)
			? strippedPermalink.slice(normalizedProvidedProfileLink.length + 1)
			: (strippedPermalink.split("/").filter(Boolean).pop() ?? "")
		: restParts.join("/");

	return (
		<div className="space-y-6 lg:col-span-8">
			{submitError && (
				<div className="rounded-md border border-[#5a2d34] bg-chinese-black px-3 py-2 text-[12px] text-[#ff97a9]">
					{submitError}
				</div>
			)}

			<div>
				<label className={LABEL_CLS}>Track title <InfoTooltip text={TOOLTIP_TEXT.trackTitle} /></label>
				<input
					type="text"
					value={trackTitle}
					onChange={(e) => setTrackTitle(e.target.value)}
					placeholder="Enter track title"
					className={FIELD_CLS}
				/>
			</div>

			{showPermalink && (
				<div>
					<label className={LABEL_CLS}>Track link</label>
					<div className={`${FIELD_CLS} flex items-center gap-1 ${permalinkReadOnly ? "opacity-80" : ""}`}>
						<span className="shrink-0 text-[13px] text-[#9a9a9a]">{permalinkPrefix}</span>
						<input
							type="text"
							value={permalinkSuffix}
							onChange={(e) => {
								if (permalinkReadOnly) return;
								setPermalink(`${permalinkPrefix}${e.target.value}`);
							}}
							readOnly={permalinkReadOnly}
							disabled={permalinkReadOnly}
							placeholder="track-slug"
							className={`min-w-0 flex-1 bg-transparent text-[13px] text-white-smoke placeholder-[#555] focus:outline-none ${permalinkReadOnly ? "cursor-not-allowed" : ""}`}
						/>
					</div>
				</div>
			)}

			<div>
				<label className={LABEL_CLS}>Main Artist(s) <InfoTooltip text={TOOLTIP_TEXT.mainArtists} /></label>
				<input
					type="text"
					value={artistName}
					onChange={(e) => setArtistName(e.target.value)}
					placeholder="Your artist name"
					className={FIELD_CLS}
				/>
				<p className="mt-1.5 text-[11px] text-white-smoke">Tip: Use commas to add multiple artist names.</p>
			</div>

			<div>
				<label className={LABEL_CLS}>Genre</label>
				<div className="relative" ref={genreMenuRef}>
					<div className="flex w-full items-center justify-between border-b border-[#333] pb-2 pt-1 text-left">
						<input
							type="text"
							value={genreMenuOpen ? genreSearch : genre}
							onFocus={() => { setGenreSearch(genre); setGenreMenuOpen(true); }}
							onChange={(e) => { setGenreSearch(e.target.value); if (!genreMenuOpen) setGenreMenuOpen(true); }}
							onBlur={() => { commitGenreSearch(); }}
							onKeyDown={(e) => {
								if (e.key === "Enter" && shouldShowAddCustomGenre) {
									e.preventDefault();
									setGenre(genreSearch.trim());
									setGenreSearch("");
									setGenreMenuOpen(false);
								}
							}}
							placeholder="Add or search for genre"
							className="w-full bg-transparent text-[13px] text-white-smoke placeholder-[#555] focus:outline-none"
						/>
						<span className="flex items-center gap-3 text-white-smoke">
							{genre && (
								<CloseOutlined
									onClick={() => { setGenre(""); setGenreSearch(""); }}
									className="cursor-pointer text-[12px]"
								/>
							)}
							<button
								type="button"
								onClick={() => {
									if (!genreMenuOpen) { setGenreSearch(genre); } else { commitGenreSearch(); setGenreSearch(""); }
									setGenreMenuOpen((prev) => !prev);
								}}
								className="cursor-pointer"
								aria-label={genreMenuOpen ? "Close genre menu" : "Open genre menu"}
							>
								{genreMenuOpen ? <UpOutlined className="text-[11px]" /> : <DownOutlined className="text-[11px]" />}
							</button>
						</span>
					</div>

					{genreMenuOpen && (
						<div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-70 overflow-y-auto rounded border border-[#2f3035] bg-chinese-black shadow-xl">
							{filteredMusicGenres.length > 0 && (
								<>
									<p className="px-4 py-2 text-[13px] text-white-smoke">All music genres</p>
									{filteredMusicGenres.map((item) => (
										<button
											key={item}
											type="button"
											onClick={() => { setGenre(item); setGenreSearch(""); setGenreMenuOpen(false); }}
											className="block w-full px-4 py-2 text-left text-[13px] bg-off-black text-white-smoke hover:bg-[#3a3b3f]"
										>
											{item}
										</button>
									))}
								</>
							)}
							{filteredAudioGenres.length > 0 && (
								<>
									<p className="border-t border-[#2a2b30] px-4 py-2 text-[13px] text-white-smoke">All audio genres</p>
									{filteredAudioGenres.map((item) => (
										<button
											key={item}
											type="button"
											onClick={() => { setGenre(item); setGenreSearch(""); setGenreMenuOpen(false); }}
											className="block w-full px-4 py-2 text-left text-[13px] bg-off-black text-white-smoke hover:bg-[#3a3b3f]"
										>
											{item}
										</button>
									))}
								</>
							)}
							{shouldShowAddCustomGenre && (
								<button
									type="button"
									onClick={() => { setGenre(genreSearch.trim()); setGenreSearch(""); setGenreMenuOpen(false); }}
									className="block w-full border-t border-[#2a2b30] px-4 py-3 text-left text-[13px] font-semibold text-white-smoke hover:bg-[#3a3b3f]"
								>
									Add &quot;{genreSearch.trim()}&quot;
								</button>
							)}
						</div>
					)}
				</div>
			</div>

			<div>
				<label className={LABEL_CLS}>Tags <InfoTooltip text={TOOLTIP_TEXT.tags} /></label>
				<input
					type="text"
					value={tags}
					onChange={(e) => setTags(e.target.value)}
					placeholder="Add styles, moods, tempo"
					className={FIELD_CLS}
				/>
			</div>

			<div>
				<label className={LABEL_CLS}>Description</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Tracks with descriptions tend to get more plays and engagements."
					rows={1}
					className={`${FIELD_CLS} resize-none`}
				/>
			</div>

			<div className="relative rounded border border-[#2a2a2a] bg-chinese-black p-4" ref={privacyMenuRef}>
				<div className="relative">
					<button
						type="button"
						onClick={() => setPrivacyMenuOpen((prev) => !prev)}
						className="grid w-full cursor-pointer grid-cols-[2rem_1fr_auto] items-start gap-x-3 text-left"
						aria-expanded={privacyMenuOpen}
						aria-label="Toggle privacy options"
					>
						<div className="flex h-8 w-8 items-center justify-center">
							{visibilityOption === "public"  ? <CiGlobe       className="text-[24px] text-[#1db954]"   /> :
							 visibilityOption === "private" ? <FiLock        className="text-[20px] text-white-smoke" /> :
																								<UserAddOutlined className="text-[20px] text-white-smoke" />}
						</div>
						<div>
							<p className="text-[13px] font-semibold text-white-smoke">
								{visibilityOption === "public" ? "Public" : visibilityOption === "private" ? "Private" : "Follower Exclusive"}
							</p>
							<p className="text-[11px] text-white-smoke">
								{visibilityOption === "public"
									? "Anyone can access and listen to this track."
									: visibilityOption === "private"
										? "Track is not discoverable. Only people with private link can view and listen."
										: "Only those who follow you can access."}
							</p>
						</div>
						<span className="pt-1 text-white-smoke">
							{privacyMenuOpen ? <UpOutlined /> : <DownOutlined />}
						</span>
					</button>

					<div
						className={`absolute -left-4 -right-4 top-full z-20 mt-2 overflow-hidden rounded border border-[#2a2a2a] bg-chinese-black shadow-xl transition-all duration-200 ${
							privacyMenuOpen
								? "pointer-events-auto translate-y-0 opacity-100"
								: "pointer-events-none -translate-y-1 opacity-0"
						}`}
					>
						<div className="max-h-72 overflow-y-auto">
							{[
								{
									value: "public" as const,
									title: "Public",
									desc:  "Anyone can access and listen to this track.",
									icon:  <CiGlobe className={`text-[24px] ${visibilityOption === "public" ? "text-[#1db954]" : "text-white-smoke"}`} />,
								},
								{
									value: "private" as const,
									title: "Private",
									desc:  "Track is not discoverable. Only people with private link can view and listen.",
									icon:  <FiLock className="text-[20px] text-white-smoke" />,
								},
								{
									value: "followerExclusive" as const,
									title: "Follower Exclusive",
									desc:  "Only those who follow you can access.",
									icon:  <UserAddOutlined className="text-[20px] text-white-smoke" />,
									isProOnly: true,
								},
							].map((item) =>
								item.value === "followerExclusive" && !isArtistPro ? (
									<ProLockTooltip key={item.value} text={TOOLTIP_TEXT.proFollowerExclusive}>
										<button
											type="button"
											onClick={() => setShowProFeatureModal(true)}
											className={`grid w-full cursor-not-allowed grid-cols-[2rem_1fr] items-start gap-x-3 px-3 py-3 text-left ${
												visibilityOption === item.value ? "bg-upload-select" : "bg-chinese-black hover:bg-upload-schedular"
											}`}
										>
											<span className="flex h-8 w-8 items-center justify-center">{item.icon}</span>
											<span>
												<p className="flex items-center gap-2 text-[13px] font-semibold text-white-smoke">
													{item.title}
													<span className="rounded border border-[#f5a623] px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-[#f5a623]">PRO</span>
												</p>
												<p className="text-[11px] text-white-smoke">{item.desc}</p>
											</span>
										</button>
									</ProLockTooltip>
								) : (
									<button
										key={item.value}
										type="button"
										onClick={() => { setVisibilityOption(item.value); setPrivacyMenuOpen(false); }}
										className={`grid w-full cursor-pointer grid-cols-[2rem_1fr] items-start gap-x-3 px-3 py-3 text-left ${
											visibilityOption === item.value ? "bg-upload-select" : "bg-chinese-black hover:bg-upload-schedular"
										}`}
									>
										<span className="flex h-8 w-8 items-center justify-center">{item.icon}</span>
										<span>
											<p className="flex items-center gap-2 text-[13px] font-semibold text-white-smoke">
												{item.title}
												{item.value === "followerExclusive" && (
													<span className="rounded border border-[#f5a623] px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-[#f5a623]">PRO</span>
												)}
											</p>
											<p className="text-[11px] text-white-smoke">{item.desc}</p>
										</span>
									</button>
								)
							)}
						</div>
					</div>
				</div>

				<div className="mt-3 border-t border-[#2a2a2a] pt-3">
					{isArtistPro ? (
						<div className="grid grid-cols-[2rem_1fr_auto] items-start gap-x-3">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center">
								<FaRegClock className="text-[20px] text-white-smoke" />
							</div>
							<div>
								<p className="flex items-center gap-1 text-[12px] font-semibold text-white-smoke">
									Schedule public release <span className="text-[#f5a623]">ARTIST PRO</span>
								</p>
								<p className="text-[11px] text-[#666]">Track will be made public at specific date and time.</p>
							</div>
							<Switch checked={scheduleRelease} onChange={setScheduleRelease} disabled={!isArtistPro} className={SWITCH_CLS} />
						</div>
					) : (
						<ProLockTooltip text={TOOLTIP_TEXT.proScheduleRelease} referenceClassName="w-full" placement="bottom">
							<div className="grid grid-cols-[2rem_1fr_auto] items-start gap-x-3 opacity-60">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center">
									<FaRegClock className="text-[20px] text-white-smoke" />
								</div>
								<div>
									<p className="flex items-center gap-1 text-[12px] font-semibold text-white-smoke">
										Schedule public release <span className="text-[#f5a623]">ARTIST PRO</span>
									</p>
									<p className="text-[11px] text-[#666]">Track will be made public at specific date and time.</p>
								</div>
								<span className="inline-flex">
									<Switch checked={scheduleRelease} onChange={setScheduleRelease} disabled={!isArtistPro} className={SWITCH_CLS} />
								</span>
							</div>
						</ProLockTooltip>
					)}
				</div>
			</div>
		</div>
	);
}
