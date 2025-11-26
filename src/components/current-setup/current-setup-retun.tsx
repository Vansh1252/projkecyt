'use client'

import Stepper from '@/components/base/progress-steps/progress-step'
import OptionCardsGrid, { type Option } from '@/components/option-cards-grid'
import { Buttons } from '@/components/Button/buttons'
import { FORM_STEPS, SETUP_OPTIONS } from '@/utils/constants/constants'
import CurrentSetupHeader from './current-setup-header'

interface CurrentSetupRetunProps {
  selectedOption: Option['id']
  onSelect: (optionId: Option['id']) => void
  onContinue: () => void
  isSubmitting: boolean
}

export default function CurrentSetupRetun({
  selectedOption,
  onSelect,
  onContinue,
  isSubmitting,
}: CurrentSetupRetunProps) {
  return (
    <div className='xl:w-[1216px] m-auto bg-white min-h-screen flex flex-col items-center px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10'>
      <div className='w-full'>
        <div className='flex flex-col gap-2'>
          <div className='mb-6 sm:mb-8 md:mb-12'>
            <Stepper steps={FORM_STEPS} currentStep={2} />
          </div>

          {/* Main Question */}
          <CurrentSetupHeader />

          {/* Option Cards Grid */}
          <div className='p-2 sm:p-4 md:p-5'>
            <OptionCardsGrid
              options={SETUP_OPTIONS}
              selectedOption={selectedOption}
              onSelect={onSelect}
            />
          </div>

          {/* Navigation Buttons */}
          <div className='px-2 sm:px-4 md:px-0'>
            <Buttons
              backPath='/company-information'
              onContinueClick={onContinue}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
