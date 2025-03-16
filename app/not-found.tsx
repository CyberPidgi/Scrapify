import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className='flex flex-col justify-center items-center p-4 min-h-screen'>
      <div className="text-center">
        <h1 className="mb-4 font-bold text-6xl text-primary">
          404
        </h1>
        <h2 className="mb-4 font-semibold text-2xl">
          Not Found
        </h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          Please make sure your URL is correct and try again.
        </p>
        <div className="flex sm:flex-row flex-col justify-center gap-4">
          <Link href={"/"} className='flex justify-center items-center bg-primary hover:bg-primary/80 px-4 py-2 rounded-md text-white'>
            <ArrowLeft
              className='mr-2 size-4'
            />
            Back to Dashboard
          </Link>
        </div>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground tet-sm">
            If you believe this is a mistake, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage