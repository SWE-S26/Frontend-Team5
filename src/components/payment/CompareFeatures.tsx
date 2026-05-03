"use client";

import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks";

interface ComparisonFeature {
  category: string;
  features: {
    name: string;
    description: string;
    listener: string | boolean;
    pro: string | boolean;
  }[];
}

const COMPARISON_DATA: ComparisonFeature[] = [
  {
    category: "Get heard",
    features: [
      {
        name: "Promote tracks",
        description:
          "Our algorithm analyzes and recommends your tracks to 100 or even 1000 listeners most likely to love it",
        listener: false,
        pro: true,
      },
      {
        name: "Get playlisted",
        description:
          "Subscribers that opt in can get featured on playlists like Buzzing followed by future fans, A&Rs, and more",
        listener: false,
        pro: true,
      },
      {
        name: "Distribute and get paid",
        description:
          "Earn royalties from 60+ social and streaming platforms like Spotify and TikTok",
        listener: false,
        pro: true,
      },
      {
        name: "Advanced audience stats",
        description: "See how listeners found your music, your top fans, and where they're located",
        listener: false,
        pro: true,
      },
      {
        name: "Comments hub",
        description: "Effectively track and answer messages and comments",
        listener: false,
        pro: "Available",
      },
    ],
  },
  {
    category: "Manage your music",
    features: [
      {
        name: "Upload limit",
        description: "",
        listener: false,
        pro: true,
      },
      {
        name: "Free mastering credits",
        description: "",
        listener: false,
        pro: "3 tracks / month",
      },
      {
        name: "Replace tracks",
        description: "Swap out your track files without losing plays, likes or comments.",
        listener: false,
        pro: true,
      },
      {
        name: "Quiet mode",
        description:
          "Hide or turn off comments for tracks, and choose if you want to have plays and likes displayed.",
        listener: false,
        pro: "Available",
      },
      {
        name: "Schedule track releases",
        description: "",
        listener: false,
        pro: "Available",
      },
    ],
  },
  {
    category: "Build your brand",
    features: [
      {
        name: "Profile badge",
        description: "Visible to fans and collaborators.",
        listener: false,
        pro: "⭐ Pro",
      },
      {
        name: "Spotlight",
        description:
          "Have control over your first impression by spotlighting your best tracks at the top of your profile.",
        listener: false,
        pro: "5 tracks",
      },
    ],
  },
  {
    category: "Get paid",
    features: [
      {
        name: "Monetize on BeatZa",
        description:
          "Get paid for streams on BeatZa with fan-powered royalties, and keep 100% of your earnings.",
        listener: false,
        pro: true,
      },
      {
        name: "Distribute and monetize on 60+ other platforms",
        description:
          "Get paid regularly for streams on Spotify, Apple Music, TikTok and more, and keep 100% of your earnings.",
        listener: false,
        pro: true,
      },
      {
        name: "YouTube Content ID",
        description: "Get paid when your music is used in YouTube videos",
        listener: false,
        pro: "Available",
      },
      {
        name: "Split royalties",
        description: "Make sure your collaborators get paid",
        listener: false,
        pro: true,
      },
    ],
  },
  {
    category: "Special treatment",
    features: [
      {
        name: "Priority support",
        description: "",
        listener: false,
        pro: "Available",
      },
      {
        name: "Get 50% off Go+",
        description: "",
        listener: false,
        pro: "Available",
      },
      {
        name: "Exclusive Partner Savings",
        description:
          "Exclusive offers & discounts from partners like Groover, Serato, and Tracklib.",
        listener: false,
        pro: "Full access",
      },
      {
        name: "Split royalties",
        description: "Make sure your collaborators get paid",
        listener: false,
        pro: true,
      },
    ],
  },
];

interface CompareFeatureProps {
  onUpgrade: () => void;
  proPrice: number;
  currency: string;
}

