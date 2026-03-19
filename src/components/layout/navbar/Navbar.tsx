"use client"
import NavbarLeft from "./NavbarLeft"
import NavbarCenter from "./NavbarCenter"
import NavbarRight from "./NavbarRight"
import { useAuthStore } from "@/store/authStore"

interface NavbarProps {
  className?: string
}


export default function Navbar({ className }: NavbarProps) {
  const { isAuthenticated } = useAuthStore()

  return (
    <div  data-testid="Navbar" className={`flex justify-center w-full ${className}`}>
      <div className="flex items-center pt-1 w-full max-w-302">
        <div className="flex-none">
          <NavbarLeft isLoggedIn={isAuthenticated}/>
        </div>
        <div className="flex-1">
          <NavbarCenter/>
        </div>
        <div className="flex-none">
          <NavbarRight isLoggedIn={isAuthenticated}/>
        </div>
      </div>
    </div>
  )
}