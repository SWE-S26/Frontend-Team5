import WaveformCard from "@/components/layout/track-cards/WaveformCard";

interface Item {
  id: string;
  trackId?: string;
  title: string;
  artist: string;
  img: string;
  trackUrl?: string;
  enableDirectDownload?: boolean;
  duration?: number;
  numLikes?: number;
  numReposts?: number;
  isLikedByUser?: boolean;
}
interface Props {
  items: Item[];
}

export default function Albums({ items }: Props) {
  return (
    <>
      <div className="flex flex-col gap-12"></div>

      <div className="flex justify-center">
        <img
          src="/app-logo/whitelogo.png"
          alt="App Logo"
          className="w-12 logo-dark h-8 mt-8 opacity-50"
        />
        <img
          src="/app-logo/blacklogo.png"
          alt="App Logo"
          className="w-12 logo-light h-8 mt-8 opacity-50"
        />
      </div>
    </>
  );
}
