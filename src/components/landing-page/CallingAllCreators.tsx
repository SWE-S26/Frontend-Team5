import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CallingAllCreators() {
  return (
    <section className="w-full bg-black">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-87">

        {/* Left: copy */}
        <div className="flex flex-col gap-3 max-w-md">
          <h2 className="text-white text-4xl leading-tight">
            Calling all creators
          </h2>

          <p className="text-white font-bold text-[15px] leading-relaxed">
            Get on Beatza to connect with fans, share your sounds, and grow your audience. What are you waiting for?
          </p>

          <Link href="/sign-up" className="pt-8">
            <Button className="bg-white text-black">
              Find out more
            </Button>
          </Link>
        </div>

        {/* Right: image  */}
        <div className="relative shrink-0 w-[55%] h-100">
          <Image
            src="/landing-page/CallingAllCreators.png"
            alt="Calling all creators"
            fill
            className="object-contain object-right"
          />
        </div>

      </div>
    </section>
  );
}