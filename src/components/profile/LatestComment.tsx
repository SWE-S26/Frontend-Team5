'use client'
import React, { useState } from 'react'
import { FaRegTrashCan } from "react-icons/fa6";



const LatestComment = () => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <>
        

            <div 
            className='flex flex-row gap-58 items-center'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >
                <div className='flex flex-col gap-3 mt-7'>
                        <p className='text-sm'>
                        <span className='text-silver'>on</span>{' '}
                        <span className='font-bold hover:text-silver cursor-pointer'>Fakaroni</span>
                        </p>
                        <p className='text-sm text-white'>"ohhh"</p>
                        
                </div>
                {!isHovered ? (
                        <p className='text-sm text-silver mt-0'>11 minutes ago</p>
                        ) : (
                        <div className='relative group flex items-center justify-center mt-4'>
                                <button className='flex items-center justify-center bg-off-black : rounded-md h-8 w-10 transition-colors'>
                                    <FaRegTrashCan size={14} className='text-white hover:text-silver' />
                                </button>
                                <div className='absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 bg-off-black text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                                    Delete this comment
                                    <div className='absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-off-black rotate-45' />
                                </div>
                        </div>
                        )}
                
            </div>
        </>
    )
}

export default LatestComment