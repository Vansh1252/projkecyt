import { HelpCircle } from '@untitledui/icons'
import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip'

interface BoxCardProps {
  title: string
  amount: string
  amountColor?: string
  subtitle?: string
  highlight?: boolean
  tooltip?: string
}

export default function BoxCard({
  title,
  amount,
  subtitle = '/month',
  amountColor = 'text-gray-900',
  highlight = false,
  tooltip = 'More info',
}: BoxCardProps) {
  return (
    <div
      className={`w-full rounded-2xl border shadow-sm p-5 ${highlight ? 'border-[#E9EAEB] bg-[#F8F9FA]' : 'bg-white border-gray-200'}`}
    >
      {/* Header */}
      <div className='flex items-start justify-between gap-3 mb-4'>
        <h2 className='text-lg font-semibold text-gray-900 wrap-break-word'>
          {title}
        </h2>

        {/* Tooltip */}
        <Tooltip title={tooltip} placement='top' delay={200}>
          <TooltipTrigger
            className='group relative flex cursor-pointer items-center justify-center 
            text-gray-500 hover:text-gray-600 transition'
            style={{ isolation: 'isolate' }}
          >
            <div className='w-6 h-6 flex items-center justify-center rounded-full border border-gray-300'>
              <HelpCircle className='size-4' />
            </div>
          </TooltipTrigger>
        </Tooltip>
      </div>

      {/* Divider */}
      <div className='h-px w-full bg-gray-200 mb-4' />

      {/* Amount */}
      <p className={`text-4xl font-semibold ${amountColor}`}>
        {amount}{' '}
        <span className='text-xl font-normal text-gray-500'>{subtitle}</span>
      </p>
    </div>
  )
}
