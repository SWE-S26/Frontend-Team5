import Image from "next/image"

interface ProfileImageProps {
  src: string | null
  className?: string
  width: number
  height: number
  alt?: string
}

export default function ProfileImage({ src, className, width, height, alt = "Profile" }: ProfileImageProps) {
  if (!src || src.startsWith("linear-gradient")) {
    return (
      <div
        style={{ background: src || "linear-gradient(to right, #c3adb4, #8f6f79)" }}
        className={className}
      />
    )
  }
  return <Image src={src} alt={alt} width={width} height={height} className={className} />
}