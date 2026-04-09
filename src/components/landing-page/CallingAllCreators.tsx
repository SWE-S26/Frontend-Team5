import Image from "next/image";
import Link from "next/link";

export default function CallingAllCreators() {
  return (
    <section className="w-full bg-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-8 py-16 flex items-center justify-between gap-12">

        {/* ── Left: copy ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 max-w-md">
          <h2 className="text-white text-[2.8rem] font-light leading-tight">
            Calling all creators
          </h2>

          <p className="text-white font-bold text-[15px] leading-relaxed">
            Get on Beatza to connect with fans, share your sounds, and grow your audience. What are you waiting for?
          </p>

          <Link href="/sign-up">
            <button className="w-fit bg-white text-black font-semibold text-sm px-6 py-3 rounded-sm hover:bg-white-smoke transition-colors cursor-pointer">
              Find out more
            </button>
          </Link>
        </div>

        {/* ── Right: image ─────────────────────────────────────────── */}
        <div className="relative shrink-0 w-[55%] h-70">
          <Image
            src="/landing-page/calling-all-creators.png"
            alt="Calling all creators"
            fill
            className="object-contain object-right"
          />
        </div>

      </div>
    </section>
  );
}