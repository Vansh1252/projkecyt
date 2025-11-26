'use client'

import EfficiencyChart from '@/components/charts/efficiency-chart/EfficiencyChart'
import CostComparisonChart from '@/components/charts/cost-comparison-chart/CostComparisonChart'

interface CostEfficiencySectionProps {
  currentSetupMonthly: number
  sanayCostMonthly: number
  efficiencyIndex: number
}

const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`
}

export default function CostEfficiencySection({
  currentSetupMonthly,
  sanayCostMonthly,
  efficiencyIndex,
}: CostEfficiencySectionProps) {
  return (
    <div className='xl:w-[1216px] mb-14 grid grid-cols-1 md:grid-cols-2 gap-4'>
      {/* Cost Comparison */}
      <div className='w-full border border-[#E4E7EC] rounded-2xl p-8 shadow-sm'>
        <h2 className='font-semibold text-2xl mb-6'>Cost Comparison</h2>

        <CostComparisonChart
          currentSetupMonthly={currentSetupMonthly}
          sanayCostMonthly={sanayCostMonthly}
        />
      </div>

      {/* Efficiency Score */}
      <div className='w-full border border-[#E4E7EC] rounded-2xl p-8 shadow-sm'>
        <h2 className='font-semibold text-2xl mb-6'>Efficiency Score</h2>

        <div className='flex flex-col items-center gap-6'>
          <EfficiencyChart efficiencyIndex={efficiencyIndex} />

          <p className='text-[#535862] text-lg text-center max-w-md'>
            You'll gain {formatPercentage(efficiencyIndex)} more efficiency with
            our streamlined processes.
          </p>
        </div>
      </div>
    </div>
  )
}
