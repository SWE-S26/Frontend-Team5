"use client"

import { useState } from "react"

import ProfileHeader from "@/components/profile/ProfileHeader";
import TabsNavBar from "@/components/profile/TabsNavBar";
import EmptyTab from "@/components/profile/EmptyTab";
import Album from "@/components/profile/Album";


interface Props {
  params: {
    username: string;
  };
}


const ProfilePage = ({ params }: Props) => {
  const [activeTab, setActiveTab] = useState("all")
  const all: any[] = [] // mock data
  const popular: any[] = [] // mock data
  const tracks: any[] = [] // mock data
  // const albums: any[] = [] // mock data
  const playlists: any[] = [] // mock data
  const reposts: any[] = [] // mock data

  const albums = [
  {
    album_id: "1",
    artist: {
      username: "aseem",
      display_name: "Aseem"
    },
    release_date: "2024-01-01",
    tracks: [],
    num_of_likes: 20,
    num_of_reposts: 5,
    type: "album"
  }
]

  return (
    <div>
      <ProfileHeader />
      <TabsNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-10">
        {activeTab === "all" &&
          (all.length === 0 ? <EmptyTab /> : <Album />)}
      </div>

      <div className="mt-10">
        {activeTab === "popular tracks" &&
          (popular.length === 0 ? <EmptyTab /> : <Album />)}
      </div>

      <div className="mt-10">
        {activeTab === "tracks" &&
          (tracks.length === 0 ? <EmptyTab /> : <Album />)}
      </div>

      <div className="mt-10">
        {activeTab === "albums" &&
          (albums.length === 0 ? <EmptyTab /> : <Album />)}
      </div>

      <div className="mt-10">
        {activeTab === "playlists" &&
          (playlists.length === 0 ? <h2 className="font-bold text-lg flex  items-center justify-center text-center">You haven’t created any playlists.</h2> : <Album />)}
      </div>

      <div className="mt-10">
        {activeTab === "reposts" &&
          (reposts.length === 0 ? <h2 className="font-bold text-lg flex items-center justify-center text-center">You haven’t reposted any sounds.</h2> : <Album />)}
      </div>

    </div>
  );
};

export default ProfilePage;
