'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from '@untitledui/icons'

interface QuoteLoaderProps {
  quoteId?: string | null
}

interface Step {
  id: string
  label: string
  completed: boolean
}

export default function QuoteLoader({ quoteId: _quoteId }: QuoteLoaderProps) {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: '1',
      label: 'Validating your business information',
      completed: false,
    },
    { id: '2', label: 'Calculating current setup costs', completed: false },
    { id: '3', label: 'Generating Sanay pricing', completed: false },
    { id: '4', label: 'Analyzing efficiency opportunities', completed: false },
    {
      id: '5',
      label: 'Generating AI insights and recommendations',
      completed: false,
    },
  ])

  useEffect(() => {
    // Simulate progress through steps
    const progressInterval = setInterval(() => {
      setSteps(prevSteps => {
        const allCompleted = prevSteps.every(step => step.completed)
        if (allCompleted) {
          clearInterval(progressInterval)
          return prevSteps
        }

        // Find first incomplete step and mark it as completed
        const firstIncompleteIndex = prevSteps.findIndex(
          step => !step.completed
        )
        if (firstIncompleteIndex !== -1) {
          const newSteps = [...prevSteps]
          newSteps[firstIncompleteIndex] = {
            ...newSteps[firstIncompleteIndex],
            completed: true,
          }
          return newSteps
        }
        return prevSteps
      })
    }, 1500) // Update every 1.5 seconds

    return () => clearInterval(progressInterval)
  }, [])

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-white'>
      <div className='w-full max-w-md mx-4'>
        <div className='bg-white rounded-2xl shadow-lg p-8'>
          {/* Loading Spinner */}
          <div className='flex justify-center mb-6'>
            <div className='relative w-16 h-16'>
              <svg
                className='animate-spin'
                viewBox='0 0 64 64'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                {/* Background circle */}
                <circle
                  cx='32'
                  cy='32'
                  r='28'
                  stroke='#E5E7EB'
                  strokeWidth='4'
                  fill='none'
                />
                {/* Animated arc */}
                <circle
                  cx='32'
                  cy='32'
                  r='28'
                  stroke='#7839EE'
                  strokeWidth='4'
                  fill='none'
                  strokeDasharray='88'
                  strokeDashoffset='22'
                  strokeLinecap='round'
                  className='animate-spin'
                  style={{
                    transformOrigin: 'center',
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 className='text-2xl font-bold text-[#7839EE] text-center mb-3'>
            Generating Your Quote
          </h2>

          {/* Description */}
          <p className='text-gray-600 text-center mb-8 text-sm'>
            We're analyzing your business profile and calculating your
            personalized ROI report...
          </p>

          {/* Steps List */}
          <div className='space-y-4'>
            {steps.map(step => (
              <div
                key={step.id}
                className='flex items-center gap-3'
                style={{
                  opacity: step.completed ? 1 : 0.6,
                  transition: 'opacity 0.3s ease',
                }}
              >
                {step.completed ? (
                  <CheckCircle className='w-5 h-5 text-green-500 shrink-0' />
                ) : (
                  <div className='w-5 h-5 shrink-0 flex items-center justify-center'>
                    <div className='w-5 h-5 rounded-full border-2 border-gray-300' />
                  </div>
                )}
                <span
                  className={`text-sm ${
                    step.completed ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
