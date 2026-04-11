'use client'

import SharePopup from "@/components/profile/SharePopUp";
import EmptySocial from "@/components/social-graph/EmptySocial";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { LuShare } from "react-icons/lu";

const DUMMY_COUNT : number = 0 

const page = () => {
    const [open, setOpen] = useState(false)
     const isOwn        = useAppSelector((state) => state.profile.isOwnProfile)
    const displayName  = useAppSelector((state) => state.profile.displayName)
  return (
    <div>
      
        {DUMMY_COUNT === 0 
        ? <>
              
              <div className='flex justify-between'>
                      <p className='text-sm text-silver'>Hear the tracks you’ve liked</p>
                      <button onClick={() => setOpen(!open)} className="rounded-md bg-off-black text-sm flex items-center justify-center px-2 py-1 cursor-pointer hover:text-silver ">
                      <LuShare className="w-4 h-4 " />
                      <span className="ml-1 text-xs font-bold px-2 py-1">Share</span>
                      </button>
                          <SharePopup isOpen={open} onClose={() => setOpen(false)} />
            </div>
            <EmptySocial type="likes" isOwn={isOwn} displayName={displayName ?? ''} />
          </> 
          
        : <>
            <div className='flex justify-between'>
                <p className='text-sm text-silver'>Hear the tracks you’ve liked</p>
                <button onClick={() => setOpen(!open)} data-testid="likes-share-button"  className="rounded-md bg-off-black text-sm flex items-center justify-center px-2 py-1 cursor-pointer hover:text-silver ">
                <LuShare className="w-4 h-4 " />
                <span className="ml-1 text-xs font-bold px-2 py-1">Share</span>
                </button>
                    <SharePopup isOpen={open} onClose={() => setOpen(false)} />
            </div>
          </>
      } 
    </div>
  )
}

export default page