'use client'

import { HelpCircle } from '@untitledui/icons'
import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip'

export default function CurrentSetupHeader() {
  return (
    <div className='mb-6 sm:mb-8 md:mb-12 text-center mx-auto gap-4'>
      <h1 className='mb-2  xl:text-[36px] lg  font-semibold text-gray-900 px-2 sm:px-4'>
        How do you currently handle your finance operations?
      </h1>
      <div className='flex flex-col sm:flex-row items-center gap-2 justify-center mt-3 sm:mt-4 px-2'>
        <p className='text-xs sm:text-sm text-gray-500 text-center'>
          Select the option that best describes your setup
        </p>
        <div className='relative z-10 shrink-0'>
          <Tooltip
            title='This helps us calculate your current cost and compare it with Sanay.'
            placement='top'
            delay={200}
          >
            <TooltipTrigger
              className='group relative flex cursor-pointer flex-col items-center gap-2 text-fg-quaternary transition duration-100 ease-linear hover:text-fg-quaternary_hover focus:text-fg-quaternary_hover'
              style={{ isolation: 'isolate' }}
            >
              <HelpCircle className='size-4 sm:size-5' />
            </TooltipTrigger>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
