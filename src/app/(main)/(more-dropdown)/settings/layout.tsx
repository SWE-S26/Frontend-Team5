"use client"
import { usePathname } from "next/navigation"
import TabsNavbar from "@/components/layout/navbar/TabsNavbar"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div>
      <h1 className="text-white-smoke font-bold text-2xl mb-6">Settings</h1>
      <TabsNavbar pathname={pathname} className="pb-4 text-xl"
        tabs={[
          { href: "/settings",               label: "Account"  },
          { href: "/settings/content",       label: "Content"     },
          { href: "/settings/notifications", label: "Notifications" },
          { href: "/settings/privacy",       label: "Privacy"    },
          { href: "/settings/advertising",   label: "Advertising"  },
        ]}
      />

      {children}
      
    </div>
  )
}