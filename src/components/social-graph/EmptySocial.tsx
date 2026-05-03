type EmptyStateProps = {
  type: "likes" | "following" | "followers";
  isOwn?: boolean;
  displayName?: string;
};

const EmptySocial = ({ type, isOwn = false, displayName = "" }: EmptyStateProps) => {
  const message = isOwn
    ? {
        likes: "You have no likes yet.",
        following: "You aren't following anyone yet.",
        followers: "No one is following you yet.",
      }[type]
    : {
        likes: `${displayName} hasn't liked any tracks.`,
        following: `${displayName} isn't following anyone yet.`,
        followers: `No one is following ${displayName} yet.`,
      }[type];

  return (
    <div className="flex justify-center items-center h-64">
      <p className="text-white font-bold text-2xl">{message}</p>
    </div>
  );
};

export default EmptySocial;
