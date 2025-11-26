'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts'
import { ChartTooltipContent } from '@/components/application/charts/charts-base'

interface CostComparisonChartProps {
  currentSetupMonthly: number
  sanayCostMonthly: number
}

export default function CostComparisonChart({
  currentSetupMonthly,
  sanayCostMonthly,
}: CostComparisonChartProps) {
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Prepare data for the chart
  const data = [
    {
      name: 'Current Setup',
      value: currentSetupMonthly,
      fill: '#E4E7EC', // Light grey
    },
    {
      name: 'Sanay System',
      value: sanayCostMonthly,
      fill: '#7839EE', // Purple
    },
  ]

  // Y-axis max is always 2000 as per design
  const yAxisMax = 2000
  const yAxisTicks = [0, 500, 1000, 1500, 2000]

  // Custom tooltip formatter - matches ChartTooltipContent signature
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tooltipFormatter = (value: any) => {
    // Handle different value types from recharts
    let numValue: number
    if (typeof value === 'number') {
      numValue = value
    } else if (typeof value === 'string') {
      numValue = parseFloat(value)
    } else if (Array.isArray(value)) {
      numValue =
        typeof value[0] === 'number' ? value[0] : parseFloat(String(value[0]))
    } else {
      return String(value)
    }

    if (isNaN(numValue)) return String(value)
    return formatCurrency(numValue)
  }

  return (
    <div className='w-full h-[260px]'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
          barCategoryGap='35%'
        >
          <CartesianGrid
            strokeDasharray='3 3'
            vertical={false}
            stroke='#E4E7EC'
            strokeWidth={1}
          />
          <XAxis
            dataKey='name'
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#1a1a1a', fontSize: 14, fontWeight: 500 }}
            height={40}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#535862', fontSize: 12 }}
            domain={[0, yAxisMax]}
            tickFormatter={value => `£${value}`}
            ticks={yAxisTicks}
            width={60}
          />
          <Tooltip
            content={
              <ChartTooltipContent
                formatter={tooltipFormatter}
                labelFormatter={label => label}
              />
            }
          />
          <Bar dataKey='value' radius={[8, 8, 0, 0]} barSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
