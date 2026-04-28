import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Discover the top streamed music and songs online on BeatZa",
};

export default function Home() {
  return <HomeClient />;
}
