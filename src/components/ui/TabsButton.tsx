import Link from "next/link"

interface NavLinkProps {
  href: string
  label: string
  pathname: string
  textSize?: string
  onClick?: () => void; 
  isActive?: boolean 
}

export default function NavLink({ href, label, pathname, textSize = "text-base", onClick, isActive }: NavLinkProps) {
  
  const active = isActive ?? pathname === href

  
  return (
    <Link href={href} 
    onClick={onClick}
    className={`px-2 py-2 font-bold border-b-2 hover:text-white-smoke transition-all duration-300 ${textSize} ${
        active
          ? "border-white-smoke text-white-smoke"
          : "border-chinese-black text-silver"
      }`}
    >
    {label}
    </Link>
  )
}