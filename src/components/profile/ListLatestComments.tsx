import LatestComment from './LatestComment'

const ListLatestComments = () => {
  return (
    <>
        <div className='flex flex-row gap-43 mb-0.5 cursor-pointer'>
            <p className='font-bold text-sm text-white-smoke hover:text-silver'>Latest Comments</p>
            <p className='text-sm text-silver hover:underline '>View all</p>
        </div>
        <LatestComment />
        <LatestComment />
        <LatestComment />
    </>
  )
}

export default ListLatestComments