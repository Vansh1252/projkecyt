'use client'

export default function CurrentSetupSkeleton() {
  return (
    <div className='xl:w-[1216px] m-auto bg-white min-h-screen flex flex-col items-center px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10'>
      <div className='w-full'>
        <div className='flex flex-col gap-2'>
          {/* Stepper Skeleton */}
          <div className='mb-6 sm:mb-8 md:mb-12'>
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
          <div className='mb-6 sm:mb-8 md:mb-12 text-center mx-auto gap-4'>
            <div className='h-10 w-96 bg-gray-200 rounded-lg animate-pulse mb-3 mx-auto' />
            <div className='h-6 w-80 bg-gray-200 rounded-lg animate-pulse mx-auto' />
          </div>

          {/* Option Cards Skeleton */}
          <div className='p-2 sm:p-4 md:p-5'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-3'
                >
                  <div className='h-12 w-12 bg-gray-200 rounded-lg animate-pulse mx-auto' />
                  <div className='h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto' />
                  <div className='h-4 w-48 bg-gray-100 rounded animate-pulse mx-auto' />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className='px-2 sm:px-4 md:px-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-6 border-t border-gray-200'>
            <div className='h-12 w-24 bg-gray-200 rounded-lg animate-pulse' />
            <div className='h-12 w-32 bg-gray-200 rounded-lg animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  )
}
