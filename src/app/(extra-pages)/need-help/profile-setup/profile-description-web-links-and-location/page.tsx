import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function ProfileDescriptionWebLinksAndLocation() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/need-help/profile-setup" className="hover:text-black transition-colors flex items-center gap-1">
          <ChevronLeft size={12} />
          Profile Setup & Customization
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-4">Profile Description, Web Links, and Location</h1>

        <p className="text-gray-700 text-sm leading-relaxed mb-8">
          To change your profile description or web links, sign in to your account and go to your profile's edit page
          by clicking the small pen icon below your header image.
        </p>

        {/* Bio best practices */}
        <h2 className="text-black text-lg font-bold mb-3">
          What are the best practices for writing a bio on BeatZa, particularly for artists?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">When crafting your bio:</p>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Be Concise and Impactful</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Use the 4,000-character limit to provide a clear and engaging introduction that reflects your personality
              and artistic style. Highlight key achievements, influences, and what sets you apart as an artist.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Include Relevant Information</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Share details such as your background, genre, and any upcoming projects or releases. This helps listeners
              connect with you and understand your music better.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Add Links to Enhance Your Profile</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Although HTML formatting isn't supported, you can include up to 10 full URLs in your bio. Consider linking
              to your website, social media profiles, and other platforms where fans can follow your work.
            </p>
          </div>
        </div>

        {/* Managing content and links */}
        <h2 className="text-black text-lg font-bold mb-3">
          How can artists link relevant content and manage other profile details on BeatZa?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">To effectively link and manage your content:</p>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Add Web Links</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              On your profile's edit page, you can add up to 10 links to share your website, social media profiles, or
              other relevant platforms. For example, linking your Twitter account ensures your handle is included in
              pre-filled text when fans share your tracks on Twitter.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Display Tour Dates</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you have upcoming shows, add a Resident Advisor or Songkick URL to your web links. This will
              automatically display your tour dates on the right-hand side of your BeatZa profile, keeping your fans informed.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">Customize Location Information</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              You can change your city or country by editing your profile. If your country isn't listed, consider
              including it in your bio as free text to ensure your location is visible to your audience.
            </p>
          </div>
        </div>

        {/* Editing on web and mobile */}
        <h2 className="text-black text-lg font-bold mb-3">
          How can users edit their bio and links on both web and mobile platforms?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">To edit your bio:</p>
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">On the Web</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Sign in to your BeatZa account, go to your profile, and click the "Edit" button below your header image.
              Here, you can update your bio, add links, and manage other profile details.
            </p>
          </div>
          <div>
            <h3 className="text-black text-sm font-semibold mb-1">On Mobile (iOS or Android)</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Access your profile by tapping the three dots in the upper right corner of the home page, then select
              "Edit Profile" and "Bio" to make changes directly from your mobile device.
            </p>
          </div>
        </div>

        {/* How to change location */}
        <h2 className="text-black text-lg font-bold mb-3">How do I change my location in my Bio?</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          You can change your city and/or country on your profile via these steps:
        </p>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2">
          <li>Open up your BeatZa account.</li>
          <li>Click on the "Edit" button on the right side, below the header.</li>
          <li>Change your city and/or country.</li>
        </ol>
        <p className="text-gray-700 text-sm leading-relaxed mt-3">
          If your country is not listed and you need to include your location on your profile, we would recommend
          including it in another free text field, e.g. in your profile description, which you can edit through the
          Edit button below your profile header.
        </p>
      </article>

    </div>
  )
}