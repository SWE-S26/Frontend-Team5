"use client"

const NewMessageButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button onClick={onClick} className='text-black bg-white w-17 h-10 rounded-md font-bold px-2 py-2 hover:text-silver cursor-pointer'>New</button>
  )
}

export default NewMessageButton