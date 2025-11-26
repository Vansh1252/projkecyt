'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getFormData, saveFormData } from '@/utils/sessionStorage'
import CurrentSetupSkeleton from '@/components/skeleton-loader/current-setup-skeleton'
import { axiosInstance } from '@/utils/axios'
import CurrentSetupRetun from './current-setup-retun'
import {
  getDefaultOption,
  createSetupTypePayload,
} from '@/utils/constants/current-setup-constants'
import type { Option } from '@/components/option-cards-grid'
import type { SetupOption } from '@/utils/type'

export default function CurrentSetupContent() {
  const [selectedOption, setSelectedOption] =
    useState<Option['id']>('owner-led')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const formData = getFormData()
    const setupType = (formData.setupType as Option['id']) ?? getDefaultOption()
    setSelectedOption(setupType)

    // Show loader for 1 second, then show content
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSelect = (optionId: Option['id']) => {
    setSelectedOption(optionId)
    saveFormData({
      setupType: optionId as SetupOption,
    })
  }

  const handleContinue = async () => {
    setIsSubmitting(true)

    try {
      const formData = getFormData()
      const userInputId = formData.userInputId

      if (!userInputId) {
        throw new Error(
          'User input ID not found. Please go back and complete the previous step.'
        )
      }

      // Prepare payload using helper function
      const payload = createSetupTypePayload(
        userInputId,
        selectedOption as SetupOption
      )

      // Update user input
      const response = await axiosInstance.put('/api/user_input', payload)

      if (!response.data.ok) {
        throw new Error(response.data.error || 'Failed to update user input')
      }

      // Show success toast
      toast.success('Setup type saved successfully!')

      // Navigate to next page after a short delay to show the toast
      setTimeout(() => {
        window.location.href = '/about_business'
      }, 500)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating setup type:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again.'
      toast.error(errorMessage)
      setIsSubmitting(false)
    }
  }

  // Show skeleton loader while loading
  if (isLoading) {
    return <CurrentSetupSkeleton />
  }

  return (
    <CurrentSetupRetun
      selectedOption={selectedOption}
      onSelect={handleSelect}
      onContinue={handleContinue}
      isSubmitting={isSubmitting}
    />
  )
}
