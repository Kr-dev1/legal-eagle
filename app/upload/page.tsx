import UploadFlow from '@/components/uploadflow/uploadflow'
import { Suspense } from 'react'

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex w-full p-6 md:p-10">
                <UploadFlow />
            </div>
        </Suspense>
    )
}

export default page