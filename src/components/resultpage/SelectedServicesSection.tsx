'use client'

import type { ServiceItem } from '@/utils/type'

export type { ServiceItem }

interface SelectedServicesSectionProps {
  services: ServiceItem[]
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)

export default function SelectedServicesSection({
  services,
}: SelectedServicesSectionProps) {
  if (!services || services.length === 0) return null

  return (
    <div className='xl:w-[1216px] mb-10 rounded-2xl border border-[#E4E7EC] bg-white shadow-sm'>
      {/* Header */}
      <div className='px-4 py-4 sm:px-6 sm:py-5 border-b border-[#E4E7EC]'>
        <p className='text-sm font-medium text-[#101828]'>Selected Services</p>
      </div>

      {/* Rows */}
      <div className='divide-y divide-[#E4E7EC]'>
        {services.map((service, idx) => (
          <div
            key={idx}
            className='flex flex-col sm:flex-row sm:items-center justify-between px-4 py-4 sm:px-6 sm:py-5 gap-2 sm:gap-4'
          >
            {/* Left: name + description */}
            <div>
              <p className='text-sm sm:text-base font-medium text-[#101828]'>
                {service.name}
              </p>
              <p className='text-xs sm:text-sm text-[#6B7280] mt-1'>
                {service.description}
              </p>
            </div>

            {/* Right: price + period */}
            <div className='text-right shrink-0'>
              <p className='text-base sm:text-lg font-semibold text-[#7839EE]'>
                {formatPrice(service.price)}
              </p>
              <p className='text-xs sm:text-sm text-[#6B7280]'>
                {service.billing_period || 'per month'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
