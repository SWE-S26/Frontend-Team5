

import ProfileHeader from "@/components/profile/ProfileHeader";

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
  );
};

export default ProfilePage;