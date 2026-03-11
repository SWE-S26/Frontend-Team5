import Link from "next/link"

interface TabsButtonProps {
  href: string
  label: string
  pathname: string
  textSize?: string
  basePath?: string
}

export default function TabsButton({ href, label, pathname, textSize = "text-base", basePath  }: TabsButtonProps) {
  const isActive = basePath ? pathname.startsWith(basePath) : pathname === href
  return (
    <Link href={href} className={`px-2 py-2 font-bold border-b-2 border-chinese-black hover:text-white-smoke transition-all duration-300 ${textSize} ${isActive ? "border-b-2 border-white-smoke text-white-smoke" : "text-silver"}`}>
      {label}
    </Link>
  )
}