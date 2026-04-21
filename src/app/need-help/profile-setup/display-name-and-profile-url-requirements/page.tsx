import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function DisplayNameAndProfileUrlRequirements() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/need-help/profile-setup" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft size={12} />
          Profile Setup & Customization
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-8">Display Name and Profile URL Requirements</h1>

        {/* Display Name */}
        <h2 className="text-black text-lg font-bold mb-4">Display Name</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          When selecting a display name on BeatZa:
        </p>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Keep it Consistent</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Ensure your display name aligns with your branding across other platforms. This consistency helps fans easily recognize and find you.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Make it Memorable</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Choose a name that is unique, easy to remember, and reflects your style or genre. Avoid using overly complex characters or symbols that might confuse your audience.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Consider SEO</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Think about how your name might appear in search results. A clear and simple name can improve your visibility when fans search for your music.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Keep it Simple and Direct</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              We have a maximum limit of <span className="font-medium text-black">50 characters</span> for Display Names. If you are hitting this limit, your Display Name will not save properly.
            </p>
          </div>
        </div>

        {/* Profile URL */}
        <h2 className="text-black text-lg font-bold mb-4">Profile URL</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          When setting your profile URL:
        </p>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Keep it Simple and Direct</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Choose a simple URL that matches your display name to help fans find and share your profile easily. Profile URLs must be between <span className="font-medium text-black">3 and 25 characters</span>. Using "BeatZa" in your URL is not allowed.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Avoid Special Characters</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Profile URLs can only contain numbers, lowercase letters, underscores, and hyphens. If you are using spaces or special characters in your Profile URL, you will be unable to save your changes.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Think Long-Term</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Choose a URL that you will be comfortable with as your brand grows. Changing your URL later can lead to confusion and broken links.
            </p>
          </div>
        </div>

        {/* First and Last Name */}
        <h2 className="text-black text-lg font-bold mb-4">First and Last Name</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Keep it Consistent</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Ensure your name aligns with your branding across other platforms. This consistency helps fans easily recognize and find you.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Keep it Simple and Direct</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              We have a maximum limit of <span className="font-medium text-black">35 characters</span> for the first and last name fields. If you are hitting this limit, these changes will not save properly.
            </p>
          </div>
        </div>
      </article>

    </div>
  )
}