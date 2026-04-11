import Image from "next/image"
import Link from "next/link"
import { Ban } from "lucide-react"
import Button from "@/components/ui/Button"

interface BlockedUserRowProps {
  userId: string
  displayName: string
  profileImgLink: string
  onUnblock: () => void
}

export default function BlockedUserRow({
  userId,
  displayName,
  profileImgLink,
  onUnblock,
}: BlockedUserRowProps) {
  return (
    <div className="flex items-center justify-between py-3 w-4/6">
      <div className="flex items-center gap-3">
        <Link href={`/profile/${userId}`} className="shrink-0">
          <Image
            src={profileImgLink}
            alt={displayName}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </Link>

        <Link
          href={`/profile/${userId}`}
          className="text-sm font-bold text-white-smoke hover:underline"
        >
          {displayName}
        </Link>
      </div>

      <Button
        onClick={onUnblock}
        icon={<Ban size={14} />}
        className="border border-inferno text-inferno hover:opacity-80"
      >
        Blocked
      </Button>
    </div>
  )
}