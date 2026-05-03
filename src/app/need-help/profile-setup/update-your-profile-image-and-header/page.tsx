import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function UpdateYourProfileImageAndHeader() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link
          href="/need-help/profile-setup"
          className="hover:text-black transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={12} />
          Profile Setup & Customization
        </Link>
      </div>

      <article className="bg-white rounded-2xl shadow-sm px-8 py-10">
        <h1 className="text-black text-2xl font-bold mb-8">Update Your Profile Image and Header</h1>

        {/* Profile Image */}
        <h2 className="text-black text-lg font-bold mb-4">Update Your Profile Image</h2>

        <h3 className="text-black text-sm font-semibold mb-2">
          Image Requirements & Specifications
        </h3>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-6">
          <li>
            The image must be <span className="font-medium text-black">2MB or less</span> and in{" "}
            <span className="font-medium text-black">.jpg or .png</span> format.
          </li>
          <li>
            For optimal display, the image should be square and at least{" "}
            <span className="font-medium text-black">800 × 800 pixels</span>.
          </li>
          <li>
            Image uploads can only be done through the main BeatZa website, not through the mobile
            site or app.
          </li>
          <li>Profile avatars are circular to differentiate from track and playlist artwork.</li>
        </ul>

        <h3 className="text-black text-sm font-semibold mb-2">On Web</h3>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-6">
          <li>Go to your Profile Page or the profile edit page.</li>
          <li>
            Click <span className="font-medium text-black">Update Image</span>.
          </li>
          <li>Select a file from your computer.</li>
          <li>
            Click <span className="font-medium text-black">Save Changes</span>.
          </li>
        </ol>

        <h3 className="text-black text-sm font-semibold mb-2">On iOS or Android</h3>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-6">
          <li>Tap the icon in the lower right corner of the home page to access your Library.</li>
          <li>Tap your avatar.</li>
          <li>Click the pen icon.</li>
          <li>Tap the camera icon on your avatar.</li>
          <li>Select the image you would like to upload and save.</li>
        </ol>

        <h3 className="text-black text-sm font-semibold mb-2">Delete Your Profile Picture</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-10">
          To delete your profile picture, click{" "}
          <span className="font-medium text-black">Update Image</span> and select{" "}
          <span className="font-medium text-black">Delete Image</span>.
        </p>

        {/* Profile Header */}
        <h2 className="text-black text-lg font-bold mb-4">Update Your Profile Header</h2>

        <h3 className="text-black text-sm font-semibold mb-2">
          Image Requirements & Specifications
        </h3>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1.5 mb-6">
          <li>
            For best results, upload JPG or PNG images of at least{" "}
            <span className="font-medium text-black">2480 × 520 pixels</span> with a{" "}
            <span className="font-medium text-black">2MB size limit</span>.
          </li>
          <li>
            Avoid using text within your header image as it will be cropped on smaller screens.
          </li>
          <li>
            Once selected, you can drag the image up and down or zoom in and out. If you cannot
            zoom, your image is likely smaller than 1240 × 260 pixels.
          </li>
        </ul>

        <h3 className="text-black text-sm font-semibold mb-2">On Web</h3>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-6">
          <li>Go to your Profile Page or the profile edit page.</li>
          <li>
            Click <span className="font-medium text-black">Update Image</span>.
          </li>
          <li>Select a file from your computer.</li>
          <li>
            Click <span className="font-medium text-black">Save Changes</span>.
          </li>
        </ol>

        <h3 className="text-black text-sm font-semibold mb-2">On iOS or Android</h3>
        <ol className="list-decimal list-inside text-gray-700 text-sm leading-relaxed space-y-2 mb-6">
          <li>Tap the icon in the lower right corner of the home page to access your Library.</li>
          <li>Tap your avatar.</li>
          <li>Click the pen icon.</li>
          <li>Tap the existing header image.</li>
          <li>Select the image you would like to upload and save.</li>
        </ol>

        <h3 className="text-black text-sm font-semibold mb-2">Delete Your Profile Header</h3>
        <p className="text-gray-700 text-sm leading-relaxed">
          To delete your profile header, click{" "}
          <span className="font-medium text-black">Update Image</span> and select{" "}
          <span className="font-medium text-black">Delete Image</span>. If you delete your image,
          the Profile Header will return to a gradient based on the colors in your profile image.
        </p>
      </article>
    </div>
  );
}
