"use client"

import { useState } from "react"
type Props = {
  currentTime: number
  duration: number
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void
  formatTime: (time: number) => string
}



export default function PlayerProgress({
  currentTime,
  duration,
  handleSeek,
  formatTime
}: Props) {


  

   const progress = duration > 0 ? (currentTime / duration) * 100 : 0
   const [hovering, setHovering] = useState(false)
  return(
    <div className="flex items-center w-full gap-2">
      <div className="flex items-center space-x-2 sm:w-64 md:w-80 lg:w-150 ">


      


        <span className="text-xs w-10 text-right">
          {formatTime(currentTime || 0)}
        </span>

        
       <>
  <style>{`
    .progress-range {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      width: 100%;
      height: 3px;
      border-radius: 1px;
      outline: none;
      cursor: pointer;
      background: linear-gradient(to right, var(--inferno) var(--progress), var(--progress-track-color) var(--progress));
    }
    .progress-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--bg);
      border: 1px solid var(--inferno);
      opacity: 0;
      transition: opacity 0.2s;
      cursor: pointer;
    }
    .progress-range::-moz-range-thumb {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--bg);
      border: 1px solid var(--inferno);
      border: none;
      opacity: 0;
      transition: opacity 0.2s;
      cursor: pointer;
    }
    .progress-range:hover::-webkit-slider-thumb { opacity: 1; }
    .progress-range:hover::-moz-range-thumb { opacity: 1; }
  `}</style>

  <input
    type="range"
    min={0}
    max={duration || 100}
    step="0.1"
    value={currentTime || 0}
    onChange={handleSeek}
    className="progress-range"
    style={{ "--progress": `${progress}%` } as React.CSSProperties}
  />
</>
        
      

        <span className="text-xs w-10 text-left">
          {formatTime(duration || 0)}
        </span>

      </div>

        

    </div>

  )

}