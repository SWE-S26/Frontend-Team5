import { Metadata } from "next";
import SettingsLayoutClient from "./SettingsLayoutClient";

export const metadata: Metadata = { title: "Settings on BeatZa" };

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <SettingsLayoutClient>{children}</SettingsLayoutClient>;
}
