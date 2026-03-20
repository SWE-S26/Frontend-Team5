"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import TabsNavbar from "./TabsNavbar";

interface NavbarLeftProps {
  isLoggedIn: boolean;
}

const TABS = [
  { href: "/home",    label: "Home"    },
  { href: "/feed",    label: "Feed"    },
  { href: "/library", label: "Library", basePath: "/library" },
];

export default function NavbarLeft({ isLoggedIn }: NavbarLeftProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 text-sm mr-5">

      <div className="flex items-center">
        <Link data-testid="navbar_logo" href={isLoggedIn ? "/home" : "/"}>
          <Image src="/beatza.png" alt="BeatZa" width={52} height={52} className="mr-3 mt-1" />
        </Link>
        {!isLoggedIn && (
          <h1 className="text-white-smoke font-bold text-2xl mr-2">BEATZA</h1>
        )}
      </div>

      <TabsNavbar pathname={pathname} tabs={TABS} />

    </div>
  );
}