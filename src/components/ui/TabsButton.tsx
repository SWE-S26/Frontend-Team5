import Link from "next/link";

interface TabsButtonProps {
  href: string;
  label: string;
  pathname: string;
  textSize?: string;
  basePath?: string;
  onClick?: () => void;
  isActiveb?: boolean;
}

export default function TabsButton({
  href,
  label,
  pathname,
  textSize = "text-base",
  basePath,
  onClick,
  isActiveb,
}: TabsButtonProps) {
  const isActive = basePath ? pathname.startsWith(basePath) : pathname === href;
  const active = isActiveb ?? isActive;

  const className = `px-2 pt-2 pb-2.5 font-bold border-b-2 border-chinese-black hover:text-white-smoke transition-all duration-300 ${textSize} ${
    active ? "border-white-smoke text-white-smoke" : "text-silver"
  }`;

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
