'use client'

export default function CompanyInformationHeader() {
  return (
    <div className='w-full flex flex-col items-center justify-center mb-6 sm:mb-8 md:mb-12'>
      <h1 className='text-6xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-center px-4'>
        Provide Your Company Information
      </h1>
      <p className='xl:text-xl sm:text-sm text-gray-500 text-center mt-3 sm:mt-4 px-4'>
        Enter a few basic business details so we can personalise your ROI
        calculation.
      </p>
    </div>
  )
}
