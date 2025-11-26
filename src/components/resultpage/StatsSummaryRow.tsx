'use client'

import BoxCard from '@/components/base/boxcard/BoxCard'

interface StatsSummaryRowProps {
  currentSetupMonthly: number
  sanayCostMonthly: number
  savingsMonthly: number
  savingsAnnual: number
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function StatsSummaryRow({
  currentSetupMonthly,
  sanayCostMonthly,
  savingsMonthly,
  savingsAnnual,
}: StatsSummaryRowProps) {
  return (
    <div className='xl:w-[1216px] flex flex-wrap xl:flex-nowrap gap-6 my-5 place-items-center'>
      <BoxCard
        title='Current Setup'
        amount={formatCurrency(currentSetupMonthly)}
        tooltip='Your current monthly cost'
      />

      <BoxCard
        title='Sanay Cost'
        amount={formatCurrency(sanayCostMonthly)}
        amountColor='text-[#E5B800]'
        highlight
        tooltip='Your estimated monthly cost using Sanay'
      />

      <BoxCard
        title='Monthly Savings'
        amount={formatCurrency(savingsMonthly)}
        amountColor='text-[#12B76A]'
        tooltip='Savings = Current Setup - Sanay Cost'
      />

      <BoxCard
        title='Annual Savings'
        amount={formatCurrency(savingsAnnual)}
        amountColor='text-[#6941C6]'
        tooltip='Monthly Savings × 12'
      />
    </div>
  )
}
