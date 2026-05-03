"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import { ChevronRight, X, ArrowUp } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import TabsNavbar from "@/components/layout/navbar/TabsNavbar";
import ProfileImage from "@/components/ui/ProfileImage";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useLogout } from "@/hooks/useAuth";
import { useGetProfile } from "@/hooks/useProfile";
import { setProfile, clearProfile } from "@/store/slices/profileSlice";

const ALL_ARTICLES = [
  {
    title: "Introduction to BeatZa",
    href: "/need-help/getting-started/introduction-to-beatza",
    tab: "Getting Started",
  },
  {
    title: "Creating an account on BeatZa",
    href: "/need-help/getting-started/creating-an-account",
    tab: "Getting Started",
  },
  {
    title: "Anatomy of BeatZa",
    href: "/need-help/getting-started/anatomy-of-beatza",
    tab: "Getting Started",
  },
  {
    title: "Email requirements",
    href: "/need-help/getting-started/email-requirements",
    tab: "Getting Started",
  },
  {
    title: "Verify your email",
    href: "/need-help/getting-started/verify-your-email",
    tab: "Getting Started",
  },
  {
    title: "Common Errors During Sign Up",
    href: "/need-help/getting-started/common-errors-during-sign-up",
    tab: "Getting Started",
  },
  {
    title: "Display Name and Profile URL Requirements",
    href: "/need-help/profile-setup/display-name-and-profile-url-requirements",
    tab: "Profile Setup",
  },
  {
    title: "Update Your Display Name and Profile URL",
    href: "/need-help/profile-setup/update-your-display-name-and-profile-url",
    tab: "Profile Setup",
  },
  {
    title: "The Profile URL I want is taken",
    href: "/need-help/profile-setup/profile-url-taken",
    tab: "Profile Setup",
  },
  {
    title: "Update Your Profile Image and Header",
    href: "/need-help/profile-setup/update-your-profile-image-and-header",
    tab: "Profile Setup",
  },
  {
    title: "Profile Description, Web Links, and Location",
    href: "/need-help/profile-setup/profile-description-web-links-and-location",
    tab: "Profile Setup",
  },
  {
    title: "Spotlight Tracks & Playlists",
    href: "/need-help/profile-setup/spotlight-tracks-and-playlists",
    tab: "Profile Setup",
  },
  { title: "Comments", href: "/need-help/social-features/comments", tab: "Social Features" },
  {
    title: "Direct Messages",
    href: "/need-help/social-features/direct-messages",
    tab: "Social Features",
  },
  { title: "Followers", href: "/need-help/social-features/followers", tab: "Social Features" },
  { title: "Login Issues", href: "/need-help/account-access/login-issues", tab: "Account Access" },
  {
    title: "Passwords & Account Recovery",
    href: "/need-help/account-access/passwords-and-account-recovery",
    tab: "Account Access",
  },
  {
    title: "Manage Email & Push Notifications",
    href: "/need-help/email-notifications/manage-email-and-push-notifications",
    tab: "Email & Notifications",
  },
  {
    title: "Manage Communications Settings",
    href: "/need-help/email-notifications/manage-communications-settings",
    tab: "Email & Notifications",
  },
  {
    title: "Managing Email Addresses in Your BeatZa Account",
    href: "/need-help/manage-account/managing-email-addresses",
    tab: "Manage My Account",
  },
  {
    title: "Managing Multiple BeatZa Accounts",
    href: "/need-help/manage-account/managing-multiple-accounts",
    tab: "Manage My Account",
  },
  {
    title: "Sign out of your account",
    href: "/need-help/manage-account/sign-out",
    tab: "Manage My Account",
  },
  {
    title: "Sharing access to an account",
    href: "/need-help/manage-account/sharing-access",
    tab: "Manage My Account",
  },
  {
    title: "How can I delete my account?",
    href: "/need-help/manage-account/delete-account",
    tab: "Manage My Account",
  },
];

const TABS = [
  {
    label: "Getting Started",
    value: "getting-started",
    href: "/need-help/getting-started",
    basePath: "/need-help/getting-started",
  },
  {
    label: "Profile Setup",
    value: "profile-setup",
    href: "/need-help/profile-setup",
    basePath: "/need-help/profile-setup",
  },
  {
    label: "Social Features",
    value: "social-features",
    href: "/need-help/social-features",
    basePath: "/need-help/social-features",
  },
  {
    label: "Account Access",
    value: "account-access",
    href: "/need-help/account-access",
    basePath: "/need-help/account-access",
  },
  {
    label: "Email & Notifications",
    value: "email-notifications",
    href: "/need-help/email-notifications",
    basePath: "/need-help/email-notifications",
  },
  {
    label: "Manage My Account",
    value: "manage-account",
    href: "/need-help/manage-account",
    basePath: "/need-help/manage-account",
  },
];

