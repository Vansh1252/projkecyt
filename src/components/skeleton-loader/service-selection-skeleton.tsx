'use client'

export default function ServiceSelectionSkeleton() {
  return (
    <div className='xl:w-[1216px] m-auto  bg-white min-h-screen flex flex-col items-center px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10'>
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-12'>
        {/* Stepper Skeleton */}
        <div className='mb-10 sm:mb-12'>
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

        <div className='space-y-8'>
          {/* Main Heading Skeleton */}
          <div className='flex flex-col justify-center items-center mb-8 text-center sm:text-left'>
            <div className='h-10 w-96 bg-gray-200 rounded-lg animate-pulse mb-3' />
            <div className='h-6 w-80 bg-gray-200 rounded-lg animate-pulse' />
          </div>

          {/* Intelligent Bookkeeping Section Skeleton */}
          <div className='space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8'>
            <div className='h-7 w-64 bg-gray-200 rounded animate-pulse' />
            <div className='grid gap-4 sm:gap-6 md:grid-cols-2'>
              {[...Array(2)].map((_, i) => (
                <div key={i} className='space-y-2'>
                  <div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
                  <div className='h-10 w-full bg-gray-100 rounded-lg animate-pulse' />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Services Section Skeleton */}
          <div className='space-y-4'>
            <div className='h-6 w-48 bg-gray-200 rounded animate-pulse' />
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 space-y-3'
                >
                  <div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
                  <div className='h-4 w-full bg-gray-100 rounded animate-pulse' />
                  <div className='h-4 w-3/4 bg-gray-100 rounded animate-pulse' />
                  <div className='h-8 w-24 bg-gray-200 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </div>

          {/* Info Text Skeleton */}
          <div className='text-center'>
            <div className='h-5 w-96 bg-gray-200 rounded animate-pulse mx-auto' />
          </div>

          {/* AI Suggestion Section Skeleton */}
          <div className='rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-5'>
            <div className='h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-3' />
            <div className='h-4 w-full bg-gray-100 rounded animate-pulse mb-2' />
            <div className='h-4 w-3/4 bg-gray-100 rounded animate-pulse mx-auto' />
          </div>

          {/* Bottom Summary Bar Skeleton */}
          <div className='rounded-xl border border-yellow-200 bg-yellow-50 p-4 sm:p-5'>
            <div className='h-5 w-64 bg-gray-200 rounded animate-pulse mx-auto' />
          </div>

          {/* Navigation Buttons Skeleton */}
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-6 border-t border-gray-200'>
            <div className='h-12 w-24 bg-gray-200 rounded-lg animate-pulse' />
            <div className='h-12 w-40 bg-gray-200 rounded-lg animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  )
}
