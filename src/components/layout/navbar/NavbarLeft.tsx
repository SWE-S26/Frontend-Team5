"use client"
import { usePathname } from "next/navigation"
import TabsNavbar from "./TabsNavbar";

interface NavbarLeftProps {
  isLoggedIn: boolean
}

export default function NavbarLeft({ isLoggedIn }: NavbarLeftProps) {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2 text-sm mr-5">

      <div className="flex items-center">
        <a href="/home"><img src="/beatza.png" className="w-13 mr-3 mt-1" /></a>
        {isLoggedIn ? (
          // logged in
          <>
          </>
        ) : (
          // not logged in
          <>
            <h1 className="text-white-smoke font-bold text-2xl mr-2">BEATZA</h1>
          </>
        )}
      </div>
      
      <TabsNavbar pathname={pathname}
        tabs={[
          { href: "/home",    label: "Home"    },
          { href: "/feed",    label: "Feed"    },
          { href: "/library", label: "Library", basePath: "/library" },
        ]}
      />
      
    </div>
  )
}