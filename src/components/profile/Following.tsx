import React from 'react'
import UserList from "@/components/layout/UserList";

const Following = () => {
  return (
    <>
        <div className='flex flex-row gap-55 mb-5'>
            <p className='font-bold text-md text-white-smoke hover:text-silver'>10 Following</p>
            <p className='text-sm text-silver hover:underline '>View all</p>
        </div>
        <UserList />
    </>
  )
}

export default Following