import Link from "next/link";
import { ChevronRight } from "lucide-react";

const ARTICLES = [
  { title: "Comments", href: "/need-help/social-features/comments" },
  { title: "Direct Messages", href: "/need-help/social-features/direct-messages" },
  { title: "Followers", href: "/need-help/social-features/followers" },
];

export default function SocialFeaturesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Help Center</p>
        <h1 className="text-black text-2xl font-bold">
          Social Features (Likes, Comments, and Messaging)
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <ul>
          {ARTICLES.map((article, idx) => (
            <li
              key={article.href}
              className={idx < ARTICLES.length - 1 ? "border-b border-gray-100" : ""}
            >
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
  );
}
