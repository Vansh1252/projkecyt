/**
 * Utility functions for managing form data in sessionStorage
 */

const STORAGE_KEY = 'sanay-quoting-form-data'

export interface FormData {
  // User Input ID (stored after first API call)
  userInputId?: number

  // Company Information
  fullName?: string
  companyName?: string
  businessEmail?: string
  agreeToTerms?: boolean

  // Current Setup
  setupType?: 'owner-led' | 'internal-team' | 'external-agency' | 'hybrid'

  // About Business
  numberOfStaff?: string
  industry?: string
  annualTurnover?: string
  hoursSpent?: string
  monthlyTransactionVolume?: string
  hourlyValue?: string
  internalCost?: string
  currentExternalCost?: string
  estimatedHoursSpent?: string
  isHourlyValueOverridden?: boolean
  isInternalCostOverridden?: boolean

  // Service Selection
  reportingFrequency?: string
  transactionVolume?: string
  selectedServices?: string[]
}

/**
 * Get all form data from sessionStorage
 */
export const getFormData = (): FormData => {
  if (typeof window === 'undefined') return {}

  try {
    const data = sessionStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

/**
 * Save form data to sessionStorage
 */
export const saveFormData = (data: Partial<FormData>): void => {
  if (typeof window === 'undefined') return

  try {
    const existingData = getFormData()
    const updatedData = { ...existingData, ...data }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
  } catch {
    // Silently fail if sessionStorage is unavailable
  }
}

/**
 * Get a specific field value from sessionStorage
 */
export const getFieldValue = (
  key: keyof FormData
): string | boolean | string[] | undefined => {
  const data = getFormData()
  return data[key] as string | boolean | string[] | undefined
}

/**
 * Clear all form data from sessionStorage
 */
export const clearFormData = (): void => {
  if (typeof window === 'undefined') return

  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Silently fail if sessionStorage is unavailable
  }
}
