"use client";

import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { AnimatePresence, motion } from "framer-motion";
import { BsCcCircle } from "react-icons/bs";

interface LicensingSectionProps {
	expanded: boolean;
	onToggle: () => void;
	COLLAPSIBLE_MOTION_PROPS: any;
	licenseType: "all-rights" | "creative-commons";
	setLicenseType: (value: "all-rights" | "creative-commons") => void;
	PrettyRadio: React.ComponentType<{ checked: boolean; onSelect: () => void }>;
}

export function LicensingSection({
	expanded,
	onToggle,
	COLLAPSIBLE_MOTION_PROPS,
	licenseType,
	setLicenseType,
	PrettyRadio,
}: LicensingSectionProps) {
	return (
		<>
			<button
				onClick={onToggle}
				className="flex w-full items-center justify-between py-4 text-left border-b border-[#222] cursor-pointer"
			>
				<div className="flex items-start gap-3">
					<span className="mt-1 pb-2 flex h-5 w-5 shrink-0 items-center justify-center text-white-smoke">
						<BsCcCircle className="mt-1 text-[20px]" />
					</span>
					<div>
						<p className="text-[17px] font-semibold text-white-smoke">Licensing</p>
						<p className="text-[14px] text-white-smoke mt-0.5">Enable Creative Commons licenses options.</p>
					</div>
				</div>
				{expanded
					? <UpOutlined className="text-[11px] text-white-smoke" />
					: <DownOutlined className="text-[11px] text-white-smoke" />}
			</button>

			<AnimatePresence initial={false}>
				{expanded && (
					<motion.div key="licensing" {...COLLAPSIBLE_MOTION_PROPS}>
						<div className="py-4 space-y-4 pl-14 pr-2">
							{[
								{
									value: "all-rights",
									title: "All rights reserved",
									desc:  "By choosing All Rights Reserved, you ask that other creators not use your material. Copyright is automatically granted to you when you begin creating your work.",
								},
								{
									value: "creative-commons",
									title: "Creative Commons",
									desc:  "With Creative Commons licenses, creators have the choice to give up certain exclusive rights normally associated with copyright, while retaining others.",
								},
							].map(({ value, title, desc }) => (
								<label key={value} className="flex cursor-pointer items-start gap-3">
									<PrettyRadio
										checked={licenseType === value}
										onSelect={() => setLicenseType(value as "all-rights" | "creative-commons")}
									/>
									<div>
										<p className="text-[14px] font-semibold text-white-smoke">{title}</p>
										<p className="mt-0.5 text-[13px] text-white-smoke">{desc}</p>
									</div>
								</label>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
