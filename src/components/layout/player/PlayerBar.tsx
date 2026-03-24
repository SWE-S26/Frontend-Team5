"use client"

import { useRef, useState , useEffect} from "react"

import PlayerControls from "./left-side/PlayerControls"
import PlayerProgress from "./left-side/PlayerProgress"
import PlayerVolume from "./left-side/PlayerVolume"
import PlayerTrackInfo from "./right-side/PlayerTrackInfo"
import PlayerNextUp from "./right-side/PlayerNextUp"

export default function PlayerBar() {

  const audioRef = useRef<HTMLAudioElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()

    setIsPlaying(!isPlaying)
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
  const audio = audioRef.current
  if (!audio) return

  audio.load()

  const handleLoaded = () => setDuration(audio.duration || 0)
  audio.addEventListener("loadedmetadata", handleLoaded)
  audio.addEventListener("canplay", handleLoaded)

  return () => {
    audio.removeEventListener("loadedmetadata", handleLoaded)
    audio.removeEventListener("canplay", handleLoaded)
  }
}, [])


const handleVolume = (v: number) => {
  setVolume(v)
  if (audioRef.current) {
    audioRef.current.volume = v / 100
  }
}

  return (

    <div className="hidden md:flex justify-center fixed bottom-0 w-full h-11.75 bg-[var(--off-black)] z-1000">
 
      <div className="flex items-center w-full max-w-302 justify-between">
        <audio
        ref={audioRef}
        src="https://serv100.albumaty.com/dl/3en/amr-diab/albums/wayah/12.Baaet_Leh.mp3"
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onCanPlay={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => { setIsPlaying(false); setCurrentTime(0) }}
        />

        {/* Left-Side */}
        <div className="flex w-[68%]">
          <div className="pr-5">
          <PlayerControls
            isPlaying={isPlaying}
            togglePlay={togglePlay}
          />
          </div>

          <div className="flex">
          <PlayerProgress
            currentTime={currentTime}
            duration={duration}
            handleSeek={handleSeek}
            formatTime={formatTime}
          />
          <PlayerVolume
            volume={volume}
            setVolume={handleVolume}
          />
          </div>
        </div>
        
        {/* Right-Side */}
        <div className="flex pr-5 py-2 w-[27.75%]">
          <PlayerTrackInfo />
          <PlayerNextUp />
        </div>

      </div>

    </div>

  
  )
}
