"use client";

import {
  FaFacebook,
  FaInstagram,
  FaSpotify,
  FaPaperPlane,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaLinkedin,
} from "react-icons/fa6";
import { FaSoundcloud, FaTwitter } from "react-icons/fa6";
import { IoEarthSharp } from "react-icons/io5";
import { ProfileLink } from "@/types/profile.types";

interface SocialLinksProps {
  links: ProfileLink[];
}

const detectPlatform = (link: string): string => {
  const url = link.replace(/^(mailto:)+/, "mailto:").toLowerCase();

  if (url.includes("facebook.com")) return "facebook";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("spotify.com")) return "spotify";
  if (url.includes("soundcloud.com")) return "soundcloud";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("pinterest.com")) return "pinterest";
  if (url.includes("linkedin.com")) return "linkedin";
  if (url.startsWith("mailto:") || url.includes("gmail.com")) return "gmail";
  return "other";
};

const getIcon = (platform: string) => {
  switch (platform) {
    case "facebook":
      return <FaFacebook className="text-[14px] text-silver" />;
    case "instagram":
      return <FaInstagram className="text-[14px] text-silver" />;
    case "spotify":
      return <FaSpotify className="text-[14px] text-silver" />;
    case "soundcloud":
      return <FaSoundcloud className="text-[14px] text-silver" />;
    case "twitter":
      return <FaTwitter className="text-[14px] text-silver" />;
    case "youtube":
      return <FaYoutube className="text-[14px] text-silver" />;
    case "tiktok":
      return <FaTiktok className="text-[14px] text-silver" />;
    case "pinterest":
      return <FaPinterest className="text-[14px] text-silver" />;
    case "linkedin":
      return <FaLinkedin className="text-[14px] text-silver" />;
    case "gmail":
      return <FaPaperPlane className="text-[14px] text-silver" />;
    default:
      return <IoEarthSharp className="text-[14px] text-silver" />;
  }
};

const getLabel = (link: ProfileLink, platform: string): string => {
  if (link.name) return link.name;

  const namedMap: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    spotify: "Spotify",
    soundcloud: "SoundCloud",
    twitter: "X",
    youtube: "YouTube",
    tiktok: "TikTok",
    pinterest: "Pinterest",
    linkedin: "LinkedIn",
  };

  if (namedMap[platform]) return namedMap[platform];

  if (platform === "gmail") {
    try {
      const cleaned = link.link.replace(/^(mailto:)+/, "mailto:");
      const url = new URL(cleaned);
      return url.pathname;
    } catch {
      return link.link;
    }
  }

  try {
    const url = new URL(link.link);
    return url.hostname.replace("www.", "");
  } catch {
    return link.link;
  }
};

export default function SocialLinks({ links }: SocialLinksProps) {
  if (!links || links.length === 0) return null;
  return (
    <div className="w-full mt-2 mb-4 flex flex-col gap-3">
      {links.map((link) => {
        const platform = detectPlatform(link.link);
        return (
          <a
            key={link.linkId}
            href={link.link.replace(/^(mailto:)+/, "mailto:")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-50 transition-opacity font-bold text-[14px]"
          >
            {getIcon(platform)}
            <span className="text-sm text-silver truncate">{getLabel(link, platform)}</span>
          </a>
        );
      })}
    </div>
  );
}
