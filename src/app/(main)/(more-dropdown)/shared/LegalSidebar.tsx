"use client";

const sidebarSections = [
  {
    title: "Legal",
    links: [
      "Terms Of Use",
      "Privacy Policy",
      "Cookie Policy",
      "Cookie Manager",
      "Community Guidelines",
      "Moderation and Enforcement Policies",
      "Law Enforcement Guidelines",
      "Transparency Reports",
      "Report Illegal Content",
      "Accessibility Statement",
    ],
  },
  {
    title: "Copyright",
    links: ["Learn About Copyright", "Report Copyright Infringement"],
  },
  {
    title: "About",
    links: ["About BeatZa", "Company Information", "Press Information"],
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
                <li key={`${link}-${index}`}>
                  <a className="text-[13px] cursor-pointer hover:underline text-[#699FFF]">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}