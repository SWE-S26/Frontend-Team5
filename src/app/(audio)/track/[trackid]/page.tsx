import { use } from "react";
import TrackHeader from "@/components/track/TrackHeader";
import Navbar from "@/components/layout/navbar/main-navbar/Navbar";

export default function Track({
  params,
}: {
  params: Promise<{ trackid: string }>;
}) {
  const { trackid } = use(params);

  return (
    <div>
      <Navbar />
      <TrackHeader trackId={trackid} />
      <div>Track Page</div>
    </div>
  );
}