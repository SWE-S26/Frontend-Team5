import TabsButton from "@/components/ui/TabsButton"

interface Tab {
  href: string
  label: string
  basePath?: string
}

interface TabsNavbarProps {
  tabs: Tab[]
  pathname: string
  textSize?: string
  className?: string
}

export default function TabsNavbar({ tabs, pathname, textSize = "text-md", className }: TabsNavbarProps) {
  return (
    <div className={`flex items-center gap-2 border-b border-chinese-black ${className}`}>
      {tabs.map((tab) => (
        <TabsButton
          key={tab.href}
          href={tab.href}
          label={tab.label}
          pathname={pathname}
          textSize={textSize}
          basePath={tab.basePath}
        />
      ))}
    </div>
  )
}