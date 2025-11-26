'use client'

import Stepper from '@/components/base/progress-steps/progress-step'
import ActionButtons from '@/components/resultpage/ActionButtons' // ← import this

interface ResultHeaderProps {
  steps: string[]
  onBack: () => void
  quoteId: string | null
}

export default function ResultHeader({
  steps,
  onBack,
  quoteId,
}: ResultHeaderProps) {
  return (
    <>
      {/* Stepper */}
      <div className='mb-6 sm:mb-8 md:mb-12'>
        <Stepper steps={steps} currentStep={5} />
      </div>

      {/* Title */}
      <div className='flex flex-col justify-center items-center mb-10'>
        <h1 className='font-semibold text-4xl sm:text-2xl md:text-3xl lg:text-4xl mb-3'>
          Here’s your personalised ROI report
        </h1>
        <p className='text-[#535862] text-xl sm:text-base md:text-lg'>
          Based on your business profile and current setup
        </p>
        <div className='w-full flex justify-end m-4'>
          <ActionButtons onBack={onBack} quoteId={quoteId} />
        </div>
      </div>
    </>
  )
}
