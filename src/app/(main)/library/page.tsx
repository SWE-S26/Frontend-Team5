// default page of library goes to overview tab
import { Metadata } from "next";
import LibraryGuard from "./LibraryGuard";

export const metadata: Metadata = {
  title: "Hear your likes and playlists, and tracks from people you follow: on BeatZa",
};

export default function Library() {
  return (
    <LibraryGuard>
      <div>
        Overview
      </div>
    </LibraryGuard>
  );
}