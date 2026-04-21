import Link from "next/link"
import { ChevronRight } from "lucide-react"

const ARTICLES = [
  { title: "Introduction to BeatZa",        href: "/need-help/getting-started/introduction-to-beatza"        },
  { title: "Creating an account on BeatZa", href: "/need-help/getting-started/creating-an-account"           },
  { title: "Anatomy of BeatZa",             href: "/need-help/getting-started/anatomy-of-beatza"             },
  { title: "Email requirements",            href: "/need-help/getting-started/email-requirements"            },
  { title: "Verify your email",             href: "/need-help/getting-started/verify-your-email"             },
  { title: "Common Errors During Sign Up",  href: "/need-help/getting-started/common-errors-during-sign-up"  },
]

export default function GettingStartedPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Help Center</p>
        <h1 className="text-black text-2xl font-bold">Getting Started on BeatZa</h1>
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