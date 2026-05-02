"use client";

import Link from "next/link";
import SidebarFooter from "@/components/ui/SidebarFooter";

const sidebarSections = [
  {
    title: "Legal",
    links: [
      { label: "Terms Of Use", href: "/legal" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "#" },
      { label: "Cookie Manager", href: "#" },
      { label: "Community Guidelines", href: "#" },
      { label: "Moderation and Enforcement Policies", href: "#" },
      { label: "Law Enforcement Guidelines", href: "#" },
      { label: "Transparency Reports", href: "#" },
      { label: "Report Illegal Content", href: "/copyright" },
      { label: "Accessibility Statement", href: "#" },
    ],
  },
  {
    title: "Copyright",
    links: [
      { label: "Learn About Copyright", href: "/copyright" },
      { label: "Report Copyright Infringement", href: "/copyright/report" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About BeatZa", href: "/about-us" },
      { label: "Company Information", href: "/about-us" },
    ],
  },
];

export default function LegalSidebar() {
  return (
    <aside className="w-56 shrink-0">
      <div className="sticky top-10 space-y-8">
        {sidebarSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-white-smoke font-bold text-base mb-3">
              {section.title}
            </h3>

            <ul className="space-y-2">
              {section.links.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <Link
                    href={link.href}
                    className="text-[13px] cursor-pointer hover:underline text-[#044DD2]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <SidebarFooter />
      </div>
    </aside>
  );
}