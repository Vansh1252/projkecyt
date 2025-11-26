'use client'
import React from 'react'
import { Button } from '@/components/base/buttons/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clearFormData } from '@/utils/sessionStorage'

const Page = () => {
  const router = useRouter()
  const handleBackHome = () => {
    clearFormData()
    router.push('/')
  }
  return (
    <div className='w-full justify-center overflow-hidden py-14 lg:py-24 min-h-dvh flex items-center'>
      <div className='container-small'>
        <div className='text-center flex flex-col items-center max-w-[650px] mx-auto'>
          <h2 className='h3-title text-center font-semibold py-4 text-lg'>
            Page Not Found
          </h2>
          <p className=' text-center text-sm'>
            The page you are looking for does not exist. Please try again.
          </p>
          <Link href={'/'}>
            <Button className='mt-5 w-full' onClick={handleBackHome}>
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Page
