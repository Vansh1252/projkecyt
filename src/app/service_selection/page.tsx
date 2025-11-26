'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { Button } from '@/components/base/buttons/button'
import { ArrowLeft, ArrowRight } from '@untitledui/icons'
import Link from 'next/link'
import Stepper from '@/components/base/progress-steps/progress-step'
import {
  getFormData,
  saveFormData,
  type FormData,
} from '@/utils/sessionStorage'
import AdditionalServices from '@/components/service_selection/additional_services/additional_services'
import { Select } from '@/components/base/select/select'
import QuoteLoader from '@/components/quote-loader/quote-loader'
import ServiceSelectionSkeleton from '@/components/skeleton-loader/service-selection-skeleton'
import { axiosInstance } from '@/utils/axios'
import type { ServiceSelectionFormValues as FormValues } from '@/utils/type'
import {
  FORM_STEPS,
  SERVICES,
  REPORTING_FREQUENCY_SELECT_ITEMS,
  TRANSACTION_VOLUME_SELECT_ITEMS,
} from '@/utils/constants/constants'

const validationSchema = Yup.object({
  reportingFrequency: Yup.string().required('Reporting frequency is required'),
  transactionVolume: Yup.string().required('Transaction volume is required'),
  selectedServices: Yup.array()
    .of(Yup.string())
    .min(0, 'Select at least one service'),
})

// Helper function to map numeric transaction volume to band
const mapTransactionVolumeToBand = (
  volume: number | string | undefined
): string => {
  if (!volume) return '1-100/month'

  const numVolume = typeof volume === 'string' ? Number(volume) : volume

  if (isNaN(numVolume) || numVolume <= 0) return '1-100/month'
  if (numVolume <= 100) return '1-100/month'
  if (numVolume <= 200) return '101-200/month'
  if (numVolume <= 300) return '201-300/month'
  if (numVolume <= 400) return '301-400/month'
  if (numVolume <= 500) return '401-500/month'
  if (numVolume <= 650) return '501-650/month'
  if (numVolume <= 800) return '651-800/month'
  if (numVolume <= 1000) return '801-1000/month'
  if (numVolume <= 1250) return '1001-1250/month'
  if (numVolume <= 1500) return '1251-1500/month'
  if (numVolume <= 1750) return '1501-1750/month'
  if (numVolume <= 2000) return '1751-2000/month'
  return '2000+/month'
}

// Helper function to get initial values from localStorage
const getInitialValuesFromStorage = (data: FormData): FormValues => {
  // Calculate transaction volume band from monthly transaction volume
  const transactionVolume = data.monthlyTransactionVolume
    ? mapTransactionVolumeToBand(data.monthlyTransactionVolume)
    : data.transactionVolume || '1-100/month'

  // Set default reporting frequency based on transaction volume
  // If transaction volume is '1-100/month', default to 'Quarterly'
  // Otherwise, default to 'Monthly'
  const defaultReportingFrequency =
    transactionVolume === '1-100/month' ? 'Quarterly' : 'Monthly'

  return {
    reportingFrequency: data.reportingFrequency || defaultReportingFrequency,
    transactionVolume,
    selectedServices: data.selectedServices || [],
  }
}

