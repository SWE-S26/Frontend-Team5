type PlayerTrackInfoProps = {
  img?: string | null;
  title?: string | null;
  artist?: string | null;
};

export default function PlayerTrackInfo({ img, title, artist }: PlayerTrackInfoProps) {
  // Don't show anything if track info hasn't loaded yet
  if (!img && !title && !artist) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      {img && <img src={img} alt="cover" className="w-9 h-9 aspect-square object-cover" />}

      <div className="flex flex-col mr-5 min-w-22.5 max-w-50">
        {title && (
          <span className="text-silver text-sm font-bold truncate whitespace-nowrap overflow-hidden">
            {title}
          </span>
        )}
        {artist && (
          <span className="text-white-smoke text-sm truncate whitespace-nowrap overflow-hidden">
            {artist}
          </span>
        )}
      </div>
    </div>
  );
}
