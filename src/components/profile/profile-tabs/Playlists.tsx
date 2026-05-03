import PlaylistWaveformCard from "@/components/layout/track-cards/WaveformPlaylist";
import { Track as StoreTrack } from "@/store/slices/playerSlice";

interface Item {
  id: string;
  title: string;
  artist: string;
  artistId?: string;
  img: string;
  numLikes?: number;
  numReposts?: number;
  isLikedByUser?: boolean;
  isRepostedByUser?: boolean;
  playlistTracks?: any[];
  totalTracks?: number;
  permalink?: string;
  isAvailableForUser?: boolean;
}
interface Props {
  items: Item[];
  profileLink?: string | null;
}
export default function Playlists({ items, profileLink }: Props) {
  return (
    <>
      <div className="flex flex-col gap-12">
        {items.map((item) => (
          <PlaylistWaveformCard
            key={item.id}
            img={item.img}
            title={item.title}
            artist={item.artist}
            artistId={item.artistId}
            playlistId={item.id}
            likeCount={item.numLikes ?? 0}
            repostCount={item.numReposts ?? 0}
            isLikedByUser={item.isLikedByUser}
            isRepostedByUser={item.isRepostedByUser}
            permalink={item.permalink}
            profileLinkOverride={profileLink}
            preloadedTracks={(item.playlistTracks ?? []).map((t, i) => ({
              _id: t._id ?? `${item.id}-${i}`,
              poster: t.poster,
              basicInfo: {
                ...(t.basicInfo ?? {}),
                title: t.basicInfo?.title ?? t.title ?? "Unknown Title",
                mainArtists: t.basicInfo?.mainArtists ?? [t.artist ?? "Unknown Artist"],
                permalink: t.basicInfo?.permalink ?? t.permalink ?? "",
              },
              audio: t.audio ?? { audioLink: "", waveformLink: "" },
              image: t.image ?? { imgLink: t.img ?? undefined },
              durationInSeconds: t.durationInSeconds ?? t.duration ?? 0,
              numOfPlays: t.numOfPlays ?? 0,
              numOfLikes: t.numOfLikes ?? 0,
              isLiked: t.isLiked ?? false,
              isReposted: t.isReposted ?? false,
              isAvailableForUser: t.isAvailableForUser,
            }))}
            totalTracks={item.totalTracks}
            isRepost={(item as any).isRepost}
            reposterId={(item as any).reposterId}
            reposterName={(item as any).reposterName}
          />
        ))}
      </div>

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
