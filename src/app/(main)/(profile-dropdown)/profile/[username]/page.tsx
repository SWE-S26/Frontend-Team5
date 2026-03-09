import ProfileHeader from "@/components/profile/ProfileHeader";
import TabsNavBar from "@/components/profile/TabsNavBar";


interface Props {
  params: {
    username: string;
  };
}


const ProfilePage = ({ params }: Props) => {
  return (
    <div>
      <ProfileHeader />
      <TabsNavBar />

    </div>
  );
};

export default ProfilePage;