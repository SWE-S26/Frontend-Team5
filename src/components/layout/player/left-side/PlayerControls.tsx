"use client"
import { useState } from "react"

import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5"
import { BsRepeat, BsShuffle } from "react-icons/bs"
import { IoIosPlay } from "react-icons/io"
import { GiPauseButton } from "react-icons/gi"
import { PiRepeatOnceBold } from "react-icons/pi";
import { PiRepeatBold } from "react-icons/pi";
import { PiRepeatOnce } from "react-icons/pi";
import { RiShuffleFill } from "react-icons/ri";

type Props = {
  isPlaying: boolean
  togglePlay: () => void
}

export default function PlayerControls({ isPlaying, togglePlay }: Props){
const [shuffled, setShuffled] = useState(false)

const [repeatMode, setRepeatMode] = useState(0)

  const handleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3)
  }


    return(
        <div className="flex items-center shrink-0">
            <div className="flex gap-2 sm:gap-4 pr-5 mx-3">
                <button>
                <IoPlaySkipBackSharp className="hover:text-silver cursor-pointer" size={25}/>
                </button>

                <button
                onClick={togglePlay}
                className="relative group p-2 rounded-full bg-white transition flex items-center justify-center cursor-pointer hover:text-silver"
                >
                {isPlaying ?
                    <GiPauseButton className="w-4 h-4 text-black hover:text-silver ml-px" />
                    :
                    <IoIosPlay className="w-4 h-4 text-black hover:text-silver ml-px" />
                }
                </button>

                <button>
                <IoPlaySkipForwardSharp className="hover:text-silver cursor-pointer" size={25}/>
                </button>
            </div>


            <div className="flex sm:flex gap-4">
            <button onClick={() => setShuffled(!shuffled)} className="relative group cursor-pointer hover:text-silver font-bold " >
                {shuffled ? <RiShuffleFill size={15} className="text-anger "/> : <RiShuffleFill size={15} />}
            </button>

            <button onClick={handleRepeat} className="relative group cursor-pointer hover:text-silver ">
            {
                repeatMode === 1 ? <div className="relative inline-flex text-anger top-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="-1 -1 26 26"
                                        className="w-5 h-5 fill-none stroke-current stroke-2 -scale-y-100 -scale-x-100"
                                    >
                                        <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 4h-7a7 7 0 000 14h7a7 7 0 000-14z"
                                        />
                                        <polyline
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points="14,1 17,4 14,7"
                                        />
                                    </svg>
                                    <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-anger text-black text-[6px]  flex items-center justify-center leading-none pointer-events-none">
                                        1
                                    </span>
                                    </div> :
                repeatMode === 2 ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 26 26" className="w-5 h-5 text-anger fill-none stroke-current stroke-2 -scale-y-100 -scale-x-100">
                                    <path strokeLinecap="round" strokeLinejoin="round" 
                                        d="M17 4h-7a7 7 0 000 14h7a7 7 0 000-14z" />
                                    <polyline strokeLinecap="round" strokeLinejoin="round" points="14,1 17,4 14,7" />
                                    </svg> :
                
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 26 26" className="w-5 h-5 text-white hover:text-silver fill-none stroke-current stroke-2 -scale-y-100 -scale-x-100">
                                    <path strokeLinecap="round" strokeLinejoin="round" 
                                        d="M17 4h-7a7 7 0 000 14h7a7 7 0 000-14z" />
                                    <polyline strokeLinecap="round" strokeLinejoin="round" points="14,1 17,4 14,7" />
                                    </svg> 
            }

            </button>
            </div>


           

        


        </div>
    )



}