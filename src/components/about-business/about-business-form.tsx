'use client'

import Stepper from '@/components/base/progress-steps/progress-step'
import { FORM_STEPS } from '@/utils/constants/constants'
import AboutBusinessHeader from './about-business-content-retun/about-business-header'
import AboutBusinessFormFields from './about-business-content-retun/about-business-form-fields'
import AboutBusinessCalculatedInfo from './about-business-content-retun/about-business-calculated-info'
import AboutBusinessNavigation from './about-business-content-retun/about-business-navigation'
import type { FormikProps } from 'formik'
import type { SetupOption, AboutBusinessFormValues } from '@/utils/type'

interface AboutBusinessFormProps {
  formik: FormikProps<AboutBusinessFormValues>
  setupType: SetupOption
  showOwnercost: boolean
  calculatedInternalCost: number | null
  isInternalCostOverridden: boolean
  onInternalCostOverride: (value: boolean) => void
  calculatedHourlyValue: number | null
  isHourlyValueOverridden: boolean
  onHourlyValueOverride: (value: boolean) => void
  handleContinue: () => void
  isSubmitting: boolean
}

export default function AboutBusinessForm({
  formik,
  setupType,
  showOwnercost,
  calculatedInternalCost,
  isInternalCostOverridden,
  onInternalCostOverride,
  calculatedHourlyValue,
  isHourlyValueOverridden,
  onHourlyValueOverride,
  handleContinue,
  isSubmitting,
}: AboutBusinessFormProps) {
  return (
    <div className='xl:w-[1216px] m-auto  bg-white min-h-screen flex flex-col items-center px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10'>
      <div className='mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12'>
        <div className='mb-6 sm:mb-8 md:mb-10 lg:mb-12'>
          <Stepper steps={FORM_STEPS} currentStep={3} />
        </div>

        <form onSubmit={formik.handleSubmit} className='space-y-6 sm:space-y-8'>
          {/* Header section */}
          <AboutBusinessHeader />

          {/* Form section */}
          <AboutBusinessFormFields
            formik={formik}
            showOwnercost={showOwnercost}
          />

          {/* Calculated Info Section */}
          <AboutBusinessCalculatedInfo
            formik={formik}
            setupType={setupType}
            calculatedInternalCost={calculatedInternalCost}
            isInternalCostOverridden={isInternalCostOverridden}
            onInternalCostOverride={onInternalCostOverride}
            calculatedHourlyValue={calculatedHourlyValue}
            isHourlyValueOverridden={isHourlyValueOverridden}
            onHourlyValueOverride={onHourlyValueOverride}
          />

          {/* Navigation Buttons */}
          <AboutBusinessNavigation
            handleContinue={handleContinue}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  )
}
