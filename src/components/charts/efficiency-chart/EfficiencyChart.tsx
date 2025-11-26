'use client'

interface EfficiencyChartProps {
  efficiencyIndex: number
}

export default function EfficiencyChart({
  efficiencyIndex,
}: EfficiencyChartProps) {
  // Calculate the efficiency percentage (0-100)
  const efficiencyPercentage = Math.round(efficiencyIndex)

  // SVG circle calculations
  const size = 220
  const strokeWidth = 8 // Thicker stroke for the purple arc
  const backgroundStrokeWidth = 8 // Thin stroke for the gray background
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Calculate stroke-dasharray and stroke-dashoffset for the progress
  const offset = circumference - (efficiencyPercentage / 100) * circumference

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <div className='relative w-[220px] h-[220px]'>
        <svg width={size} height={size} className='transform -rotate-90'>
          {/* Background circle (thin gray ring) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            stroke='#E4E7EC'
            strokeWidth={backgroundStrokeWidth}
          />

          {/* Progress circle (thick purple arc) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill='none'
            stroke='#7839EE'
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className='transition-all duration-1000 ease-out'
          />
        </svg>

        {/* Center text */}
        <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
          <span className='text-5xl font-bold text-gray-900 leading-none'>
            {efficiencyPercentage}%
          </span>
          <span className='text-base text-gray-600 mt-2 font-medium'>
            Efficiency
          </span>
        </div>
      </div>
    </div>
  )
}
