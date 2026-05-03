import ProfilePageContent from "@/components/profile/ProfilePageContent";

interface Props {
  params: { username: string };
}

export default function ProfilePage({ params }: Props) {
  return <ProfilePageContent params={params} />;
}
