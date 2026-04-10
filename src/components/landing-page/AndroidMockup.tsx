import Image from "next/image"

interface AndroidMockupProps {
  className?: string
  screenImage?: string
}

export default function AndroidMockup({ className = "", screenImage }: AndroidMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer shell */}
      <div className="relative w-50 h-116 rounded-[40px] border-[3px] border-[#FF5500] bg-white shadow-md">

        {/* Right side volume buttons */}
        <div className="absolute -right-1.25 top-20 w-1 h-5.5 rounded-r-sm bg-[#FF5500]" />
        <div className="absolute -right-1.25 top-27.5 w-1 h-5.5 rounded-r-sm bg-[#FF5500]" />

        {/* Top bar */}
        {/* Speaker bar */}
        <div className="absolute top-4 left-20 -translate-x-[70%] w-10 h-1.25 rounded-full bg-[#FF5500]/25" />
        {/* Camera dot */}
        <div className="absolute top-3.75 left-25 translate-x-[40%] w-1.75 h-1.75 rounded-full border-[1.5px] border-[#FF5500]" />

        {/* Screen with thick dark inner border */}
        <div className="absolute inset-2 top-10.5 bottom-10.5 border border-black rounded-xs overflow-hidden bg-white">
          {screenImage && (
            <Image src={screenImage} alt="Android screen" fill className="object-contain" />
          )}
        </div>
      </div>
    </div>
  )
}