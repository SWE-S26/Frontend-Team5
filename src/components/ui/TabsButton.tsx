import Link from "next/link"

interface TabsButtonProps {
  href: string
  label: string
  pathname: string
  textSize?: string
  basePath?: string
  onClick?: () => void
  isActiveb?: boolean
}

export default function TabsButton({
  href,
  label,
  pathname,
  textSize = "text-base",
  basePath,
  onClick,
  isActiveb
}: TabsButtonProps) {

  const isActive = basePath ? pathname.startsWith(basePath) : pathname === href
  const active = isActiveb ?? isActive

  return (
    <Link
      onClick={onClick}
      href={href}
      className={`px-2 pt-2 pb-2.5 font-bold border-b-2 border-chinese-black hover:text-white-smoke transition-all duration-300 ${textSize} ${
        active ? "border-white-smoke text-white-smoke" : "text-silver"
      }`}
    >
      {label}
    </Link>
  )
}