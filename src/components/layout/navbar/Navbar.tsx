"use client"
import NavbarLeft from "./NavbarLeft"
import NavbarCenter from "./NavbarCenter"
import NavbarRight from "./NavbarRight"

interface NavbarProps {
  className?: string
  isLoggedIn: boolean
}


export default function Navbar({ className, isLoggedIn }: NavbarProps) {
  return (
    <div  data-testid="Navbar" className={`flex justify-center w-full ${className}`}>
      <div className="flex items-center pt-1 w-full max-w-302">
        <div className="flex-none">
          <NavbarLeft isLoggedIn={isLoggedIn}/>
        </div>
        <div className="flex-1">
          <NavbarCenter/>
        </div>
        <div className="flex-none">
          <NavbarRight isLoggedIn={isLoggedIn}/>
        </div>
      </div>
    </div>
  )
}