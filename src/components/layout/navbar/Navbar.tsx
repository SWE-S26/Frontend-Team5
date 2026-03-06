"use client"
import NavbarLeft from "./NavbarLeft"
import NavbarCenter from "./NavbarCenter"
import NavbarRight from "./NavbarRight"

interface NavbarProps {
  className?: string
  isLoggedIn: boolean
}

// Navbar.tsx
export default function Navbar({ className, isLoggedIn }: NavbarProps) {
  return (
    <div className={`flex justify-center w-full ${className}`}>
      <div className="flex pt-1.5 w-full max-w-6/7">
        <NavbarLeft isLoggedIn={isLoggedIn}/>
        <NavbarCenter isLoggedIn={isLoggedIn}/>
        <NavbarRight isLoggedIn={isLoggedIn}/>
      </div>
    </div>
  )
}