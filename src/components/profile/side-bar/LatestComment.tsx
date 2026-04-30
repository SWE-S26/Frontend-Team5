'use client'
import React, { useState } from 'react'
import { FaRegTrashCan } from "react-icons/fa6";

export default function LatestComment() {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <>
            <div className='flex justify-between items-center' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <div className='flex flex-col gap-2 mt-4 '>
                    <p className='text-sm'>
                        <span className='text-silver'>on</span>{' '}
                        <span className='font-bold hover:text-silver cursor-pointer'>Fakaroni</span>
                    </p>
                    <p className='text-sm text-white'>"ohhh"</p>
                </div>

                <div className='flex items-center justify-center h-8'>
                    {!isHovered ? (
                        <p className='text-sm text-silver whitespace-nowrap'>11 minutes ago</p>
                    ) : (
                        <div className='relative group/delete flex items-center justify-center'>
                            <button className='flex items-center justify-center bg-off-black rounded-md h-8 w-10 transition-colors'>
                                <FaRegTrashCan size={14} className='text-white hover:text-silver cursor-pointer' />
                            </button>
                            <div className='absolute bottom-[-2.2rem] left-1/2 -translate-x-1/2 bg-off-black text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/delete:opacity-100 transition-opacity pointer-events-none'>
                                Delete this comment
                                <div className='absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-off-black rotate-45' />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}