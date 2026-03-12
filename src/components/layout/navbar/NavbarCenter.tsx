"use client"
import { CiSearch } from "react-icons/ci";

interface NavbarCenterProps {
  isLoggedIn: boolean
}

export default function NavbarCenter({ isLoggedIn }: NavbarCenterProps) {
  return (
    <div className="relative w-full">
      <input type="text" placeholder="Search for artists, bands, tracks, podcasts" className="bg-off-black text-white-smoke placeholder-silver rounded-sm pl-5 pr-9 py-[9.7px] text-sm w-full outline-none ring-1 ring-transparent focus:ring-silver transition-all duration-300"/>
      <CiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-silver text-xl"/>
    </div>
  )
}