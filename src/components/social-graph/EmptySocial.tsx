    type EmptyStateProps = {
    type: 'likes' | 'following' | 'followers'
    }

    const messages = {
    likes: 'You have no likes yet.',
    following: "You aren't following anyone yet.",
    followers: 'No one is following you yet.',
    }

    const EmptySocial = ({ type }: EmptyStateProps) => {
    return (
        <div className="flex justify-center items-center h-64">
        <p className="text-white font-bold text-2xl">{messages[type]}</p>
        </div>
    )
    }

    export default EmptySocial