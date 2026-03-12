import React from 'react'
import UserList from "@/components/layout/UserList";

const Following = () => {
  return (
    <div className='mb-8'>
        <div className='flex flex-row gap-52 mb-2 mt-5 cursor-pointer'>
            <p className='font-bold text-sm text-white-smoke hover:text-silver'>10 Following</p>
            <p className='text-sm text-silver hover:underline '>View all</p>
        </div>
        <UserList />
    </div>
  )
}

export default Following