import Image from "next/image"

export default function MainLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Image
        src="/app-logo/whitelogo.png"
        alt="BeatZa"
        width={200}
        height={200}
        className="logo-dark"
      />
      <Image
        src="/app-logo/blacklogo.png"
        alt="BeatZa"
        width={200}
        height={200}
        className="logo-light"
      />
    </div>
  )
}