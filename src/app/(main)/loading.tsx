import Image from "next/image"

export default function MainLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-50 h-50">
        <Image src="/app-logo/whitelogo.png" alt="BeatZa" fill sizes="200px" className="logo-dark object-contain" />
      </div>
      <div className="relative w-50 h-50">
        <Image src="/app-logo/blacklogo.png" alt="BeatZa" fill sizes="200px" className="logo-light object-contain" />
      </div>
    </div>
  )
}