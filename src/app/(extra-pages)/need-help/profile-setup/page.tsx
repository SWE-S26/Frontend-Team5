import Link from "next/link"
import { ChevronRight } from "lucide-react"

const ARTICLES = [
  { title: "Display Name and Profile URL Requirements",    href: "/need-help/profile-setup/display-name-and-profile-url-requirements"  },
  { title: "Update Your Display Name and Profile URL",     href: "/need-help/profile-setup/update-your-display-name-and-profile-url"   },
  { title: "The Profile URL I want is taken",              href: "/need-help/profile-setup/profile-url-taken"                          },
  { title: "Update Your Profile Image and Header",         href: "/need-help/profile-setup/update-your-profile-image-and-header"       },
  { title: "Profile Description, Web Links, and Location", href: "/need-help/profile-setup/profile-description-web-links-and-location" },
  { title: "Spotlight Tracks & Playlists",                 href: "/need-help/profile-setup/spotlight-tracks-and-playlists"             },
]

export default function ProfileSetupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Help Center</p>
        <h1 className="text-black text-2xl font-bold">Profile Setup & Customization</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <ul>
          {ARTICLES.map((article, idx) => (
            <li key={article.href} className={idx < ARTICLES.length - 1 ? "border-b border-gray-100" : ""}>
              <Link
                href={article.href}
                className="flex items-center justify-between px-6 py-4 text-sm text-gray-800 hover:bg-gray-50 hover:text-black transition-colors"
              >
                {article.title}
                <ChevronRight size={14} className="text-gray-400 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}