/* ----------- Components ----------- */
import HeroBanner from "@/components/landing-page/HeroBanner";
import NavbarCenter from "@/components/layout/navbar/main-navbar/NavbarCenter";
import Button from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-310 mt-9">
        <HeroBanner />
        <div className="flex gap-3 items-center justify-center mt-14">
          <div className="w-[49%]">
            {" "}
            <NavbarCenter />{" "}
          </div>
          <h1 className="font-bold">or</h1>
          <Button className="px-3 py-1.5 text-[17px] cursor-pointer bg-white-smoke text-chinese-black">
            Upload Your Own
          </Button>
        </div>

        <div className="flex flex-col gap-5 items-center justify-center mt-9">
          <h1 className="font-bold text-xl">
            Hear what’s trending for free in the SoundCloud community
          </h1>
          <a href="/home">
            <Button className="px-3 py-1.5 text-[17px] cursor-pointer bg-white-smoke text-chinese-black">
              Explore Trending Playlists
            </Button>
          </a>
        </div>

        <div className="my-20" />
      </div>
    </div>
  );
}
