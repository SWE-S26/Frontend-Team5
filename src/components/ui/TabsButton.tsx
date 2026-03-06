import Link from "next/link"

interface NavLinkProps {
  href: string
  label: string
  pathname: string
  textSize?: string
}

export default function NavLink({ href, label, pathname, textSize = "text-base" }: NavLinkProps) {
  return (
    <Link href={href} className={`px-2 py-2 font-bold border-b-2 border-chinese-black hover:text-white-smoke transition-all duration-300 ${textSize} ${pathname === href ? "border-b-2 border-white-smoke text-white-smoke" : "text-silver"}`}>
      {label}
    </Link>
  )
}