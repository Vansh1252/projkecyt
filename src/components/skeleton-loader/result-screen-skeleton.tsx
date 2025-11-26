'use client'

export default function ResultScreenSkeleton() {
  return (
    <div className='xl:w-[1216px] m-auto bg-white min-h-screen flex flex-col items-center px-4 pb-10 sm:px-6 md:px-10'>
      {/* Stepper Skeleton */}
      <div className='mb-6 sm:mb-8 md:mb-12 w-full'>
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
      <div className='flex flex-col justify-center items-center mb-10 w-full'>
        <div className='h-10 w-96 bg-gray-200 rounded-lg animate-pulse mb-3' />
        <div className='h-6 w-80 bg-gray-200 rounded-lg animate-pulse' />
      </div>

      {/* 4 Boxes Skeleton */}
      <div className='xl:w-[1216px] flex flex-wrap xl:flex-nowrap gap-6 mb-5 place-items-center w-full'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='w-full xl:w-1/4 rounded-2xl border border-gray-200 bg-white shadow-sm p-5'
          >
            <div className='h-6 w-32 bg-gray-200 rounded animate-pulse mb-4' />
            <div className='h-px w-full bg-gray-200 mb-4' />
            <div className='h-12 w-40 bg-gray-200 rounded animate-pulse' />
          </div>
        ))}
      </div>

      {/* Review Link Skeleton */}
      <div className='mb-12'>
        <div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
      </div>

      {/* Cost Comparison and Efficiency Score Skeleton */}
      <div className='xl:w-[1216px] mb-14 grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
        {/* Cost Comparison Skeleton */}
        <div className='w-full border border-[#E4E7EC] rounded-2xl p-8 shadow-sm'>
          <div className='h-8 w-48 bg-gray-200 rounded animate-pulse mb-6' />
          <div className='w-full h-[260px] bg-gray-100 rounded-xl animate-pulse' />
        </div>

        {/* Efficiency Score Skeleton */}
        <div className='w-full border border-[#E4E7EC] rounded-2xl p-8 shadow-sm'>
          <div className='h-8 w-40 bg-gray-200 rounded animate-pulse mb-2' />
          <div className='flex flex-col md:flex-row items-center gap-8 mt-4'>
            <div className='w-[180px] h-[180px] bg-gray-200 rounded-full animate-pulse' />
            <div className='h-20 w-40 bg-gray-200 rounded animate-pulse' />
          </div>
        </div>
      </div>

      {/* Insights Section Skeleton */}
      <div className='xl:w-[1216px] flex flex-col md:flex-row flex-wrap gap-4 mb-16 w-full'>
        <div className='flex flex-col md:flex-row gap-4 w-full'>
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className='w-full md:w-1/2 border border-[#E4E7EC] rounded-2xl p-5 shadow-sm'
            >
              <div className='h-6 w-24 bg-gray-200 rounded animate-pulse mb-2' />
              <div className='h-16 bg-gray-100 rounded animate-pulse' />
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className='xl:w-[1216px] flex flex-wrap gap-4 justify-center w-full'>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className='h-12 w-40 bg-gray-200 rounded-lg animate-pulse'
          />
        ))}
      </div>
    </div>
  )
}
