import { Metadata } from "next"
import ThemeSwitcher from "@/components/theme/ThemeSwitcher"

export const metadata: Metadata = {
  title: "Settings on BeatZa",
}

export default function Settings() {
  return (
    <div className="bg-chinese-black">
      <h1 className="text-white-smoke font-bold text-2xl mb-6">Settings</h1>
      <ThemeSwitcher />
    </div>
  )
}