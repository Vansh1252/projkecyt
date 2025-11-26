'use client'

import React from 'react'
import { Input } from '@/components/base/input/input'
import { Checkbox } from '@/components/base/checkbox/checkbox'

interface CalculatedInfoProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: any
  setupType: 'owner-led' | 'internal-team' | 'external-agency' | 'hybrid'
  calculatedInternalCost?: number | null
  onInternalCostOverride?: (override: boolean) => void
  isInternalCostOverridden?: boolean
  calculatedHourlyValue?: number | null
  onHourlyValueOverride?: (override: boolean) => void
  isHourlyValueOverridden?: boolean
}

export const CalculatedInfo: React.FC<CalculatedInfoProps> = ({
  formik,
  setupType,
  calculatedInternalCost,
  onInternalCostOverride,
  isInternalCostOverridden = false,
  calculatedHourlyValue,
  onHourlyValueOverride,
  isHourlyValueOverridden = false,
}) => {
  const showInternalCost =
    setupType === 'internal-team' || setupType === 'hybrid'
  const showExternalCost =
    setupType === 'external-agency' || setupType === 'hybrid'

  const showOwnercost = setupType === 'owner-led'

  return (
    <div className='w-full'>
      <h2 className='mb-6 sm:mb-8 md:mb-12 text-center text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#181D27] leading-tight'>
        Calculated info
      </h2>
      <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
          {/* Hourly value */}
          {showOwnercost && (
            <div className='space-y-2'>
              <Input
                label='Hourly value (£)'
                type='number'
                placeholder='50'
                tooltip='The hourly rate used for calculations (optional - will use assumptions if not provided)'
                value={
                  formik.values.hourlyValue
                    ? Math.round(
                        parseFloat(formik.values.hourlyValue) || 0
                      ).toString()
                    : formik.values.hourlyValue
                }
                isDisabled={
                  calculatedHourlyValue !== null &&
                  calculatedHourlyValue !== undefined &&
                  !isHourlyValueOverridden
                }
                onChange={value => {
                  // Prevent negative values
                  const numValue = Number(value)
                  if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
                    formik.setFieldValue('hourlyValue', value)
                    // If user manually changes the value, mark as overridden
                    if (
                      calculatedHourlyValue !== null &&
                      calculatedHourlyValue !== undefined &&
                      value !== calculatedHourlyValue.toString() &&
                      value !== '' &&
                      value !== '0'
                    ) {
                      if (onHourlyValueOverride && !isHourlyValueOverridden) {
                        onHourlyValueOverride(true)
                      }
                    }
                  }
                }}
                onFocus={() => {
                  if (formik.values.hourlyValue === '0') {
                    formik.setFieldValue('hourlyValue', '')
                  }
                }}
                onBlur={() => formik.setFieldTouched('hourlyValue', true)}
                isInvalid={
                  formik.touched.hourlyValue && !!formik.errors.hourlyValue
                }
                hint={
                  formik.touched.hourlyValue && formik.errors.hourlyValue
                    ? formik.errors.hourlyValue
                    : undefined
                }
              />
              {/* Show calculated value and override option */}
              {calculatedHourlyValue !== null &&
                calculatedHourlyValue !== undefined && (
                  <div className='rounded-lg border border-blue-200 bg-blue-50 p-3 space-y-2'>
                    <p className='text-sm text-gray-700'>
                      <span className='font-semibold'>Calculated value:</span> £
                      {Math.round(calculatedHourlyValue).toLocaleString(
                        'en-GB'
                      )}
                      /hour
                    </p>
                    <Checkbox
                      label='This is a value calculated by us. You can change it if you think this is not your hourly value.'
                      isSelected={isHourlyValueOverridden}
                      onChange={checked => {
                        if (onHourlyValueOverride) {
                          onHourlyValueOverride(checked)
                        }
                        if (!checked) {
                          // When unchecked, set back to calculated value
                          if (
                            calculatedHourlyValue !== null &&
                            calculatedHourlyValue !== undefined
                          ) {
                            formik.setFieldValue(
                              'hourlyValue',
                              calculatedHourlyValue.toString()
                            )
                          }
                        }
                        // When checked, user can manually edit the value
                      }}
                    />
                  </div>
                )}
            </div>
          )}

          {/* Internal cost */}
          {showInternalCost && (
            <div className='space-y-2'>
              <Input
                label='Internal cost (£/month)'
                type='number'
                placeholder='55'
                tooltip='Your current internal finance operations cost per month (optional - will be calculated if not provided)'
                value={
                  formik.values.internalCost
                    ? Math.round(
                        parseFloat(formik.values.internalCost) || 0
                      ).toString()
                    : formik.values.internalCost
                }
                isDisabled={
                  calculatedInternalCost !== null &&
                  calculatedInternalCost !== undefined &&
                  !isInternalCostOverridden
                }
                onChange={value => {
                  // Prevent negative values
                  const numValue = Number(value)
                  if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
                    formik.setFieldValue('internalCost', value)
                    // If user manually changes the value, mark as overridden
                    if (
                      calculatedInternalCost !== null &&
                      calculatedInternalCost !== undefined &&
                      value !== calculatedInternalCost.toString() &&
                      value !== '' &&
                      value !== '0'
                    ) {
                      if (onInternalCostOverride && !isInternalCostOverridden) {
                        onInternalCostOverride(true)
                      }
                    }
                  }
                }}
                onFocus={() => {
                  if (formik.values.internalCost === '0') {
                    formik.setFieldValue('internalCost', '')
                  }
                }}
                onBlur={() => formik.setFieldTouched('internalCost', true)}
                isInvalid={
                  formik.touched.internalCost && !!formik.errors.internalCost
                }
                hint={
                  formik.touched.internalCost && formik.errors.internalCost
                    ? formik.errors.internalCost
                    : undefined
                }
              />
              {/* Show calculated value and override option */}
              {calculatedInternalCost !== null &&
                calculatedInternalCost !== undefined && (
                  <div className='rounded-lg border border-blue-200 bg-blue-50 p-3 space-y-2'>
                    <p className='text-sm text-gray-700'>
                      <span className='font-semibold'>Calculated value:</span> £
                      {Math.round(calculatedInternalCost).toLocaleString(
                        'en-GB'
                      )}
                      /month
                    </p>
                    <Checkbox
                      label='This is a value calculated by us. You can change it if you think this is not your internal value.'
                      isSelected={isInternalCostOverridden}
                      onChange={checked => {
                        if (onInternalCostOverride) {
                          onInternalCostOverride(checked)
                        }
                        if (!checked) {
                          // When unchecked, set back to calculated value
                          if (
                            calculatedInternalCost !== null &&
                            calculatedInternalCost !== undefined
                          ) {
                            formik.setFieldValue(
                              'internalCost',
                              calculatedInternalCost.toString()
                            )
                          }
                        }
                        // When checked, user can manually edit the value
                      }}
                    />
                  </div>
                )}
            </div>
          )}

          {/* Current external cost */}
          {showExternalCost && (
            <Input
              label='Current external cost (£/month)'
              type='number'
              placeholder='55'
              isRequired
              tooltip='Your current external finance operations cost per month'
              value={formik.values.currentExternalCost}
              onChange={value => {
                // Prevent negative values
                const numValue = Number(value)
                if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
                  formik.setFieldValue('currentExternalCost', value)
                }
              }}
              onFocus={() => {
                if (formik.values.currentExternalCost === '0') {
                  formik.setFieldValue('currentExternalCost', '')
                }
              }}
              onBlur={() => formik.setFieldTouched('currentExternalCost', true)}
              isInvalid={
                formik.touched.currentExternalCost &&
                !!formik.errors.currentExternalCost
              }
              hint={
                formik.touched.currentExternalCost &&
                formik.errors.currentExternalCost
                  ? formik.errors.currentExternalCost
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
