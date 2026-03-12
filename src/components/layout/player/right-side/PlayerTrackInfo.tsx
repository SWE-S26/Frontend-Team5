export default function PlayerTrackInfo() {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF7MG32vJAUlDYjqVgOEN8EQp1MFWX7_dqAw&s"
        alt="cover"
        className="w-9 h-9 object-cover"
      />

      <div className="flex flex-col mr-5 min-w-[90px] max-w-[200px]">
      <span className="text-silver text-sm font-bold truncate whitespace-nowrap overflow-hidden">
        Aseem
      </span>
      <span className="text-white text-sm truncate whitespace-nowrap overflow-hidden">
        باه - تامر عاشور - Tamer Ashour
      </span>
    </div>
    </div>
  )
}