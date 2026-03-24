import { FiVolume2 } from "react-icons/fi"

type Props = {
  volume: number
  setVolume: (v: number) => void
}

export default function PlayerVolume({ volume, setVolume }: Props) {

  return (
      <div className="relative flex items-center group flex-shrink-0 mr-2">

        <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 pb-3">

            <div className="bg-volume1 border border-white-smoke/10 rounded px-4 py-4 flex flex-col items-center shadow-2xl">
            
                <div className="relative h-28 w-4 flex items-center justify-center">
             
                    <div className="absolute w-[4px] h-full bg-off-black rounded-full" />

                    <div
                    className="absolute bottom-0 w-[4px] bg-white-smoke rounded-full transition-all"
                    style={{ height: `${volume}%` }}
                    />

                    <div
                    className="absolute w-4 h-4 bg-chinese-black rounded-full border border-white-smoke shadow-md pointer-events-none transition-all"
                    style={{ bottom: `calc(${volume}% - 7px)` }}
                    />

                    <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="absolute h-full w-8 opacity-0 cursor-pointer"
                    style={{ writingMode: "vertical-lr", direction: "rtl" }}
                    />

                </div>


            </div>

            <div className="flex justify-center">
            <div className="w-3 h-3 bg-volume1 rotate-45 -mt-1.5" />
            </div>

        </div>

        <button className="cursor-pointer">
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-current hover:text-silver"
        >
          
          <path d="M3 9v6h4l5 5V4L7 9H3z" />
          <path d="M18.5 12c0-1.9-1-3.6-2.5-4.6v9.2c1.5-1 2.5-2.7 2.5-4.6z" />
          <path d="M21.5 12c0-3.84-2.08-7.19-5.19-9l-1.2 1.08C17.77 5.37 20 8.5 20 12s-2.23 6.63-4.89 7.92l1.2 1.08C19.42 19.19 21.5 15.84 21.5 12z" />
        </svg>
        </button>

    </div>
  )

}