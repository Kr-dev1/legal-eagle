import UpdatePassword from '@/components/auth/newpass'
import ForgotPasswordPage from '@/components/auth/reset-pass'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <UpdatePassword />
        </Suspense>
      </div>
    </div>
  )
}

export default page