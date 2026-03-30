
interface TabletMockupProps {
  className?: string;
}

export default function TabletMockup({ className = "" }: TabletMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer shell */}
      <div className="relative w-50 h-65 rounded-xl border-[3px] border-[#FF5500] bg-white shadow-md">
        {/* Camera dot — orange */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-[#FF5500]" />
        {/* Screen with thin dark inner border */}
        <div className="absolute inset-2.5 top-7.5 bottom-2.5 border border-[#1a1a1a]/70 rounded-xs bg-white" />
      </div>
    </div>
  );
}