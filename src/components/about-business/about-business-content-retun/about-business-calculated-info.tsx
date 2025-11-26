'use client'

import { CalculatedInfo } from '@/components/service_selection/calculated-info/calculated-info'
import type { FormikProps } from 'formik'
import type { SetupOption, AboutBusinessFormValues } from '@/utils/type'

interface AboutBusinessCalculatedInfoProps {
  formik: FormikProps<AboutBusinessFormValues>
  setupType: SetupOption
  calculatedInternalCost: number | null
  isInternalCostOverridden: boolean
  onInternalCostOverride: (value: boolean) => void
  calculatedHourlyValue: number | null
  isHourlyValueOverridden: boolean
  onHourlyValueOverride: (value: boolean) => void
}

export default function AboutBusinessCalculatedInfo({
  formik,
  setupType,
  calculatedInternalCost,
  isInternalCostOverridden,
  onInternalCostOverride,
  calculatedHourlyValue,
  isHourlyValueOverridden,
  onHourlyValueOverride,
}: AboutBusinessCalculatedInfoProps) {
  return (
    <div className='mt-6 sm:mt-8'>
      <CalculatedInfo
        formik={formik}
        setupType={setupType}
        calculatedInternalCost={calculatedInternalCost}
        onInternalCostOverride={onInternalCostOverride}
        isInternalCostOverridden={isInternalCostOverridden}
        calculatedHourlyValue={calculatedHourlyValue}
        onHourlyValueOverride={onHourlyValueOverride}
        isHourlyValueOverridden={isHourlyValueOverridden}
      />
    </div>
  )
}