export default function HelpLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const profileImgLink = useAppSelector((state) => state.auth.profileImgLink);
  const displayName = useAppSelector((state) => state.auth.displayName);
  const userId = useAppSelector((state) => state.auth.userId);
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated);
  const profileFirstName = useAppSelector((state) => state.profile.firstName);
  const profileLastName = useAppSelector((state) => state.profile.lastName);

  const dispatch = useAppDispatch();
  const { logout } = useLogout();
  const { getProfile } = useGetProfile();

  const headerName =
    profileFirstName || profileLastName
      ? `${profileFirstName || ""} ${profileLastName || ""}`.trim()
      : displayName;

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    logout();
  };

  useEffect(() => {
    if (!hasHydrated || !userId) return;
    getProfile(userId).then((data) => {
      if (!data) return;
      dispatch(
        setProfile({
          userId: data.userId,
          displayName: data.displayName,
          firstName: data.firstName,
          lastName: data.lastName,
          profileImgLink: data.profileImgLink,
          bannerImgLink: data.bannerImgLink,
          city: data.city,
          country: data.country,
          isOwnProfile: true,
        })
      );
    });
    return () => {
      dispatch(clearProfile());
    };
  }, [userId, hasHydrated]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) setSubmitted(true);
  };

  const handleClear = () => {
    setSearch("");
    setSubmitted(false);
  };

  const results =
    submitted && search.trim()
      ? ALL_ARTICLES.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
      : [];

  const showResults = submitted && search.trim().length > 0;

  const LogoBlock = () => (
    <Link href="/" className="flex items-center gap-3">
      <img src="/app-logo/beatza.png" alt="BeatZa" className="w-10 h-10 object-contain" />
      <div className="flex flex-col leading-none">
        <span className="text-white font-black text-xl tracking-widest uppercase">BeatZa</span>
        <span className="text-[#ff5836] font-bold text-[10px] tracking-[0.3em] uppercase">
          Craving Tunes
        </span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#f2f2f2]">
      {/* Hero */}
      <div className="w-full bg-black py-16 px-6 flex flex-col items-center gap-6">
        {/* Logo row */}
        {isAuthenticated ? (
          // Authenticated — logo left, profile right
          <div className="flex items-center justify-between w-full max-w-lg mb-2">
            <LogoBlock />
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`cursor-pointer flex items-center gap-2 px-2 py-1 rounded ${isDropdownOpen ? "bg-[#1a1a1a]" : ""}`}
              >
                <ProfileImage
                  src={profileImgLink}
                  alt="Profile"
                  width={26}
                  height={26}
                  className="rounded-full w-6.5 h-6.5 object-cover"
                />
                <span className="text-white font-bold text-sm truncate max-w-30">{headerName}</span>
                <IoIosArrowDown className="text-white" />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 bg-[#101010] w-40 z-50 rounded">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left hover:bg-[#333333] text-sm text-white-smoke"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Not authenticated — logo centered
          <div className="flex justify-center w-full max-w-lg mb-2">
            <LogoBlock />
          </div>
        )}

        <h1 className="text-white text-2xl sm:text-3xl font-bold text-center tracking-tight">
          Help Center
        </h1>

        <form onSubmit={handleSearch} className="relative w-full max-w-lg">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!e.target.value.trim()) setSubmitted(false);
            }}
            placeholder="Search for answers..."
            className="w-full h-10 bg-[#1a1a1a] text-white placeholder-[#8d8d8d] rounded-sm pl-4 pr-16 text-sm outline-none caret-white ring-1 ring-transparent focus:ring-[#8d8d8d] transition-all duration-300"
          />
          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-9 top-1/2 -translate-y-1/2 text-[#8d8d8d] hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
            <CiSearch className="text-[#8d8d8d] text-2xl hover:text-white transition-colors" />
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="bg-black border-b border-white/10 sticky top-0 z-10">
        <div className="sm:flex sm:justify-center overflow-x-auto tabs-scrollable px-2 sm:px-4">
          <TabsNavbar
            tabs={TABS.map((t) => ({
              href: t.href,
              label: t.label,
              value: t.value,
              basePath: t.basePath,
            }))}
            pathname={pathname}
            className=""
            tabsWrapperClassName="flex items-center [&>*]:whitespace-nowrap"
            textSize="text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {showResults ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {results.length === 0
                  ? `No results for "${search}"`
                  : `${results.length} result${results.length !== 1 ? "s" : ""} for "${search}"`}
              </p>
              <button
                onClick={handleClear}
                className="text-xs text-gray-400 hover:text-black transition-colors underline"
              >
                Clear search
              </button>
            </div>

            {results.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <ul>
                  {results.map((article, idx) => (
                    <li
                      key={article.href}
                      className={idx < results.length - 1 ? "border-b border-gray-100" : ""}
                    >
                      <Link
                        href={article.href}
                        onClick={handleClear}
                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div>
                          <p className="text-sm text-gray-800 group-hover:text-black">
                            {article.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{article.tab}</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-400 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          children
        )}
      </div>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`
          fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-black text-white
          flex items-center justify-center shadow-lg
          transition-all duration-300
          hover:bg-[#ff5836]
          ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
