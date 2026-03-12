"use client"

import { useRef, useState, useEffect } from "react"
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import { BsRepeat } from "react-icons/bs";
import { IoIosPlay } from "react-icons/io";
import { GiPauseButton } from "react-icons/gi";
import { BsShuffle } from "react-icons/bs";
import { IoIosHeart } from "react-icons/io";
import { MdPersonAddAlt1 } from "react-icons/md";
import { IoReorderThree } from "react-icons/io5";
import { PiQueueBold } from "react-icons/pi";
import { FiVolume2 } from "react-icons/fi"; 

export default function PlayerBar() { 

  const audioRef = useRef<HTMLAudioElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState<number>(70); // always start with a number
  const [isHovering, setIsHovering] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    setCurrentTime(time)

    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const timeUpdate = () => setCurrentTime(audio.currentTime);
    const loadedMeta = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", timeUpdate);
    audio.addEventListener("loadedmetadata", loadedMeta);

    return () => {
      audio.removeEventListener("timeupdate", timeUpdate);
      audio.removeEventListener("loadedmetadata", loadedMeta);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-13 bg-[#3a3a3a] text-white px-35 py-4 flex items-center justify-center gap-6">

      <audio
        ref={audioRef}
        src="https://serv100.albumaty.com/dl/3en/amr-diab/albums/wayah/12.Baaet_Leh.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <div className="flex items-center gap-8">

        <div className="flex gap-4 px-5">
          <button>
            <IoPlaySkipBackSharp className="hover:text-silver" size={25}/>
          </button>

          <button onClick={togglePlay} className="relative group p-2 rounded-full bg-white transition flex items-center justify-center cursor-pointer hover:text-silver">
            {isPlaying ?
              <GiPauseButton className="w-4 h-4 text-black hover:text-silver ml-[1px]" />
              :
              <IoIosPlay className="w-4 h-4 text-black hover:text-silver ml-[1px]" />
            }
          </button>

          <button>
            <IoPlaySkipForwardSharp className="hover:text-silver" size={25}/>
          </button>
        </div>

        <button className="relative group cursor-pointer hover:text-silver ">
          <BsShuffle className="hover:text-silver " size={15}/>
          <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-[2px] bg-[#f3f3f3] text-black text-xs border border-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
            Shuffle
          </span>
        </button>

        <button className="relative group cursor-pointer hover:text-silver ">
          <BsRepeat className="hover:text-silver" size={15}/>
          <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-[2px] bg-[#f3f3f3] text-black text-xs border border-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
            Repeat
          </span>
        </button>

      </div>




      <div className="flex  items-center space-y-2 w-full p-4">
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs w-[40px] text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 accent-orange-500 rounded-lg cursor-pointer"
          />
          <span className="text-xs w-[40px] text-left">{formatTime(duration)}</span>
        </div>
      </div>





<div className="relative flex items-center group">
  
  {/* Popup */}
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-50
    opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto
    transition-opacity duration-200 pb-3">

    <div className="bg-[#1a1a1a] border border-white/10 rounded px-4 py-4 flex flex-col items-center shadow-2xl">
      <div className="relative h-28 w-4 flex items-center justify-center">
        <div className="absolute w-[4px] h-full bg-[#3a3a3a] rounded-full" />
        <div
          className="absolute bottom-0 w-[4px] bg-white rounded-full transition-all"
          style={{ height: `${volume}%` }}
        />
        <div
          className="absolute w-4 h-4 bg-black rounded-full border border-white shadow-md pointer-events-none transition-all"
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
      <div className="w-3 h-3 bg-[#1a1a1a] rotate-45 -mt-1.5" />
    </div>
  </div>

  {/* Icon */}
  <button className="cursor-pointer">
    <FiVolume2 className="hover:text-silver" size={18} />
  </button>

</div>

      <div className="flex items-center justify-between w-full px-4 py-2">
        <div className="flex items-center gap-5">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF7MG32vJAUlDYjqVgOEN8EQp1MFWX7_dqAw&s"
            alt="cover"
            className="w-10 h-10 object-cover"
          />
          <div className="flex flex-col mr-10">
            <span className="text-silver text-sm font-bold">Aseem</span>
            <span className="text-white text-sm">باه - تامر عاشور - Tamer Ashour</span>
          </div>
        </div>

        <div className="flex items-center gap-7 text-white text-lg">
          <button className="relative group cursor-pointer hover:text-silver ">
            <IoIosHeart className="hover:text-silver " size={18}/>
          </button>
          <button className="relative group cursor-pointer hover:text-silver ">
            <MdPersonAddAlt1 className="hover:text-silver " size={18}/>  
          </button>
          <button className="relative group cursor-pointer hover:text-silver ">
            <IoReorderThree size={18} />
            <span className="absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-[2px] bg-[#f3f3f3] text-black text-xs border border-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
              Next Up
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}