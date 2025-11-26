'use client'

import { HelpCircle } from '@untitledui/icons'
import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip'
import { Checkbox } from '@/components/base/checkbox/checkbox'
import type { Option } from '@/utils/type'

export type { Option }

interface OptionCardsGridProps {
  options: Option[]
  selectedOption?: string
  selectedOptions?: string[]
  onSelect: (optionId: string) => void
  useCheckbox?: boolean
  className?: string
  cardClassName?: string
}

export default function OptionCardsGrid({
  options,
  selectedOption,
  selectedOptions,
  onSelect,
  useCheckbox = false,
  className = '',
  cardClassName = '',
}: OptionCardsGridProps) {
  const getIsSelected = (optionId: string) => {
    if (useCheckbox && selectedOptions) {
      return selectedOptions.includes(optionId)
    }
    return selectedOption === optionId
  }
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 ${className}`}
    >
      {options.map((option, index) => {
        const Icon = option.icon
        const isSelected = getIsSelected(option.id)
        const cardClasses = `relative flex flex-col gap-4 rounded-2xl border-2 p-5 transition-all duration-300 sm:flex-row sm:items-start sm:gap-5 ${
          isSelected
            ? 'border-brand-solid shadow-lg'
            : 'border-gray-200 bg-white'
        } ${cardClassName} ${
          !useCheckbox
            ? 'cursor-pointer animate-in fade-in slide-in-from-bottom-2 focus:outline-none focus:ring-2 focus:ring-brand-solid'
            : ''
        }`

        const cardContent = (
          <>
            {useCheckbox && (
              <div className='sm:mt-1' onClick={e => e.stopPropagation()}>
                <Checkbox
                  isSelected={isSelected}
                  onChange={() => onSelect(option.id)}
                />
              </div>
            )}
            <div className='flex '>
              <span
                className={`p-3 rounded-lg transition-all duration-300 ${
                  isSelected ? 'bg-brand-solid shadow-sm' : 'bg-brand-100'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isSelected ? 'text-white' : 'text-brand-solid'
                  }`}
                />
              </span>
            </div>
            <div className='flex-1 text-left'>
              <h3
                className={`text-lg font-semibold mb-1 transition-colors duration-300 ${
                  isSelected ? 'text-gray-900' : 'text-gray-900'
                }`}
              >
                {option.title}
              </h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  isSelected ? 'text-gray-600' : 'text-gray-500'
                }`}
              >
                {option.description}
              </p>
            </div>
            <div className=' relative z-10'>
              {option.tooltip ? (
                <Tooltip
                  title={option.tooltip}
                  description={option.tooltipDescription}
                  placement='top'
                  delay={200}
                >
                  <TooltipTrigger
                    className={`group relative flex cursor-pointer flex-col items-center gap-2 transition duration-100 ease-linear focus:text-fg-quaternary_hover ${
                      isSelected ? 'text-brand-solid' : 'text-fg-quaternary'
                    }`}
                    onClick={e => e.stopPropagation()}
                    style={{ isolation: 'isolate' }}
                  >
                    <HelpCircle className='size-4' />
                  </TooltipTrigger>
                </Tooltip>
              ) : (
                <HelpCircle
                  className={`w-4 h-4 transition-colors duration-300 ${
                    isSelected ? 'text-brand-solid' : 'text-gray-400'
                  }`}
                />
              )}
            </div>
          </>
        )

        if (useCheckbox) {
          return (
            <div
              key={option.id}
              onClick={() => onSelect(option.id)}
              role='button'
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(option.id)
                }
              }}
              className={`${cardClasses} cursor-pointer`}
              style={{
                animationDelay: `${index * 100}ms`,
                animationDuration: '400ms',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {cardContent}
            </div>
          )
        }

        return (
          <div
            key={option.id}
            onClick={() => onSelect(option.id)}
            role='button'
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(option.id)
              }
            }}
            className={cardClasses}
            style={{
              animationDelay: `${index * 100}ms`,
              animationDuration: '400ms',
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            {cardContent}
          </div>
        )
      })}
    </div>
  )
}
