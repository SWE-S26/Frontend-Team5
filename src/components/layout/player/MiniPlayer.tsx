"use client"

import { useRef, useState, useEffect } from "react"
import { IoIosPlay } from "react-icons/io"
import { GiPauseButton } from "react-icons/gi"
import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from "react-icons/io5"

export default function MiniPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)

  const [isPlaying,    setIsPlaying]    = useState(false)
  const [currentTime, setCurrentTime]  = useState(0)
  const [duration,    setDuration]     = useState(0)

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleLoaded = () => setDuration(audio.duration || 0)
    audio.addEventListener("loadedmetadata", handleLoaded)
    audio.addEventListener("canplay", handleLoaded)
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded)
      audio.removeEventListener("canplay", handleLoaded)
    }
  }, [])

  return (
    <div className="w-full bg-off-black rounded-lg p-3 mb-4">
      <audio
        ref={audioRef}
        src="https://serv100.albumaty.com/dl/3en/amr-diab/albums/wayah/12.Baaet_Leh.mp3"
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => { setIsPlaying(false); setCurrentTime(0) }}
      />

      {/* Track info */}
      <div className="flex items-center gap-2 mb-3">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF7MG32vJAUlDYjqVgOEN8EQp1MFWX7_dqAw&s"
          alt="cover"
          className="w-10 h-10 object-cover rounded"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="text-silver text-xs font-bold truncate">Aseem</span>
          <span className="text-white-smoke text-xs truncate">باه - تامر عاشور</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-silver text-[10px]">{formatTime(currentTime)}</span>
        <div className="flex-1 h-1 bg-off-black rounded-full overflow-hidden">
          <div className="h-full bg-anger rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-silver text-[10px]">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button className="text-silver hover:text-white-smoke cursor-pointer">
          <IoPlaySkipBackSharp size={20} />
        </button>
        <button
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-white-smoke transition-all"
        >
          {isPlaying
            ? <GiPauseButton className="w-4 h-4 text-black" />
            : <IoIosPlay className="w-4 h-4 text-black ml-0.5" />
          }
        </button>
        <button className="text-silver hover:text-white-smoke cursor-pointer">
          <IoPlaySkipForwardSharp size={20} />
        </button>
      </div>
    </div>
  )
}