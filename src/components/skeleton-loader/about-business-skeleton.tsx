'use client'

export default function AboutBusinessSkeleton() {
  return (
    <div className='xl:w-[1216px] m-auto  bg-white min-h-screen flex flex-col items-center px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10'>
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12'>
        {/* Stepper Skeleton */}
        <div className='mb-6 sm:mb-8 md:mb-10 lg:mb-12'>
          <div className='flex items-center justify-center gap-2'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center'>
                <div className='w-8 h-8 rounded-full bg-gray-200 animate-pulse' />
                {i < 4 && (
                  <div className='w-12 h-1 bg-gray-200 animate-pulse mx-2' />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Title Skeleton */}
        <div className='mb-6 sm:mb-8 md:mb-10 text-center px-2'>
          <div className='h-10 w-96 bg-gray-200 rounded-lg animate-pulse mb-3 mx-auto' />
          <div className='h-6 w-80 bg-gray-200 rounded-lg animate-pulse mx-auto' />
        </div>

        {/* Form Fields Skeleton */}
        <div className='space-y-6 sm:space-y-8 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 md:p-8 shadow-sm'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
                <div className='h-10 w-full bg-gray-100 rounded-lg animate-pulse' />
              </div>
            ))}
          </div>

          <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className='space-y-3 sm:space-y-4 rounded-xl border border-gray-100 p-3 sm:p-4 md:p-5'
              >
                <div className='h-5 w-48 bg-gray-200 rounded animate-pulse' />
                <div className='h-2 w-full bg-gray-100 rounded-lg animate-pulse' />
                <div className='h-10 w-full bg-gray-100 rounded-lg animate-pulse' />
              </div>
            ))}
          </div>
        </div>

        {/* Calculated Info Skeleton */}
        <div className='mt-6 sm:mt-8'>
          <div className='h-8 w-48 bg-gray-200 rounded animate-pulse mb-6 mx-auto' />
          <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
              {[...Array(2)].map((_, i) => (
                <div key={i} className='space-y-2'>
                  <div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
                  <div className='h-10 w-full bg-gray-100 rounded-lg animate-pulse' />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className='pt-4 sm:pt-6 sm:px-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4'>
          <div className='h-12 w-24 bg-gray-200 rounded-lg animate-pulse' />
          <div className='h-12 w-32 bg-gray-200 rounded-lg animate-pulse' />
        </div>
      </div>
    </div>
  )
}
