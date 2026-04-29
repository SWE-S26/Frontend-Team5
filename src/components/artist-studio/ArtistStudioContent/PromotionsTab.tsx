function SpotifyLogo()     { return <div className="text-[36px] font-bold text-[#1DB954] sm:text-[48px]">Spotify®</div>; }
function AmazonMusicLogo() { return <div className="text-center"><div className="text-[26px] font-bold text-white-smoke sm:text-[32px]">amazon</div><div className="text-[16px] font-bold text-white-smoke sm:text-[20px]">music</div></div>; }
function GrooverLogo()     { return <div className="text-center"><div className="text-[38px] font-bold text-[#FF4500] sm:text-[48px]">|||</div><div className="text-[20px] font-bold text-[#FF4500] sm:text-[24px]">Groover</div></div>; }

function PromotionCard({ title, body, requirements, cta, logo, ctaTestId }: {
  title: string; body: string; requirements: string[]; cta: string; logo: React.ReactNode; ctaTestId: string;
}) {
  return (
    <article className="flex min-h-112 flex-col overflow-hidden rounded-lg border border-[#2a2a2a] bg-chinese-black sm:min-h-132">
      <div className="flex h-40 items-center justify-center bg-chinese-black sm:h-48">{logo}</div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 text-[16px] font-bold text-white-smoke">{title}</h3>
        <p className="text-[13px] leading-relaxed text-[#aaa]">{body}</p>
        {requirements.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-[12px] font-bold text-white-smoke">Eligibility requirements</p>
            <ul className="space-y-1">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-[#888]">
                  <span className="mt-0.5 text-[#666]">✦</span>{req}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-auto flex justify-end pt-5">
          <button type="button" data-testid={ctaTestId} className="rounded-full bg-white-smoke px-5 py-2 text-[13px] font-bold text-chinese-black hover:bg-upload-select transition-colors">{cta}</button>
        </div>
      </div>
    </article>
  );
}

export function PromotionsTab({ isArtistPro }: { isArtistPro: boolean }) {
  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
      <PromotionCard
        logo={<SpotifyLogo />}
        title="Pitch your track to Spotify"
        body="Use Spotify for Artists to pitch an upcoming, unreleased song to their playlist editors. Pitching your song will also make it eligible to your followers' Release Radar playlists."
        requirements={["You can only pitch one track per release."]}
        cta={isArtistPro ? "Visit Page" : "Get Artist Pro"}
        ctaTestId="artist-promotions-spotify-cta"
      />
      <PromotionCard
        logo={<AmazonMusicLogo />}
        title="Pitch your track to Amazon Music"
        body="Use Amazon Music for Artists to pitch a new song to their playlist editors. You can pitch up to 14 days past release."
        requirements={["You can only pitch one track per release.", "If you do not have access to AMFA, you must first claim your account."]}
        cta={isArtistPro ? "Visit Page" : "Get Artist Pro"}
        ctaTestId="artist-promotions-amazon-cta"
      />
      <PromotionCard
        logo={<GrooverLogo />}
        title="Groover"
        body={"Promote your music, get listened to and receive GUARANTEED feedback. Groover connects artists with the best curators, radios and labels seeking emerging talents.\n\nWith Artist Pro, you get 20% off your first Groover campaign and a free Hype add-on."}
        requirements={[]}
        cta={isArtistPro ? "Get Started" : "Get Artist Pro"}
        ctaTestId="artist-promotions-groover-cta"
      />
    </div>
  );
}