// src/components/ui/ProfileImage.tsx
import Image from "next/image"
import { DEFAULT_PROFILE_IMAGE_URL, DEFAULT_PROFILE_GRADIENT } from "@/store/slices/authSlice"

interface ProfileImageProps {
  src: string | null
  className?: string
  width: number
  height: number
  alt?: string
}

export default function ProfileImage({ src, className, width, height, alt = "Profile" }: ProfileImageProps) {
  const resolvedSrc = src === DEFAULT_PROFILE_IMAGE_URL ? DEFAULT_PROFILE_GRADIENT : src

  if (!resolvedSrc || resolvedSrc.startsWith("linear-gradient")) {
    return (
      <div
        style={{ background: resolvedSrc || DEFAULT_PROFILE_GRADIENT }}
        className={className}
      />
    )
  }
  return <Image src={resolvedSrc} alt={alt} width={width} height={height} className={className} />
}