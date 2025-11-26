import * as Yup from 'yup'
import type { FormData } from '@/utils/sessionStorage'
import type { CompanyInformationFormValues } from '@/utils/type'

// Validation Schema

export const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  companyName: Yup.string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  businessEmail: Yup.string()
    .email('Invalid email address')
    .required('Business email is required'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('You must agree to the terms and conditions'),
})

// Initial Values
export const getInitialValues = (): CompanyInformationFormValues => {
  return {
    fullName: '',
    companyName: '',
    businessEmail: '',
    agreeToTerms: false,
  }
}

// Helper Functions
export const getInitialValuesFromStorage = (
  data: FormData
): CompanyInformationFormValues => {
  return {
    fullName: data.fullName || '',
    companyName: data.companyName || '',
    businessEmail: data.businessEmail || '',
    agreeToTerms: data.agreeToTerms || false,
  }
}

export const isFormValid = (values: CompanyInformationFormValues): boolean => {
  return (
    values.fullName.length >= 2 &&
    values.companyName.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.businessEmail) &&
    values.agreeToTerms
  )
}

export const createUserInputPayload = (
  values: CompanyInformationFormValues
) => {
  return {
    fullName: values.fullName,
    companyName: values.companyName,
    businessEmail: values.businessEmail,
  }
}

// Static Data

export const BENEFITS = [
  'Detailed cost comparison',
  'Annual savings projection',
  'Efficiency score analysis',
  'AI-powered recommendations',
  'Downloadable PDF report',
]
