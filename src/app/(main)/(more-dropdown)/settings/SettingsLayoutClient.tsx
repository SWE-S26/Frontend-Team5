"use client"
import { usePathname } from "next/navigation"
import TabsNavbar from "@/components/layout/navbar/TabsNavbar"

export default function SettingsLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="px-8 sm:px-0">
      <h1 className="text-white-smoke font-bold text-xl sm:text-2xl mb-4 sm:mb-6">Settings</h1>
      <TabsNavbar
        pathname={pathname}
        className="pb-4 text-sm sm:text-xl overflow-x-auto"
        tabs={[
          { href: "/settings",               label: "Account"       },
          { href: "/settings/content",       label: "Content"       },
          { href: "/settings/notifications", label: "Notifications" },
          { href: "/settings/privacy",       label: "Privacy"       },
        ]}
      />
      {children}
    </div>
  )
}