export default function ServiceSelection() {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<{
    summary: string
    suggested_services: string[]
    reasoning: string
  } | null>(null)
  const [loadingSuggestion, setLoadingSuggestion] = useState(false)
  const [hasManuallySetFrequency, setHasManuallySetFrequency] = useState(false)

  // Always start with default values to match server render
  const initialValues: FormValues = useMemo(() => {
    return {
      reportingFrequency: 'Quarterly',
      transactionVolume: '',
      selectedServices: [],
    }
  }, [])

  const formik = useFormik<FormValues>({
    initialValues,
    enableReinitialize: true, // Enable reinitialize to load from localStorage after hydration
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        setSubmitting(true)

        // Save form data first
        saveFormData(values)

        // Get all form data from sessionStorage
        const allFormData = getFormData()
        const userInputId = allFormData.userInputId

        if (!userInputId) {
          throw new Error(
            'User input ID not found. Please go back and complete the previous steps.'
          )
        }

        // Create quote using the existing user_input_id
        // The report API will update the user_input with all fields from the payload
        // Prepare API payload for quote creation
        const quotePayload = {
          userInputId: userInputId, // Pass the existing user_input_id
          fullName: allFormData.fullName || '',
          companyName: allFormData.companyName || '',
          businessEmail: allFormData.businessEmail || '',
          setupType: allFormData.setupType || 'owner-led',
          numberOfStaff: Number(allFormData.numberOfStaff) || 0,
          industry: allFormData.industry || null,
          annualTurnover: allFormData.annualTurnover || '',
          hoursSpent: allFormData.hoursSpent
            ? Number(allFormData.hoursSpent)
            : null,
          monthlyTransactionVolume:
            Number(allFormData.monthlyTransactionVolume) || 0,
          hourlyValue: Number(allFormData.hourlyValue) || 0,
          estimatedHoursSpent: allFormData.estimatedHoursSpent
            ? Number(allFormData.estimatedHoursSpent)
            : null,
          internalCost: allFormData.internalCost
            ? Number(allFormData.internalCost)
            : null,
          currentExternalCost: allFormData.currentExternalCost
            ? Number(allFormData.currentExternalCost)
            : null,
          reportingFrequency: values.reportingFrequency,
          transactionVolume: values.transactionVolume,
          selectedServices: values.selectedServices || [],
        }

        // Call quote creation API
        const quoteResponse = await axiosInstance.post(
          '/api/report',
          quotePayload
        )

        if (!quoteResponse.data.ok) {
          throw new Error(
            quoteResponse.data.error || 'Failed to generate quote'
          )
        }

        // Show success toast
        toast.success(
          'Quote generated successfully! Redirecting to your report...'
        )

        // Set navigating state to keep loader visible
        setIsNavigating(true)

        // Store quote ID in sessionStorage for result page
        if (quoteResponse.data.data?.id) {
          sessionStorage.setItem(
            'pendingQuoteId',
            quoteResponse.data.data.id.toString()
          )
          sessionStorage.setItem('isGeneratingQuote', 'true')
        }

        // Use window.location.href for immediate navigation to prevent flash
        // This ensures the loader stays visible until the new page loads
        // Add a small delay to show the toast
        setTimeout(() => {
          window.location.href = `/result-screen`
        }, 1000)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error submitting form:', error)
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to generate quote. Please try again.'

        // Show error toast
        toast.error(errorMessage)

        setFieldError('selectedServices', errorMessage)
        setSubmitting(false)
        setIsNavigating(false)
        // Clear sessionStorage flags on error
        sessionStorage.removeItem('pendingQuoteId')
        sessionStorage.removeItem('isGeneratingQuote')
      }
    },
  })

  // Hydrate from localStorage after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)

    // Load data from localStorage and update form
    const data = getFormData()
    const storedValues = getInitialValuesFromStorage(data)

    // Always recalculate transaction volume from monthlyTransactionVolume
    if (data.monthlyTransactionVolume) {
      storedValues.transactionVolume = mapTransactionVolumeToBand(
        data.monthlyTransactionVolume
      )
      // Set default reporting frequency based on transaction volume
      if (!data.reportingFrequency) {
        storedValues.reportingFrequency =
          storedValues.transactionVolume === '1-100/month'
            ? 'Quarterly'
            : 'Monthly'
      }
    }

    formik.setValues(storedValues)

    // Show loader for 1 second, then show content
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-set reporting frequency when transaction volume changes (only if not manually set)
  useEffect(() => {
    if (!isClient || !formik.values.transactionVolume) return

    // Only auto-set if user hasn't manually changed the frequency
    if (!hasManuallySetFrequency) {
      // If transaction volume is '1-100/month', set to 'Quarterly'
      // Otherwise, set to 'Monthly'
      const shouldBeQuarterly =
        formik.values.transactionVolume === '1-100/month'
      const newFrequency = shouldBeQuarterly ? 'Quarterly' : 'Monthly'

      if (formik.values.reportingFrequency !== newFrequency) {
        formik.setFieldValue('reportingFrequency', newFrequency)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.transactionVolume, isClient, hasManuallySetFrequency])

  // Fetch AI suggestions when page loads
  useEffect(() => {
    const fetchAISuggestions = async () => {
      if (!isClient) return

      const allFormData = getFormData()

      // Check if we have minimum required data
      if (
        !allFormData.companyName ||
        !allFormData.setupType ||
        !allFormData.annualTurnover
      ) {
        return
      }

      setLoadingSuggestion(true)
      try {
        // Map setup type to API format
        const setupTypeMap: Record<string, string> = {
          'owner-led': 'owner_led',
          'internal-team': 'internal',
          'external-agency': 'external',
          hybrid: 'hybrid',
        }

        const userInput = {
          company_name: allFormData.companyName || '',
          industry: allFormData.industry || null,
          annual_turnover_band: allFormData.annualTurnover || '',
          number_of_staff: Number(allFormData.numberOfStaff) || 0,
          monthly_transactions:
            Number(allFormData.monthlyTransactionVolume) || 0,
          current_setup:
            setupTypeMap[allFormData.setupType || 'owner-led'] || 'owner_led',
          reporting_frequency: formik.values.reportingFrequency || 'Monthly',
          selected_services: formik.values.selectedServices || [],
        }

        const response = await axiosInstance.post('/api/ai_suggestion', {
          userInput,
        })

        if (response.data.ok && response.data.data) {
          setAiSuggestion(response.data.data)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching AI suggestions:', error)
      } finally {
        setLoadingSuggestion(false)
      }
    }

    fetchAISuggestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, formik.values.reportingFrequency])

  const toggleService = (serviceId: string) => {
    const currentServices = formik.values.selectedServices || []
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId]
    formik.setFieldValue('selectedServices', newServices)
  }

  // Save to localStorage whenever form values change (debounced)
  useEffect(() => {
    if (!isClient) return

    const timeoutId = setTimeout(() => {
      saveFormData(formik.values)
    }, 300)

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.reportingFrequency,
    formik.values.transactionVolume,
    formik.values.selectedServices,
    isClient,
  ])

  if (isLoading) {
    return <ServiceSelectionSkeleton />
  }

  return (
    <>
      {(formik.isSubmitting || isNavigating) && <QuoteLoader />}
      <div className='xl:w-[1216px] m-auto  bg-white min-h-screen flex flex-col items-center px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10'>
        <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-12'>
          <div className='mb-10 sm:mb-12'>
            <Stepper steps={FORM_STEPS} currentStep={4} />
          </div>

          <form onSubmit={formik.handleSubmit} className='space-y-8'>
            {/* Main Heading */}
            <div className=' flex flex-col justify-center items-center mb-8 text-center sm:text-left'>
              <h1 className='text-3xl font-semibold tracking-tight text-[#181D27] sm:text-4xl'>
                What services do you need?
              </h1>
              <p className='mt-3 text-sm text-gray-500 sm:text-base'>
                Intelligent Bookkeeping is always included - select any add-ons.
              </p>
            </div>

            {/* Intelligent Bookkeeping Section */}
            <div className='space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8'>
              <h2 className='text-lg font-semibold text-gray-900 sm:text-xl'>
                Intelligent Bookkeeping (Always Included)
              </h2>
              <div className='grid gap-4 sm:gap-6 md:grid-cols-2'>
                <div>
                  <Select
                    label='Reporting Frequency'
                    items={REPORTING_FREQUENCY_SELECT_ITEMS}
                    selectedKey={formik.values.reportingFrequency || null}
                    onSelectionChange={key => {
                      formik.setFieldValue('reportingFrequency', key as string)
                      formik.setFieldTouched('reportingFrequency', true)
                      setHasManuallySetFrequency(true)
                    }}
                    placeholder='Select reporting frequency'
                    size='sm'
                    isInvalid={
                      formik.touched.reportingFrequency &&
                      !!formik.errors.reportingFrequency
                    }
                    hint={
                      formik.touched.reportingFrequency &&
                      formik.errors.reportingFrequency
                        ? formik.errors.reportingFrequency
                        : undefined
                    }
                  >
                    {item => (
                      <Select.Item id={item.id}>{item.label}</Select.Item>
                    )}
                  </Select>
                </div>
                <div>
                  <Select
                    label='Transaction Volume'
                    items={TRANSACTION_VOLUME_SELECT_ITEMS}
                    selectedKey={formik.values.transactionVolume || null}
                    onSelectionChange={() => {
                      // Field is read-only, do nothing
                    }}
                    placeholder='Select transaction volume'
                    size='sm'
                    isDisabled
                    isInvalid={
                      formik.touched.transactionVolume &&
                      !!formik.errors.transactionVolume
                    }
                    hint={
                      formik.touched.transactionVolume &&
                      formik.errors.transactionVolume
                        ? formik.errors.transactionVolume
                        : 'This value is automatically calculated from your monthly transaction volume'
                    }
                  >
                    {item => (
                      <Select.Item id={item.id}>{item.label}</Select.Item>
                    )}
                  </Select>
                </div>
              </div>
              {/* Warning message for Monthly reporting with 1-100/month */}
              {formik.values.transactionVolume === '1-100/month' &&
                formik.values.reportingFrequency === 'Monthly' && (
                  <div className='rounded-lg border border-amber-200 bg-amber-50 p-3 mt-4'>
                    <p className='text-sm text-amber-800'>
                      <span className='font-semibold'>Note:</span> Monthly
                      reporting for transaction volumes of 1-100/month incurs an
                      additional charge of{' '}
                      <span className='font-semibold'>£100/month</span>.
                    </p>
                  </div>
                )}
            </div>

            {/* Additional Services Section */}
            <AdditionalServices
              services={SERVICES}
              selectedServices={formik.values.selectedServices || []}
              onToggleService={toggleService}
            />

            {/* Error Message */}
            {formik.errors.selectedServices && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                <p className='text-sm text-red-600'>
                  {formik.errors.selectedServices}
                </p>
              </div>
            )}

            {/* Info Text */}
            <p className='text-center text-sm text-gray-500 sm:text-base'>
              Businesses of a similar size typically select services to improve
              efficiency and reduce manual workload.
            </p>

            {/* AI Suggestion Section */}
            {loadingSuggestion && (
              <div className='rounded-xl border border-blue-200 bg-blue-50 p-4 sm:p-5'>
                <p className='text-center text-sm font-medium text-gray-900 sm:text-base'>
                  Generating AI suggestions...
                </p>
              </div>
            )}

            {aiSuggestion && !loadingSuggestion && (
              <div className='rounded-xl border bg-white p-4 sm:p-5 space-y-4'>
                <div className='text-center'>
                  <h3 className='text-lg font-semibold  text-[#7839EE] mb-2'>
                    AI Service Recommendations
                  </h3>
                  <p className='text-sm text-gray-700 mb-3'>
                    {aiSuggestion.summary}
                  </p>
                  {aiSuggestion.reasoning && (
                    <p className='text-xs text-gray-600 mb-4'>
                      {aiSuggestion.reasoning}
                    </p>
                  )}
                </div>

                {aiSuggestion.suggested_services &&
                  aiSuggestion.suggested_services.length > 0 && (
                    <div className='space-y-2'>
                      <p className='text-sm font-medium text-gray-900'>
                        Suggested Services:
                      </p>
                      <div className='flex flex-wrap gap-2 justify-center'>
                        {aiSuggestion.suggested_services.map(
                          (serviceId: string) => {
                            const service = SERVICES.find(
                              s => s.id === serviceId
                            )
                            if (!service) return null
                            const isSelected =
                              formik.values.selectedServices?.includes(
                                serviceId
                              )
                            return (
                              <button
                                key={serviceId}
                                type='button'
                                onClick={() => toggleService(serviceId)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                  isSelected
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-purple-600 border-2 border-purple-300 hover:border-purple-500'
                                }`}
                              >
                                {service.title}
                              </button>
                            )
                          }
                        )}
                      </div>
                      <div className='flex justify-center mt-3'>
                        <Button
                          type='button'
                          color='primary'
                          size='sm'
                          onClick={() => {
                            // Apply all suggested services
                            const newServices = [
                              ...new Set([
                                ...(formik.values.selectedServices || []),
                                ...aiSuggestion.suggested_services,
                              ]),
                            ]
                            formik.setFieldValue(
                              'selectedServices',
                              newServices
                            )
                          }}
                          className='transition-all duration-200 hover:scale-105 active:scale-95'
                        >
                          Apply All Suggestions
                        </Button>
                      </div>
                    </div>
                  )}
              </div>
            )}

            {!aiSuggestion && !loadingSuggestion && (
              <div className='flex justify-center'>
                <Button
                  type='button'
                  color='secondary'
                  size='lg'
                  onClick={async () => {
                    setLoadingSuggestion(true)
                    try {
                      const allFormData = getFormData()
                      const setupTypeMap: Record<string, string> = {
                        'owner-led': 'owner_led',
                        'internal-team': 'internal',
                        'external-agency': 'external',
                        hybrid: 'hybrid',
                      }

                      const userInput = {
                        company_name: allFormData.companyName || '',
                        industry: allFormData.industry || null,
                        annual_turnover_band: allFormData.annualTurnover || '',
                        number_of_staff: Number(allFormData.numberOfStaff) || 0,
                        monthly_transactions:
                          Number(allFormData.monthlyTransactionVolume) || 0,
                        current_setup:
                          setupTypeMap[allFormData.setupType || 'owner-led'] ||
                          'owner_led',
                        reporting_frequency:
                          formik.values.reportingFrequency || 'Quarterly',
                        selected_services: formik.values.selectedServices || [],
                      }

                      const response = await axiosInstance.post(
                        '/api/ai_suggestion',
                        { userInput }
                      )

                      if (response.data.ok && response.data.data) {
                        setAiSuggestion(response.data.data)
                      }
                    } catch (error) {
                      // eslint-disable-next-line no-console
                      console.error('Error fetching AI suggestions:', error)
                    } finally {
                      setLoadingSuggestion(false)
                    }
                  }}
                  className='transition-all duration-200 hover:scale-105 active:scale-95'
                >
                  Get AI Suggestion
                </Button>
              </div>
            )}

            {/* Bottom Summary Bar */}
            <div className='rounded-xl border border-yellow-200 bg-yellow-50 p-4 sm:p-5'>
              <p className='text-center text-sm font-medium text-gray-900 sm:text-base'>
                Intelligent Bookkeeping (Always Included)
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-6 border-t border-gray-200'>
              <Link href='/about_business'>
                <Button
                  type='button'
                  color='secondary'
                  size='lg'
                  iconLeading={ArrowLeft}
                  className='transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto'
                >
                  Back
                </Button>
              </Link>
              <Button
                type='submit'
                color='primary'
                size='lg'
                iconTrailing={ArrowRight}
                className='transition-all duration-200 hover:scale-105 active:scale-95'
                isLoading={formik.isSubmitting}
                showTextWhileLoading
              >
                {formik.isSubmitting ? 'Generating Quote...' : 'View My Quote'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
