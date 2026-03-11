// default page of settings goes to account tab
import { Metadata } from "next"
import ThemeSwitcher from "@/components/theme/ThemeSwitcher"

export const metadata: Metadata = {
  title: "Settings on BeatZa",
}

export default function Settings() {
  return (
    <div className="bg-chinese-black">
      <ThemeSwitcher />
    </div>
  )
}