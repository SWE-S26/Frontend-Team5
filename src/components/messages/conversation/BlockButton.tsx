'use client'

const BlockButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button onClick={onClick} className='text-white-smoke bg-chinese-black w-17 h-10 border-0 font-bold px-2 py-2 text-[13px] hover:text-silver cursor-pointer'>Block</button>
    )
}

export default BlockButton