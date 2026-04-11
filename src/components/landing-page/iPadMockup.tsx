import Image from "next/image"

interface TabletMockupProps {
  className?: string
  screenImage?: string
}

export default function TabletMockup({ className = "", screenImage }: TabletMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer shell */}
      <div className="relative w-100 h-113.75 rounded-xl border-[3px] border-[#FF5500] bg-white shadow-md">

        {/* Camera dot — orange */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-[#FF5500]" />

        {/* Screen with thin dark inner border */}
        <div className="absolute inset-2.5 top-7.5 bottom-2.5 border border-[#1a1a1a]/70 rounded-xs overflow-hidden bg-white">
          {screenImage && (
            <Image src={screenImage} alt="Tablet screen" fill className="object-contain" />
          )}
        </div>
      </div>
    </div>
  )
}