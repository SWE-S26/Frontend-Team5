import LatestComment from './LatestComment'

export default function ListLatestComments() {
  return (
    <>
        <div className='flex gap-41 justify-between mb-0.5 cursor-pointer'>
            <p className='font-bold text-sm text-white-smoke hover:text-silver'>Latest Comments</p>
            <p className='text-sm text-silver hover:underline '>View all</p>
        </div>
        <LatestComment />
        <LatestComment />
        <LatestComment />
    </>
  )
}