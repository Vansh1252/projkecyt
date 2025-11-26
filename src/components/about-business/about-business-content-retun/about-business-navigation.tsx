'use client'

import { Buttons } from '@/components/Button/buttons'

interface AboutBusinessNavigationProps {
  handleContinue: () => void
  isSubmitting: boolean
}

export default function AboutBusinessNavigation({
  handleContinue,
  isSubmitting,
}: AboutBusinessNavigationProps) {
  return (
    <div className='pt-4 sm:pt-6 sm:px-4'>
      <Buttons
        backPath='/current-setup'
        onContinueClick={handleContinue}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
