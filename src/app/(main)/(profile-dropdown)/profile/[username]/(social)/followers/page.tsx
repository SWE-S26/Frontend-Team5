
import EmptySocial from "@/components/social-graph/EmptySocial"
import UserCardGrid from "@/components/social-graph/UserCardGrid"

const DUMMY_COUNT : number = 1 

const page = () => {
  return (
    <div>
        {DUMMY_COUNT === 0 
        ? <EmptySocial type="followers" /> 
        : <UserCardGrid />
      }
        
    </div>
  )
}

export default page