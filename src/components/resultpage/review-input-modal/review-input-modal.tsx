'use client'

import { X } from '@untitledui/icons'
import { Button } from '@/components/base/buttons/button'
import type { ReviewInputModalProps } from '@/utils/type'
import { SETUP_TYPE_LABELS, SERVICE_LABELS } from '@/utils/constants/constants'

export default function ReviewInputModal({
  isOpen,
  onClose,
  data,
  loading,
}: ReviewInputModalProps) {
  if (!isOpen) return null

  const formatCurrency = (amount: number | null): string => {
    if (amount === null) return 'Not specified'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4'>
      <div className='bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-semibold text-gray-900'>
            Review Your Inputs
          </h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            aria-label='Close'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        {/* Content */}
        <div className='overflow-y-auto flex-1 p-6'>
          {loading ? (
            <div className='space-y-6'>
              {/* Company Information Skeleton */}
              <div className='border-b border-gray-200 pb-4'>
                <div className='h-6 w-48 bg-gray-200 rounded animate-pulse mb-4' />
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <div className='h-4 w-24 bg-gray-200 rounded animate-pulse mb-2' />
                    <div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div>
                    <div className='h-4 w-24 bg-gray-200 rounded animate-pulse mb-2' />
                    <div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div className='md:col-span-2'>
                    <div className='h-4 w-28 bg-gray-200 rounded animate-pulse mb-2' />
                    <div className='h-5 w-48 bg-gray-200 rounded animate-pulse' />
                  </div>
                </div>
              </div>

              {/* Current Setup Skeleton */}
              <div className='border-b border-gray-200 pb-4'>
                <div className='h-6 w-40 bg-gray-200 rounded animate-pulse mb-4' />
                <div>
                  <div className='h-4 w-24 bg-gray-200 rounded animate-pulse mb-2' />
                  <div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
                </div>
              </div>

              {/* About Your Business Skeleton */}
              <div className='border-b border-gray-200 pb-4'>
                <div className='h-6 w-48 bg-gray-200 rounded animate-pulse mb-4' />
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <div className='h-4 w-32 bg-gray-200 rounded animate-pulse mb-2' />
                      <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Selection Skeleton */}
              <div>
                <div className='h-6 w-40 bg-gray-200 rounded animate-pulse mb-4' />
                <div className='space-y-3'>
                  <div>
                    <div className='h-4 w-32 bg-gray-200 rounded animate-pulse mb-2' />
                    <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div>
                    <div className='h-4 w-40 bg-gray-200 rounded animate-pulse mb-2' />
                    <div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div>
                    <div className='h-4 w-32 bg-gray-200 rounded animate-pulse mb-2' />
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className='h-8 w-32 bg-gray-200 rounded-lg animate-pulse'
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : data ? (
            <div className='space-y-6'>
              {/* Company Information */}
              <div className='border-b border-gray-200 pb-4'>
                <h3 className='text-lg font-semibold text-[#7839EE] mb-4'>
                  Company Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Full Name</p>
                    <p className='text-base font-medium text-gray-900'>
                      {data.full_name}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Company Name</p>
                    <p className='text-base font-medium text-gray-900'>
                      {data.company_name}
                    </p>
                  </div>
                  <div className='md:col-span-2'>
                    <p className='text-sm text-gray-500 mb-1'>Business Email</p>
                    <p className='text-base font-medium text-gray-900'>
                      {data.business_email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Setup */}
              <div className='border-b border-gray-200 pb-4'>
                <h3 className='text-lg font-semibold text-[#7839EE] mb-4'>
                  Current Setup
                </h3>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>Setup Type</p>
                  <p className='text-base font-medium text-gray-900'>
                    {SETUP_TYPE_LABELS[data.current_setup] ||
                      data.current_setup}
                  </p>
                </div>
              </div>

              {/* About Your Business */}
              <div className='border-b border-gray-200 pb-4'>
                <h3 className='text-lg font-semibold text-[#7839EE] mb-4'>
                  About Your Business
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>
                      Number of Staff
                    </p>
                    <p className='text-base font-medium text-gray-900'>
                      {data.number_of_staff}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>Industry</p>
                    <p className='text-base font-medium text-gray-900'>
                      {data.industry || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>
                      Annual Turnover
                    </p>
                    <p className='text-base font-medium text-gray-900'>
                      {data.annual_turnover_band}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>
                      Monthly Transactions
                    </p>
                    <p className='text-base font-medium text-gray-900'>
                      {data.monthly_transactions}
                    </p>
                  </div>
                  {data.hours_spent_per_month && (
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>
                        Hours Spent per Month
                      </p>
                      <p className='text-base font-medium text-gray-900'>
                        {data.hours_spent_per_month}
                      </p>
                    </div>
                  )}
                  {data.owner_hourly_value > 0 && (
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>
                        Owner Hourly Value
                      </p>
                      <p className='text-base font-medium text-gray-900'>
                        {formatCurrency(data.owner_hourly_value)}
                      </p>
                    </div>
                  )}
                  {data.owner_hours_per_month && (
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>
                        Owner Hours per Month
                      </p>
                      <p className='text-base font-medium text-gray-900'>
                        {data.owner_hours_per_month}
                      </p>
                    </div>
                  )}
                  {data.current_monthly_spend_internal && (
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>
                        Current Monthly Spend (Internal)
                      </p>
                      <p className='text-base font-medium text-gray-900'>
                        {formatCurrency(data.current_monthly_spend_internal)}
                      </p>
                    </div>
                  )}
                  {data.current_monthly_spend_external && (
                    <div>
                      <p className='text-sm text-gray-500 mb-1'>
                        Current Monthly Spend (External)
                      </p>
                      <p className='text-base font-medium text-gray-900'>
                        {formatCurrency(data.current_monthly_spend_external)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <h3 className='text-lg font-semibold text-[#7839EE] mb-4'>
                  Service Selection
                </h3>
                <div className='space-y-3'>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>
                      Reporting Frequency
                    </p>
                    <p className='text-base font-medium text-gray-900'>
                      {data.reporting_frequency}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>
                      Transaction Volume Band
                    </p>
                    <p className='text-base font-medium text-gray-900'>
                      {data.transaction_volume_band}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-500 mb-1'>
                      Selected Services
                    </p>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {data.selected_services &&
                      data.selected_services.length > 0 ? (
                        data.selected_services.map(serviceId => (
                          <span
                            key={serviceId}
                            className='px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium'
                          >
                            {SERVICE_LABELS[serviceId] || serviceId}
                          </span>
                        ))
                      ) : (
                        <p className='text-base text-gray-500'>
                          No additional services selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-600'>No data available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='border-t border-gray-200 p-6 flex justify-end'>
          <Button onClick={onClose} color='primary'>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
