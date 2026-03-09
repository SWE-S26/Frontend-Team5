import Link from 'next/link'

export default function ProfileStats() {
  return (
    <div>
        <div className="flex flex-row gap-10">
            <div className="flex flex-col gap-3 group cursor-pointer">
                <p className="text-sm text-silver font-bold">Followers</p>
                <Link href="/followers" className='text-2xl text-white font-bold group-hover:text-silver'>2</Link>
                <p className="text-xs bg-white text-black opacity-0 border-b-black  hover:opacity-100 px-1 py-1"> 2 followers </p>
            </div>
            <div className="flex flex-col gap-3 group cursor-pointer">
                <p className="text-sm text-silver font-bold">Following</p>
                <Link href="/following" className="text-2xl text-white font-bold group-hover:text-silver">10</Link>
                <p className='text-xs bg-white text-black opacity-0 border-b-black  hover:opacity-100 px-1 py-1'> 10 following </p>
            </div>
            <div className="flex flex-col gap-3 group cursor-pointer">
                <p className="text-sm text-silver font-bold">Tracks</p>
                <Link href="/tracks" className="text-2xl text-white font-bold group-hover:text-silver">0</Link>
                <p className="text-xs bg-white text-black opacity-0 border-b-black  hover:opacity-100 px-1 py-1"> 0 tracks </p>
            </div>
        </div>
    </div>
  )
}