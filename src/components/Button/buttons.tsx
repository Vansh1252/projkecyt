'use client'

import { ArrowLeft, ArrowRight } from '@untitledui/icons'
import { Button } from '../base/buttons/button'
import Link from 'next/link'

interface ButtonsProps {
  backPath?: string
  continuePath?: string
  onContinueClick?: () => void
  isSubmitting?: boolean
}

export const Buttons: React.FC<ButtonsProps> = ({
  backPath = '/current-setup',
  continuePath,
  onContinueClick,
  isSubmitting = false,
}) => {
  return (
    <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-6 border-t border-gray-200'>
      {backPath ? (
        <Link
          href={backPath}
          className='w-full sm:w-auto'
          onClick={e => {
            if (isSubmitting) {
              e.preventDefault()
            }
          }}
        >
          <Button
            type='button'
            color='secondary'
            size='lg'
            iconLeading={ArrowLeft}
            isDisabled={isSubmitting}
            className='w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          >
            Back
          </Button>
        </Link>
      ) : (
        <Button
          type='button'
          color='secondary'
          size='lg'
          iconLeading={ArrowLeft}
          className='w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95'
          isDisabled
        >
          Back
        </Button>
      )}

      {onContinueClick ? (
        <Button
          type='button'
          color='primary'
          size='lg'
          iconTrailing={ArrowRight}
          onClick={onContinueClick}
          isDisabled={isSubmitting}
          className='w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      ) : continuePath ? (
        <Link href={continuePath} className='w-full sm:w-auto'>
          <Button
            type='button'
            color='primary'
            size='lg'
            iconTrailing={ArrowRight}
            className='w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95'
          >
            Continue
          </Button>
        </Link>
      ) : (
        <Button
          type='button'
          color='primary'
          size='lg'
          iconTrailing={ArrowRight}
          className='w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95'
          isDisabled
        >
          Continue
        </Button>
      )}
    </div>
  )
}
