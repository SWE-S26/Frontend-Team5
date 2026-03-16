"use client";
import { usePathname } from "next/navigation";
import TabsButton from "@/components/ui/TabsButton";

interface Tab {
  href: string;
  label: string;
  basePath?: string;
  value?: string;
}

interface TabsNavbarProps {
  tabs: Tab[];
  pathname?: string;
  textSize?: string;
  className?: string;

  activeTab?: string;
  onTabChange?: (tab: string) => void;

  tabsWrapperClassName?: string;
}

export default function TabsNavbar({
  tabs,
  pathname,
  textSize = "text-md",
  className = "",
  activeTab,
  onTabChange,
  tabsWrapperClassName = "flex items-center gap-2",
}: TabsNavbarProps) {
  const currentPathname = usePathname();
  const resolvedPathname = pathname ?? currentPathname;

  const isControlled = activeTab !== undefined && onTabChange !== undefined;

  return (
    <div className={className || "flex items-center gap-2 border-b border-chinese-black"}>
      <div className={tabsWrapperClassName}>
        {tabs.map((tab) => {
          const tabValue = tab.value ?? tab.label;

          return (
            <TabsButton
              key={`${tab.href}-${tab.label}`}
              href={tab.href}
              label={tab.label}
              pathname={resolvedPathname}
              textSize={textSize}
              basePath={tab.basePath}
              onClick={isControlled ? () => onTabChange(tabValue) : undefined}
              isActiveb={isControlled ? activeTab === tabValue : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}