export function CompareFeatures({ onUpgrade, proPrice, currency }: CompareFeatureProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const role = useAppSelector((state) => state.auth.role);
  const isPro = role === "Pro";

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const renderValue = (value: string | boolean, role: "listener" | "pro") => {
    if (value === false) {
      return (
        <div className="gap-2">
          <span className="text-sm text-gray-500">Not Available</span>
        </div>
      );
    }

    if (value === true) {
      return (
        <div className="gap-2">
          <span className={role === "pro" ? "text-teal-600 font-semibold" : "text-gray-600"}>
            Unlimited
          </span>
        </div>
      );
    }

    if (value === "Available") {
      return (
        <div className="flex items-center gap-1.5">
          <span className="text-teal-600 font-semibold">Available</span>
          <FaCheckCircle className="text-teal-600" />
        </div>
      );
    }

    return (
      <span className={role === "pro" ? "text-teal-600 font-semibold" : "text-gray-600"}>
        {value}
      </span>
    );
  };

  return (
    <section className="w-full bg-white px-4 sm:px-6 py-12 sm:py-20 md:px-16 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Section title */}
        <h2 className="mb-10 sm:mb-16 text-center text-4xl sm:text-5xl lg:text-[60px] font-bold text-black">
          Compare features
        </h2>

        {/* Comparison header - desktop only */}
        <div className="mb-5 hidden grid-cols-3 gap-8 md:grid">
          <div />
          {/* Listener column */}
          <div className="p-8 flex flex-col items-center">
            <h3 className="text-[32px] font-bold text-black">Listener</h3>
            <p className="mt-2 text-sm text-gray-600">Free</p>
            <button
              disabled
              className="w-fit mt-6 rounded-full border-2 border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 bg-gray-100"
            >
              {isPro ? "You're on Artist Pro" : "Current plan"}
            </button>
          </div>

          {/* Pro column */}
          <div className="p-8 flex flex-col items-center">
            <h3 className="text-[32px] font-bold text-black">Artist Pro</h3>
            <p className="mt-2 text-sm text-gray-600">Monthly or Yearly</p>
            <button
              onClick={onUpgrade}
              disabled={isPro}
              className="w-fit mt-6 rounded-full bg-black px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-900 disabled:bg-gray-400"
            >
              {isPro ? "You're on Artist Pro" : "Get started"}
            </button>
          </div>
        </div>

        {/* Comparison table */}
        <div className="space-y-0">
          {COMPARISON_DATA.map((section) => (
            <div key={section.category} className="border-b-2 border-gray-200 mb-10 sm:mb-20 pb-6">
              {/* Category header — tappable on mobile */}
              <button
                onClick={() => toggleCategory(section.category)}
                className="w-full px-0 pb-6 text-left transition-colors hover:bg-gray-50 md:cursor-default md:hover:bg-white"
              >
                <h3 className="text-lg sm:text-xl font-bold text-black border-b border-black pb-6 sm:pb-8 px-4">
                  {section.category}
                </h3>
              </button>

              {/* Features */}
              <div
                className={`space-y-6 sm:space-y-8 md:block px-4 ${
                  expandedCategory === section.category ? "block" : "hidden"
                }`}
              >
                {section.features.map((feature, idx) => (
                  <div key={idx} className="grid grid-cols-1 gap-3 md:gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                      <h4 className="font-semibold text-black text-sm sm:text-base">
                        {feature.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                    </div>

                    <div className="md:col-span-1 flex items-center md:justify-center gap-2">
                      <span className="text-xs text-gray-400 md:hidden">Listener:</span>
                      {renderValue(feature.listener, "listener")}
                    </div>

                    <div className="md:col-span-1 flex items-center md:justify-center gap-2">
                      <span className="text-xs text-gray-400 md:hidden">Pro:</span>
                      {renderValue(feature.pro, "pro")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile comparison cards */}
        <div className="mt-8 sm:mt-12 space-y-6 md:hidden">
          <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-4 text-xl font-black text-black">Listener</h3>
            <p className="mb-4 text-sm text-gray-600">Free</p>
            <button
              disabled
              className="w-full rounded-full border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100"
            >
              {isPro ? "You're on Artist Pro" : "Current plan"}
            </button>
          </div>

          <div className="rounded-xl border-2 border-teal-600 bg-teal-50 p-6">
            <h3 className="mb-4 text-xl font-black text-black">Artist Pro</h3>
            <p className="mb-4 text-sm text-teal-600 font-semibold">
              {currency}
              {proPrice.toFixed(2)}
            </p>
            <button
              onClick={onUpgrade}
              disabled={isPro}
              className="w-full rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-900 disabled:bg-gray-400"
            >
              {isPro ? "You're on Artist Pro" : "Get started"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
