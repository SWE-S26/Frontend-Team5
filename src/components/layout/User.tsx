import React from 'react'
import { FaUser } from "react-icons/fa";
import { PiWaveformBold } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";
import FollowButton from '../ui/FollowButton';

const User = () => {
  return (
    <>
    <div className='flex flex-row gap-19 mb-3 hover:cursor-pointer'>
        <div className='flex flex-row gap-4'>
            <img src={"https://i.pravatar.cc/40"} alt="User Profile" className="rounded-full w-12 h-12 mt-2.5 " />
            <div className='flex flex-col gap-1.5'>
                <div className='flex flex-row gap-1.5 items-center pt-2 mt-1'>
                    <p className='text-sm font-bold hover:text-silver '>Bad-Bunny</p>
                    <FaCheckCircle className="w-4 h-4 text-blue-400 bg-white rounded-full border-0" />
                </div>
                <div className='flex flex-row gap-2.5  '>
                    <div className="flex items-center gap-0.5 group ">
                        <FaUser className="w-4 h-4 fill-current text-silver group-hover:text-off-black" />
                        <span className="text-sm text-silver group-hover:text-off-black">2.9M</span>
                    </div>
                    <div className="flex items-center gap-0.5 group ">
                        <PiWaveformBold className="w-5 h-5 fill-current text-silver group-hover:text-off-black " />
                        <span className="text-sm text-silver group-hover:text-off-black">168</span>
                    </div>
                </div>
            </div>
        </div>
        <FollowButton initialIsFollowing={true} />
    </div>
    </>
  )
}

export default User