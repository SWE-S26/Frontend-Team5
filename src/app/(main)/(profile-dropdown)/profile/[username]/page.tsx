

import ProfileHeader from "@/components/profile/ProfileHeader";

import PlayerBar2 from "@/components/layout/player/PlayerBar2";

interface Props {
  params: {
    username: string;
  };
}

const ProfilePage = ({ params }: Props) => {
  return (
    <div>
      <ProfileHeader />
      
    </div>
  )
}