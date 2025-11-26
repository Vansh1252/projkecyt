'use client'

import OptionCardsGrid, { type Option } from '@/components/option-cards-grid'
import type { Service } from '@/utils/type'

export type { Service }

interface AdditionalServicesProps {
  services: Service[]
  selectedServices: string[]
  onToggleService: (serviceId: string) => void
}

export default function AdditionalServices({
  services,
  selectedServices,
  onToggleService,
}: AdditionalServicesProps) {
  // Convert services to options format
  const options: Option[] = services.map(service => ({
    id: service.id,
    title: service.title,
    description: service.description,
    icon: service.icon,
    tooltip: service.tooltip,
    tooltipDescription: service.tooltipDescription,
  }))

  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-semibold text-gray-900 sm:text-xl'>
        Additional Services
      </h2>
      <OptionCardsGrid
        options={options}
        selectedOptions={selectedServices}
        onSelect={onToggleService}
        useCheckbox={true}
      />
    </div>
  )
}
