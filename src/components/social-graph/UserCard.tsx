
import { FaUser } from "react-icons/fa";
import FollowButton from "../ui/FollowButton";

const UserCard = () => {
  return (
    <div className="cursor-pointer group/usercard">
      <div className="flex gap-2 flex-col items-center">
        <img src={"/testp1.jpeg"} alt="User" className="w-40 h-40 rounded-full object-cover" />
        <div className="text-sm font-bold hover:text-silver">Eren Yeager</div>
        <div className="flex items-center gap-1">
          <FaUser className="w-4 h-4 fill-current text-silver" />
          <span className="text-xs text-silver">2 followers</span>
        </div>
        <div className="invisible group-hover/usercard:visible">
          <FollowButton initialIsFollowing={false} />
        </div>
      </div>
    </div>
  )
}

export default UserCard