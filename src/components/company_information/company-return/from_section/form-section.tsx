'use client'

import { Button } from '@/components/base/buttons/button'
import { Input } from '@/components/base/input/input'
import { Checkbox } from '@/components/base/checkbox/checkbox'
import { ArrowLeft, ArrowRight } from '@untitledui/icons'
import Link from 'next/link'
import type { FormikProps } from 'formik'
import type { CompanyInformationFormValues as FormValues } from '@/utils/type'

interface FormSectionProps {
  formik: FormikProps<FormValues>
  isFormValid: boolean
  isSubmitting?: boolean
  submitError?: string | null
  onBackClick?: () => void
}

export default function FormSection({
  formik,
  isFormValid,
  isSubmitting = false,
  submitError = null,
  onBackClick,
}: FormSectionProps) {
  return (
    <div className='w-full max-w-[500px] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <form
        onSubmit={formik.handleSubmit}
        className='w-full flex flex-col gap-4'
      >
        <Input
          label='Full name'
          type='text'
          placeholder='Full name'
          isRequired
          tooltip='Enter your complete full name as it appears on official documents'
          value={formik.values.fullName}
          onChange={value => {
            formik.setFieldValue('fullName', value)
          }}
          onBlur={() => formik.setFieldTouched('fullName', true)}
          isInvalid={formik.touched.fullName && !!formik.errors.fullName}
          hint={
            formik.touched.fullName && formik.errors.fullName
              ? formik.errors.fullName
              : undefined
          }
        />
        <Input
          label='Company Name'
          type='text'
          placeholder='Company Name'
          isRequired
          tooltip='Enter the legal name of your company or organization'
          value={formik.values.companyName}
          onChange={value => {
            formik.setFieldValue('companyName', value)
          }}
          onBlur={() => formik.setFieldTouched('companyName', true)}
          isInvalid={formik.touched.companyName && !!formik.errors.companyName}
          hint={
            formik.touched.companyName && formik.errors.companyName
              ? formik.errors.companyName
              : undefined
          }
        />
        <Input
          label='Business Email'
          type='email'
          placeholder='Business Email'
          isRequired
          tooltip="Enter your professional business email address. We'll use this to send your ROI analysis report."
          value={formik.values.businessEmail}
          onChange={value => {
            formik.setFieldValue('businessEmail', value)
          }}
          onBlur={() => formik.setFieldTouched('businessEmail', true)}
          isInvalid={
            formik.touched.businessEmail && !!formik.errors.businessEmail
          }
          hint={
            formik.touched.businessEmail && formik.errors.businessEmail
              ? formik.errors.businessEmail
              : undefined
          }
        />
        <Checkbox
          label='I agree to Sanay processing my data to provide this ROI analysis and occasional communications about their services. You can unsubscribe anytime'
          isSelected={formik.values.agreeToTerms}
          onChange={isSelected => {
            formik.setFieldValue('agreeToTerms', isSelected)
          }}
        />
        {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
          <p className='text-sm text-red-500 animate-in fade-in slide-in-from-top-1 duration-200'>
            {formik.errors.agreeToTerms}
          </p>
        )}
        {submitError && (
          <p className='text-sm text-red-500 animate-in fade-in slide-in-from-top-1 duration-200'>
            {submitError}
          </p>
        )}
        {/* Button section */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 min-h-[48px] transition-all duration-300 w-full'>
          <Link href='/' className='w-full sm:w-auto'>
            <Button
              type='button'
              size='lg'
              color='secondary'
              iconLeading={ArrowLeft}
              className='w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95'
              isDisabled={isSubmitting}
              onClick={onBackClick}
            >
              Back
            </Button>
          </Link>
          <Button
            type='submit'
            color='primary'
            size='lg'
            iconTrailing={ArrowRight}
            isDisabled={!isFormValid || isSubmitting}
            className='w-full sm:w-auto transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  )
}
