interface HeroSectionProps {
  onScrollToPlans: () => void
}

export function HeroSection({ onScrollToPlans }: HeroSectionProps) {
    return (
    <section className="bg-[#121212] flex justify-center min-h-screen "
             style={{ 
                backgroundImage: "url('/artist/hero-background-image-speakers.svg')",
                backgroundSize: '64%',
                backgroundPosition: '100% 0',
                backgroundRepeat: 'no-repeat'
             }}>
        <div className="relative w-full max-w-291 overflow-hidden">
            {/* Content */}
            <div className="flex flex-col items-start justify-center min-h-screen mt-36 ml-5.5 relative z-10"> 
                <div className="">

                    {/* Main heading */}
                    <h1 className="text-[86px] font-black text-white">
                        Reach more listeners.
                    </h1>

                    {/* Subheading with avatars */}
                    <div className="mt-2.5">
                        <p className="text-[28px] font-bold text-white">
                            Join millions of artists that use SoundCloud to get heard.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap gap-8 mt-14.5">
                        <button
                            onClick={onScrollToPlans}
                            className="rounded-full bg-white px-6 py-2.5 font-semibold text-black transition-all duration-200 text-sm hover:bg-black hover:text-white"
                            >
                            Get Artist Pro
                        </button>
                        <button
                            onClick={onScrollToPlans}
                            className="rounded-full border border-white px-6 font-semibold text-white transition-all duration-200 text-sm hover:bg-white hover:text-black"
                            >
                            See all plans
                        </button>
                    </div>

                    {/* Features grid */}
                    <div className="flex gap-9 mt-20 mb-20">
                        {[
                        {
                            icon: '/artist/bullseye.svg',
                            title: 'Grow your audience',
                            description:
                            'Artist Pro subscribers get on average 400% more listens, thanks to our audio algorithm and featured playlists.',
                        },
                        {
                            icon: '/artist/histogram.svg',
                            title: 'Know your audience',
                            description:
                            'Get advanced fan insights and custom listening reports to build connections and plan promotions, releases, and tours.',
                        },
                        {
                            icon: '/artist/infinity.svg',
                            title: 'Upload unlimited tracks',
                            description:
                            'Upload and replace unlimited tracks without losing your plays, likes, and comments.',
                        },
                        {
                            icon: '/artist/distribute.svg',
                            title: 'Distribution is included',
                            description:
                            'Distribute and get paid on SoundCloud and 60+ platforms including Spotify, Apple Music, and TikTok.',
                        },
                        ].map((feature, idx) => (
                        <div key={idx} className="w-[50%]">
                            <img src={feature.icon} alt={feature.title} className="w-15 h-15 mb-5" />
                            <h3 className="text-[20px] font-semibold text-white mb-1">{feature.title}</h3>
                            <p className="text-sm text-white">{feature.description}</p>
                        </div>                        
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}