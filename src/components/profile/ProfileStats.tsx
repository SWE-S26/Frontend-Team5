import Link from 'next/link'

export default function ProfileStats() {
  return (
        <div className='mb-8 -ml-5'>
        <div className="flex flex-row gap-17">
            <div className="flex flex-col gap-3 group/followers cursor-pointer">
            <p className="text-sm text-silver font-bold">Followers</p>
            <div className="relative">
                <Link href="/followers" className='text-2xl text-white font-bold group-hover/followers:text-silver peer'>2</Link>
                <p className="absolute top-6 left-3 ml-1 text-xs bg-white text-black opacity-0 px-1 py-1 peer-hover:opacity-100 delay-[50ms] peer-hover:delay-[1000ms] peer-not-hover:delay-[0ms] whitespace-nowrap">2 followers</p>
            </div>
            </div>

            <div className="flex flex-col gap-3 group/following cursor-pointer">
            <p className="text-sm text-silver font-bold">Following</p>
            <div className="relative">
                <Link href="/following" className="text-2xl text-white font-bold group-hover/following:text-silver peer">10</Link>
                <p className="absolute top-6 left-3 ml-1 text-xs bg-white text-black opacity-0 px-1 py-1 peer-hover:opacity-100 delay-[50ms] peer-hover:delay-[1000ms] peer-not-hover:delay-[0ms] whitespace-nowrap">following 10 people</p>
            </div>
            </div>

            <div className="flex flex-col gap-3 group/tracks cursor-pointer">
            <p className="text-sm text-silver font-bold">Tracks</p>
            <div className="relative">
                <Link href="/tracks" className="text-2xl text-white font-bold group-hover/tracks:text-silver peer">0</Link>
                <p className="absolute top-6 left-3 ml-1 text-xs bg-white text-black opacity-0 px-1 py-1 peer-hover:opacity-100 delay-[50ms] peer-hover:delay-[1000ms] peer-not-hover:delay-[0ms] whitespace-nowrap">0 tracks</p>
            </div>
            </div>
        </div>
        </div>
  )
}