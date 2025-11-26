'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFormik } from 'formik'
import AboutBusinessForm from './about-business-form'
import { getFormData, saveFormData } from '@/utils/sessionStorage'
import { axiosInstance } from '@/utils/axios'
import {
  createValidationSchema,
  calculateOwnerHourlyValue,
  calculateInternalCostClient,
  getRequiredFields,
  createUserInputPayload,
} from '@/utils/constants/about-business-utils'
import type {
  SetupOption,
  AboutBusinessFormValues as FormValues,
  CalculationData,
} from '@/utils/type'

export default function AboutBusinessContent() {
  const [isClient, setIsClient] = useState(false)
  const [setupType, setSetupType] = useState<SetupOption>('owner-led')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculatedInternalCost, setCalculatedInternalCost] = useState<
    number | null
  >(null)
  const [isInternalCostOverridden, setIsInternalCostOverridden] =
    useState(false)
  const [calculationData, setCalculationData] =
    useState<CalculationData | null>(null)
  const [calculatedHourlyValue, setCalculatedHourlyValue] = useState<
    number | null
  >(null)
  const [isHourlyValueOverridden, setIsHourlyValueOverridden] = useState(false)
  const showOwnercost = setupType === 'owner-led'
  const showInternalCost =
    setupType === 'internal-team' || setupType === 'hybrid'

  // Always start with default values to match server render
  const initialValues: FormValues = useMemo(() => {
    return {
      numberOfStaff: '0',
      industry: '',
      annualTurnover: '',
      hoursSpent: '20',
      monthlyTransactionVolume: '0',
      hourlyValue: '0',
      internalCost: '0',
      currentExternalCost: '0',
      estimatedHoursSpent: '0',
    }
  }, [])

  const validationSchema = useMemo(
    () => createValidationSchema(setupType),
    [setupType]
  )

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // Enable reinitialize to load from localStorage after hydration
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (_values: FormValues) => {
      // This will be handled by handleContinue
      // Keep this for formik validation flow
    },
  })

  // Fetch calculation data once when component mounts
  useEffect(() => {
    const fetchCalculationData = async () => {
      try {
        const response = await axiosInstance.get('/api/about_page')

        if (response.data.ok && response.data.data) {
          setCalculationData(response.data.data)
        } else {
          // eslint-disable-next-line no-console
          console.error(
            'Failed to fetch calculation data:',
            response.data.error
          )
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching calculation data:', error)
      }
    }

    fetchCalculationData()
  }, [])

  // Hydrate from localStorage after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)

    const data = getFormData()

    // Set setup type first
    setSetupType((data?.setupType as SetupOption) ?? 'owner-led')

    // Set Formik values AFTER it is mounted
    if (data) {
      formik.setValues({
        numberOfStaff: data.numberOfStaff || '0',
        industry: data.industry || '',
        annualTurnover: data.annualTurnover || '',
        hoursSpent: data.hoursSpent || '20',
        monthlyTransactionVolume: data.monthlyTransactionVolume || '0',
        hourlyValue: data.hourlyValue || '0',
        internalCost: data.internalCost || '0',
        currentExternalCost: data.currentExternalCost || '0',
        estimatedHoursSpent: data.estimatedHoursSpent || '0',
      })

      // Check if hourly value was manually overridden
      // If user has a stored hourlyValue that's not '0', consider it overridden
      if (
        data.hourlyValue &&
        data.hourlyValue !== '0' &&
        data.setupType === 'owner-led'
      ) {
        setIsHourlyValueOverridden(true)
      }

      // Check if internal cost was manually overridden
      // If user has a stored internalCost that's not '0', consider it overridden
      if (
        data.internalCost &&
        data.internalCost !== '0' &&
        (data.setupType === 'internal-team' || data.setupType === 'hybrid')
      ) {
        setIsInternalCostOverridden(true)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calculate owner hourly value when annualTurnover changes (for owner-led setup)
  useEffect(() => {
    if (!isClient || !showOwnercost) return
    if (!formik.values.annualTurnover || !calculationData) {
      setCalculatedHourlyValue(null)
      return
    }

    // Debounce calculation
    const timeout = setTimeout(() => {
      const calculatedHourly = calculateOwnerHourlyValue(
        formik.values.annualTurnover,
        calculationData
      )

      if (calculatedHourly !== null) {
        setCalculatedHourlyValue(calculatedHourly)
        // If not overridden, update the form value
        if (!isHourlyValueOverridden) {
          formik.setFieldValue('hourlyValue', calculatedHourly.toString())
        }
      } else {
        setCalculatedHourlyValue(null)
      }
    }, 300) // Debounce calculation

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.annualTurnover,
    isClient,
    showOwnercost,
    isHourlyValueOverridden,
    calculationData,
  ])

  // Calculate internal cost when annualTurnover changes (for internal-team or hybrid setup)
  useEffect(() => {
    if (!isClient || !showInternalCost) return
    if (!formik.values.annualTurnover || !calculationData) {
      setCalculatedInternalCost(null)
      return
    }

    // Debounce calculation
    const timeout = setTimeout(() => {
      const calculatedMonthly = calculateInternalCostClient(
        formik.values.annualTurnover,
        calculationData
      )

      if (calculatedMonthly !== null) {
        setCalculatedInternalCost(calculatedMonthly)
        // If not overridden, update the form value
        if (!isInternalCostOverridden) {
          formik.setFieldValue('internalCost', calculatedMonthly.toString())
        }
      } else {
        setCalculatedInternalCost(null)
      }
    }, 300) // Debounce calculation

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.annualTurnover,
    isClient,
    showInternalCost,
    isInternalCostOverridden,
    calculationData,
  ])

  // Update hourly value input when override is disabled and calculated value exists
  useEffect(() => {
    if (
      !isHourlyValueOverridden &&
      calculatedHourlyValue !== null &&
      calculatedHourlyValue !== undefined &&
      showOwnercost
    ) {
      // Only update if the current value doesn't match the calculated value
      const currentValue = parseFloat(formik.values.hourlyValue) || 0
      if (Math.abs(currentValue - calculatedHourlyValue) > 0.01) {
        formik.setFieldValue('hourlyValue', calculatedHourlyValue.toString())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHourlyValueOverridden, calculatedHourlyValue, showOwnercost])

  // Update input when override is disabled and calculated value exists
  useEffect(() => {
    if (
      !isInternalCostOverridden &&
      calculatedInternalCost !== null &&
      calculatedInternalCost !== undefined &&
      showInternalCost
    ) {
      // Only update if the current value doesn't match the calculated value
      const currentValue = parseFloat(formik.values.internalCost) || 0
      if (Math.abs(currentValue - calculatedInternalCost) > 0.01) {
        formik.setFieldValue('internalCost', calculatedInternalCost.toString())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInternalCostOverridden, calculatedInternalCost, showInternalCost])

  // Sync estimatedHoursSpent with hoursSpent for owner-led setup
  useEffect(() => {
    if (setupType === 'owner-led' && formik.values.hoursSpent) {
      formik.setFieldValue('estimatedHoursSpent', formik.values.hoursSpent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.hoursSpent, setupType])

  // Save data with debounce — runs only when values change
  useEffect(() => {
    if (!isClient) return

    const timeout = setTimeout(() => {
      saveFormData({
        ...formik.values,
        setupType,
      })
    }, 300)

    return () => clearTimeout(timeout)
  }, [formik.values, setupType, isClient])

  // Handle continue button click with validation
  const handleContinue = async () => {
    setIsSubmitting(true)

    // Mark all required fields as touched to show validation errors
    const fields = getRequiredFields(setupType)

    fields.forEach(field => {
      formik.setFieldTouched(field, true)
    })

    // Validate the form
    const errors = await formik.validateForm()

    if (Object.keys(errors).length > 0) {
      // Form has errors, update formik state
      formik.setErrors(errors)
      setIsSubmitting(false)
      return
    }

    // Form is valid, proceed with API call
    try {
      const formData = getFormData()
      const userInputId = formData.userInputId

      if (!userInputId) {
        throw new Error(
          'User input ID not found. Please go back and complete the previous steps.'
        )
      }

      // Prepare payload using helper function
      const payload = createUserInputPayload(userInputId, formik.values)

      // Update user input
      const response = await axiosInstance.put('/api/user_input', payload)

      if (!response.data.ok) {
        throw new Error(response.data.error || 'Failed to update user input')
      }

      // Save to sessionStorage
      saveFormData({
        ...formik.values,
        setupType,
      })

      // Navigate to next page
      window.location.href = '/service_selection'
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating business information:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <AboutBusinessForm
      formik={formik}
      setupType={setupType}
      showOwnercost={showOwnercost}
      calculatedInternalCost={calculatedInternalCost}
      isInternalCostOverridden={isInternalCostOverridden}
      onInternalCostOverride={setIsInternalCostOverridden}
      calculatedHourlyValue={calculatedHourlyValue}
      isHourlyValueOverridden={isHourlyValueOverridden}
      onHourlyValueOverride={setIsHourlyValueOverridden}
      handleContinue={handleContinue}
      isSubmitting={isSubmitting}
    />
  )
}
