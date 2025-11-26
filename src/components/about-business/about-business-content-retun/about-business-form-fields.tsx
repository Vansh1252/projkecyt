'use client'

import { Input } from '@/components/base/input/input'
import { HelpCircle } from '@untitledui/icons'
import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip'
import { Select } from '@/components/base/select/select'
import { TURNOVER_SELECT_ITEMS } from '@/utils/constants/constants'
import type { FormikProps } from 'formik'
import type { AboutBusinessFormValues } from '@/utils/type'

interface AboutBusinessFormFieldsProps {
  formik: FormikProps<AboutBusinessFormValues>
  showOwnercost: boolean
}

export default function AboutBusinessFormFields({
  formik,
  showOwnercost,
}: AboutBusinessFormFieldsProps) {
  return (
    <div className='space-y-6 sm:space-y-8 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 md:p-8 shadow-sm'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Number of Staff */}
        <Input
          label='Number of Staff'
          type='number'
          placeholder='10'
          isRequired
          tooltip='Enter the total number of employees in your business'
          value={formik.values.numberOfStaff}
          onChange={value => {
            // Prevent negative values
            const numValue = Number(value)
            if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
              formik.setFieldValue('numberOfStaff', value)
            }
          }}
          onFocus={() => {
            if (formik.values.numberOfStaff === '0') {
              formik.setFieldValue('numberOfStaff', '')
            }
          }}
          onBlur={() => formik.setFieldTouched('numberOfStaff', true)}
          isInvalid={
            formik.touched.numberOfStaff && !!formik.errors.numberOfStaff
          }
          hint={
            formik.touched.numberOfStaff && formik.errors.numberOfStaff
              ? formik.errors.numberOfStaff
              : undefined
          }
        />

        {/* Industry */}
        <Input
          label='Industry (Optional)'
          type='text'
          placeholder='e.g., Retail SaaS'
          tooltip='Enter your industry or business sector'
          value={formik.values.industry}
          onChange={value => {
            formik.setFieldValue('industry', value)
          }}
          onBlur={() => formik.setFieldTouched('industry', true)}
          isInvalid={formik.touched.industry && !!formik.errors.industry}
          hint={
            formik.touched.industry && formik.errors.industry
              ? formik.errors.industry
              : undefined
          }
        />

        {/* Annual Turnover */}
        <div>
          <Select
            label='Annual Turnover'
            tooltip='Select your annual revenue range'
            items={TURNOVER_SELECT_ITEMS}
            selectedKey={formik.values.annualTurnover || null}
            onSelectionChange={key => {
              const value = key ? (key as string) : ''
              // Set the value and validate in one go
              formik.setFieldValue('annualTurnover', value, true)
              // Mark as touched to show/hide errors appropriately
              if (value) {
                formik.setFieldTouched('annualTurnover', true, false)
              } else {
                formik.setFieldTouched('annualTurnover', false, false)
              }
            }}
            placeholder='Select turnover band'
            size='sm'
            isRequired
            isInvalid={
              formik.touched.annualTurnover && !!formik.errors.annualTurnover
            }
            hint={
              formik.touched.annualTurnover && formik.errors.annualTurnover
                ? formik.errors.annualTurnover
                : undefined
            }
          >
            {item => <Select.Item id={item.id}>{item.label}</Select.Item>}
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
        {/* Hours spent on finance operations */}
        {showOwnercost && (
          <div className='space-y-3 sm:space-y-4 rounded-xl border border-gray-100 p-3 sm:p-4 md:p-5'>
            <label className='block text-xs sm:text-sm font-medium text-gray-700'>
              <span className='flex items-center flex-wrap gap-1 sm:gap-2'>
                Hours spent on finance operations per month:{''}
                {showOwnercost && <span className='text-red-500'>*</span>}
                <span className='font-semibold text-gray-900'>
                  {formik.values.hoursSpent}
                </span>
                <Tooltip
                  title='Finance Operations Hours'
                  description='Select the number of hours you spend on finance operations each month'
                  placement='top'
                  delay={200}
                >
                  <TooltipTrigger className='inline-flex cursor-pointer items-center text-fg-quaternary transition-colors duration-100 ease-linear hover:text-fg-quaternary_hover focus:text-fg-quaternary_hover shrink-0'>
                    <HelpCircle className='size-3 sm:size-4' />
                  </TooltipTrigger>
                </Tooltip>
              </span>
            </label>
            <div className='space-y-2 sm:space-y-3'>
              <input
                type='range'
                min='1'
                max='180'
                value={formik.values.hoursSpent}
                onChange={e => {
                  formik.setFieldValue('hoursSpent', e.target.value)
                }}
                className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200'
                style={{
                  background: `linear-gradient(to right, #7839EE 0%, #7839EE ${(Number(formik.values.hoursSpent) / 180) * 100}%, #e5e7eb ${(Number(formik.values.hoursSpent) / 180) * 100}%, #e5e7eb 100%)`,
                }}
              />
              <div className='flex justify-between text-[10px] sm:text-xs text-gray-500'>
                <span>1 hour</span>
                <span>180 hours</span>
              </div>
              <Input
                type='number'
                placeholder='Enter hours'
                value={formik.values.hoursSpent}
                onChange={value => {
                  // Prevent negative values
                  const numValue = Number(value)
                  if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
                    formik.setFieldValue('hoursSpent', value)
                  }
                }}
                onFocus={() => {
                  if (formik.values.hoursSpent === '0') {
                    formik.setFieldValue('hoursSpent', '')
                  }
                }}
                onBlur={() => formik.setFieldTouched('hoursSpent', true)}
              />
            </div>
          </div>
        )}

        {/* Monthly transaction volume */}
        <div className='space-y-3 sm:space-y-4 rounded-xl border border-gray-100 p-3 sm:p-4 md:p-5'>
          <label className='block text-xs sm:text-sm font-medium text-gray-700'>
            <span className='flex items-center gap-1 sm:gap-2'>
              Monthly transaction volume:
              <span className='font-semibold text-gray-900'>
                {formik.values.monthlyTransactionVolume}
              </span>
              <span className='text-red-500'>*</span>
              <Tooltip
                title='Monthly Transaction Volume'
                description='Select your average number of transactions per month'
                placement='top'
                delay={200}
              >
                <TooltipTrigger className='inline-flex cursor-pointer items-center text-fg-quaternary transition-colors duration-100 ease-linear hover:text-fg-quaternary_hover focus:text-fg-quaternary_hover shrink-0'>
                  <HelpCircle className='size-3 sm:size-4' />
                </TooltipTrigger>
              </Tooltip>
            </span>
          </label>
          <div className='space-y-2 sm:space-y-3'>
            <input
              type='range'
              min='0'
              max='2000'
              step='50'
              value={formik.values.monthlyTransactionVolume}
              onChange={e => {
                const val = Number(e.target.value)

                // Prevent negative values and snap EXACT values like 0, 50, 100, 150
                if (val >= 0) {
                  const snapped = Math.round(val / 50) * 50
                  formik.setFieldValue(
                    'monthlyTransactionVolume',
                    snapped.toString()
                  )
                }
              }}
              onBlur={() =>
                formik.setFieldTouched('monthlyTransactionVolume', true)
              }
              className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200'
              style={{
                background: `linear-gradient(to right, #7839EE 0%, #7839EE ${(Number(formik.values.monthlyTransactionVolume) / 2000) * 100}%, #e5e7eb ${(Number(formik.values.monthlyTransactionVolume) / 2000) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <div className='flex justify-between text-[10px] sm:text-xs text-gray-500'>
              <span>0</span>
              <span>2000+</span>
            </div>
            {formik.touched.monthlyTransactionVolume &&
              formik.errors.monthlyTransactionVolume && (
                <p className='text-sm text-red-500 animate-in fade-in slide-in-from-top-1 duration-200'>
                  {formik.errors.monthlyTransactionVolume}
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
