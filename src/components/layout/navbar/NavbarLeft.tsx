"use client"
import { usePathname } from "next/navigation"
import TabsButton from "@/components/ui/TabsButton";

interface NavbarLeftProps {
  isLoggedIn: boolean
}

export default function NavbarLeft({ isLoggedIn }: NavbarLeftProps) {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-2 text-sm">

      <div className="flex items-center">
        <img src="/beatza.png" className="w-13 mr-5 mt-1" />
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
      
      <TabsButton href="/home"    label="Home"    pathname={pathname} textSize="text-md"/>
      <TabsButton href="/feed"    label="Feed"    pathname={pathname} textSize="text-md"/>
      <TabsButton href="/library" label="Library" pathname={pathname} textSize="text-md"/>
      
      
    </div>
  )
}