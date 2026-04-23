import { Suspense } from 'react'
import SuccessPage from './SuccessContent'

export default function Page() {
    return (
        <Suspense fallback={<div className="w-full min-h-screen bg-white" />}>
            <SuccessPage />
        </Suspense>
    )
}