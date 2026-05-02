import Link from "next/link";
import GoMobile from "../layout/GoMobile";

const FOOTER_LINKS = [
  { label: "About Us",       href: "/about-us"                    },
  { label: "Legal",          href: "/legal"                       },
  { label: "Copyright",      href: "/copyright"                   },
  { label: "Support",        href: "/need-help/getting-started"   },
  { label: "Privacy Policy", href: "/privacy-policy"              },
];

export default function SidebarFooter() {
  return (
    <>
      <GoMobile />
      <div className="mt-3 text-xs text-silver leading-6">
        {FOOTER_LINKS.map(({ label, href }, i) => (
          <span key={label}>
            <Link href={href} className="hover:text-white-smoke">
              {label}
            </Link>
            {i < FOOTER_LINKS.length - 1 && " · "}
          </span>
        ))}
      </div>
    </>
  );
}