import UserCard from "./UserCard";
import EmptyCard from "./EmptyCard";
import EmptySocial from "./EmptySocial";
import { SocialUser } from "@/types/social.types";
import { Spin } from "antd";

interface UserCardGridProps {
  users: SocialUser[];
  loading?: boolean;
  emptyType: "followers" | "following";
  isOwn?: boolean;
  displayName?: string;
  cols?: 5 | 6;
}

// Full responsive class strings — Tailwind needs complete class names, no interpolation
const colsClassMap: Record<number, string> = {
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
};

const UserCardGrid = ({
  users,
  loading = false,
  emptyType,
  isOwn,
  displayName,
  cols = 5,
}: UserCardGridProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (users.length === 0) {
    return <EmptySocial type={emptyType} isOwn={isOwn} displayName={displayName} />;
  }

  const remainder = users.length % cols;
  const emptySlots = remainder === 0 ? 0 : cols - remainder;

  const slots = [
    ...users.map((user) => ({ type: "user" as const, data: user })),
    ...Array(emptySlots).fill({ type: "empty" as const }),
  ];

  return (
    <div className={`grid ${colsClassMap[cols]} gap-4 sm:gap-5 lg:gap-4`}>
      {slots.map((slot, index) =>
        slot.type === "user" ? (
          <UserCard key={slot.data.userId} user={slot.data} />
        ) : (
          <EmptyCard key={`empty-${index}`} />
        )
      )}
    </div>
  );
};

export default UserCardGrid;
