"use client"

import { useState } from "react"

interface ProfileImageProps {
  src: string | null
  className?: string
  width: number
  height: number
  alt?: string
}

export default function ProfileImage({ src, className, width, height, alt = "Profile" }: ProfileImageProps) {
  const [errored, setErrored] = useState(false)

  if (!src || src.startsWith("linear-gradient") || errored) {
    return (
      <div
        style={{
          background: "linear-gradient(to right, #c3adb4, #8f6f79)",
          width: width,
          height: height,
          minWidth: width,
          minHeight: height,
        }}
        className={className}
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setErrored(true)}
    />
  )
}