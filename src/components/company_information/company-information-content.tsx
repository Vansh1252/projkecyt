'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import Stepper from '@/components/base/progress-steps/progress-step'
import {
  getFormData,
  saveFormData,
  clearFormData,
} from '@/utils/sessionStorage'
import FormSection from './company-return/from_section/form-section'
import CardSection from './company-return/card_section/card_section'
import CompanyInformationHeader from './company-return/header_section/header'
import { FORM_STEPS } from '@/utils/constants/constants'
import { axiosInstance } from '@/utils/axios'
import {
  validationSchema,
  getInitialValues,
  getInitialValuesFromStorage,
  isFormValid as checkFormValid,
  createUserInputPayload,
} from '@/utils/constants/company-information-constants'
import type { CompanyInformationFormValues } from '@/utils/type'

export default function CompanyInformationContent() {
  const [isClient, setIsClient] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Always start with empty values to match server render
  const initialValues = useMemo(() => getInitialValues(), [])

  const formik = useFormik<CompanyInformationFormValues>({
    initialValues,
    enableReinitialize: true, // Enable reinitialize to load from localStorage after hydration
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async values => {
      setIsSubmitting(true)
      setSubmitError(null)

      try {
        const formData = getFormData()
        const userInputId = formData.userInputId

        // Prepare payload
        const payload = createUserInputPayload(values)

        let result: { ok: boolean; data?: { id: number }; error?: string }

        if (!userInputId) {
          // Create new user input
          const response = await axiosInstance.post('/api/user_input', payload)
          result = response.data

          if (!result.ok || !result.data) {
            throw new Error(result.error || 'Failed to create user input')
          }

          // Store the ID in sessionStorage
          saveFormData({
            ...values,
            userInputId: result.data.id,
          })
        } else {
          // Update existing user input
          const response = await axiosInstance.put('/api/user_input', {
            id: userInputId,
            ...payload,
          })
          result = response.data

          if (!result.ok) {
            throw new Error(result.error || 'Failed to update user input')
          }

          // Update sessionStorage with form values
          saveFormData(values)
        }

        // Navigate to next page
        window.location.href = '/current-setup'
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error submitting form:', error)
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'An error occurred. Please try again.'
        )
        setIsSubmitting(false)
      }
    },
  })

  // Hydrate from localStorage after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)

    // Load data from localStorage and update form
    const data = getFormData()
    const storedValues = getInitialValuesFromStorage(data)
    formik.setValues(storedValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handler for clearing session when Back button is clicked
  const handleBackClick = () => {
    // Clear all session data
    clearFormData()

    // Also clear any quote-related sessionStorage items
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('pendingQuoteId')
      sessionStorage.removeItem('isGeneratingQuote')
    }

    // Reset form to initial empty values
    formik.setValues(getInitialValues())
  }

  const formValid = checkFormValid(formik.values)

  // Save to localStorage whenever form values change (debounced for smoothness)
  useEffect(() => {
    if (!isClient) return

    const timeoutId = setTimeout(() => {
      saveFormData(formik.values)
    }, 300)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.fullName,
    formik.values.companyName,
    formik.values.businessEmail,
    formik.values.agreeToTerms,
    isClient,
  ])

  return (
    <div className='xl:w-[1216px] m-auto  bg-white min-h-screen flex flex-col items-center px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10'>
      {/* progress-steps */}
      <div className='w-full  mb-4 sm:mb-8 md:mb-12'>
        <Stepper steps={FORM_STEPS} currentStep={1} />
      </div>

      {/* header section */}
      <CompanyInformationHeader />

      {/* main section  */}
      <div className='w-full flex flex-col lg:flex-row justify-center items-center lg:items-start gap-12 md:flex-wrap bg-[#FAFAFA]'>
        {/* form section */}
        <FormSection
          formik={formik}
          isFormValid={formValid}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onBackClick={handleBackClick}
        />
        {/* card section */}
        <CardSection />
      </div>
    </div>
  )
}
