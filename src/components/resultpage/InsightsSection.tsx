'use client'

import type { QuoteData } from '@/utils/type'

interface InsightsSectionProps {
  quoteData: QuoteData
  sanayCostGreaterThanCurrentSetup: boolean
}

export default function InsightsSection({
  quoteData,
  sanayCostGreaterThanCurrentSetup,
}: InsightsSectionProps) {
  const renderTipsList = (raw: string) => {
    try {
      const tips = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (Array.isArray(tips)) {
        return (
          <ul className='list-disc list-inside space-y-2'>
            {tips.map((tip: string, index: number) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        )
      }
      return <p>{raw}</p>
    } catch {
      return <p>{raw}</p>
    }
  }

  const renderSanayTips = (raw: string) => {
    try {
      const tips = typeof raw === 'string' ? JSON.parse(raw) : raw
      if (Array.isArray(tips)) {
        return (
          <div className='space-y-3'>
            {tips.map((tip: string, index: number) => (
              <p key={index}>{tip}</p>
            ))}
          </div>
        )
      }
      return <p>{raw}</p>
    } catch {
      const cleaned = raw
        .replace(/^\[|\]$/g, '')
        .replace(/^"|"$/g, '')
        .replace(/","/g, '\n')
        .replace(/"/g, '')
      return <p>{cleaned}</p>
    }
  }

  return (
    <div className='xl:w-[1216px] flex flex-col md:flex-row flex-wrap gap-4 mb-16'>
      {sanayCostGreaterThanCurrentSetup && (
        <div className='flex flex-col md:flex-row gap-4 w-full'>
          <div className='w-full md:w-1/2 border border-[#E4E7EC] rounded-2xl p-5 shadow-sm'>
            <h3 className='font-semibold text-xl mb-2'>Insight</h3>
            <div className='text-[#535862]'>
              {renderSanayTips(quoteData.ai_sanay_tips)}
            </div>
          </div>

          <div className='w-full md:w-1/2 border border-[#E4E7EC] rounded-2xl p-5 shadow-sm'>
            <h3 className='font-semibold text-xl mb-2'>Sanay Insight</h3>
            <div className='text-[#535862]'>
              {renderSanayTips(quoteData.ai_extra_tips)}
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col md:flex-row gap-4 w-full'>
        <div className='w-full md:w-1/2 border border-[#E4E7EC] rounded-2xl p-5 shadow-sm'>
          <h3 className='font-semibold text-xl mb-2'>Tip</h3>
          <div className='text-[#535862]'>
            {renderTipsList(quoteData.ai_tips)}
          </div>
        </div>

        <div className='w-full md:w-1/2 border border-[#E4E7EC] rounded-2xl p-5 shadow-sm'>
          <h3 className='font-semibold text-xl mb-2'>AI Summary</h3>
          <p className='text-[#535862]'>{quoteData.ai_summary}</p>
        </div>
      </div>
    </div>
  )
}
