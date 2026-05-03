"use client";

export default function GoMobile() {
  return (
    <div className="flex flex-col gap-3 ">
      <p>GO MOBILE</p>
      <a
        href="https://play.google.com/store/apps/details?id=com.soundcloud.android&hl=us&referrer=utm_source%3Dsoundcloud%26utm_medium%3Dweb%26utm_campaign%3Dweb_xsell_user_page"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/stores-buttons/google-play-button.png"
          alt="Get it on Google Play"
          className="h-12 w-33 cursor-pointer hover:opacity-80 transition-opacity"
        />
      </a>
    </div>
  );
}
