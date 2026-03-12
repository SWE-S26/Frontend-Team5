interface MessagePerviewProps {
  id: number
  isActive: boolean
  onClick: () => void
}

const MessagePerview = ({ id, isActive, onClick }: MessagePerviewProps) => {
  return (
    <>
      <div onClick={onClick} className={`flex flex-row gap-5 px-4 py-3 rounded-b-lg w-110 mt-0 cursor-pointer ${isActive ? 'bg-off-black' : 'hover:bg-off-black'}`}>
        <img src={"https://i.pravatar.cc/40"} alt="User Profile" className="rounded-full w-15 h-15 " />
        <div className='flex flex-col gap-2 w-82'>
          <div className='flex flex-row gap-37'>
            <p className='text-sm text-white font-bold'>Lujina Shawki</p>
            <p className='text-sm text-silver'>10 hours ago</p>
          </div>
          <p className='text-sm text-silver truncate '>https://on.soundcloud.com/FuhHb5otZh2mFklxw9</p>
        </div>
      </div>
    </>
  )
}

export default MessagePerview