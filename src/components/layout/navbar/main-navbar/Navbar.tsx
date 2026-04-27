"use client"

import { useAppSelector } from "@/store/hooks"

import NavbarLeft from "./NavbarLeft"
import NavbarCenter from "./NavbarCenter"
import NavbarRight from "./NavbarRight"
import MobileNavbar from "./MobileNavbar"

interface NavbarProps {
  className?: string
}

export default function Navbar({ className }: NavbarProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const hasHydrated = useAppSelector((state) => state.auth.hasHydrated)

  if (!hasHydrated) {
    return (
      <div data-testid="Navbar" className={`flex justify-center w-full ${className}`}>
        <div className="flex items-center pt-1 w-full max-w-302 h-13" />
      </div>
    )
  }

  return (
    <div data-testid="Navbar" className={`flex justify-center w-full ${className}`}>

      {/* Desktop */}
      <div className="hidden md:flex items-center  w-full max-w-302">
        <div className="flex-none">
          <NavbarLeft isLoggedIn={isAuthenticated} />
        </div>
        <div className="flex-1">
          <NavbarCenter />
        </div>
        <div className="flex-none">
          <NavbarRight isLoggedIn={isAuthenticated} />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden w-full">
        <MobileNavbar isLoggedIn={isAuthenticated} />
      </div>

    </div>
  )
}