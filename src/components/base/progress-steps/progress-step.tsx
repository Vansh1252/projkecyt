'use client'

import React from 'react'

interface StepperProps {
  steps: string[]
  currentStep: number
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className='xl:w-[1216px] max-w-[1100px] mx-auto px-2 sm:px-4 md:px-6 mt-4 sm:mt-6 md:mt-8 lg:mt-10'>
      <div className='flex w-full items-start sm:items-center justify-between gap-0.5 sm:gap-2 md:gap-4 lg:gap-6'>
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep
          const isCompleted = index + 1 < currentStep

          return (
            <div
              key={index}
              className='flex-1 flex flex-col items-center relative min-w-0'
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-3 sm:top-4 left-1/2 h-[1.5px] sm:h-0.5
                    ${isCompleted ? 'bg-purple-500' : 'bg-gray-300'}
                  `}
                  style={{
                    zIndex: 0,
                    width: 'calc(110%)',
                    transform: 'translateX(0.25rem)',
                  }}
                ></div>
              )}

              {/* Step circle */}
              <div
                className={`relative z-10 flex items-center justify-center 
                  w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 
                  text-[10px] sm:text-xs md:text-sm
                  ${
                    isActive
                      ? 'border-purple-500 bg-white text-purple-600 font-semibold'
                      : isCompleted
                        ? 'bg-purple-500 border-purple-500 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                  }
                `}
              >
                {isCompleted ? (
                  <span className='text-white text-xs sm:text-sm md:text-base lg:text-lg'>
                    ✓
                  </span>
                ) : (
                  index + 1
                )}
              </div>

              {/* Step label */}
              <span
                className={`mt-1 sm:mt-1.5 md:mt-2 text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium text-center leading-tight px-0.5 sm:px-1 wrap-break-words
                  ${isActive ? 'text-purple-600 font-semibold' : 'text-gray-700'}
                `}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Stepper
