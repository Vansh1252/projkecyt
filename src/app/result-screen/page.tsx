'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import ResultHeader from '@/components/resultpage/ResultHeader'
import StatsSummaryRow from '@/components/resultpage/StatsSummaryRow'
import CostEfficiencySection from '@/components/resultpage/CostEfficiencySection'
import InsightsSection from '@/components/resultpage/InsightsSection'
import SelectedServicesSection, {
  ServiceItem,
} from '@/components/resultpage/SelectedServicesSection'

import { Button } from '@/components/base/buttons/button'
import ResultScreenSkeleton from '@/components/skeleton-loader/result-screen-skeleton'
import ReviewInputModal from '@/components/resultpage/review-input-modal/review-input-modal'
import { clearFormData } from '@/utils/sessionStorage'
import type { UserInputData, QuoteData } from '@/utils/type'
import { FORM_STEPS } from '@/utils/constants/constants'
import { axiosInstance } from '@/utils/axios'

export default function ResultScreen() {
  const [quoteId, setQuoteId] = useState<string | null>(null)
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewData, setReviewData] = useState<UserInputData | null>(null)
  const router = useRouter()
  const hasClearedOnRefresh = useRef(false)

  useEffect(() => {
    const storedQuoteId =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('pendingQuoteId')
        : null

    if (!storedQuoteId) {
      setError('No quote ID found. Please go back and generate a quote.')
      setLoading(false)
      return
    }

    setQuoteId(storedQuoteId)

    const loadQuoteData = async () => {
      try {
        // Fetch both quote data and review input data in parallel
        const [quoteResponse, reviewResponse] = await Promise.all([
          axiosInstance.get(`/api/report/${storedQuoteId}`),
          axiosInstance.get(`/api/review_input/${storedQuoteId}`),
        ])

        // Handle quote data
        const quoteJson = quoteResponse.data
        if (Array.isArray(quoteJson) && quoteJson.length > 0) {
          setQuoteData(quoteJson[0])
        } else if (quoteJson && !Array.isArray(quoteJson)) {
          setQuoteData(quoteJson)
        } else {
          throw new Error('No quote data found')
        }

        // Handle review input data (non-blocking)
        if (reviewResponse.data.ok && reviewResponse.data.data) {
          setReviewData(reviewResponse.data.data)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load quote data.'
        )
        // eslint-disable-next-line no-console
        console.error('Error loading quote data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadQuoteData()
  }, [])

  // Clear session and redirect on page refresh (but not on back button click)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const navigationEntry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined
    const isRefresh = navigationEntry?.type === 'reload'

    if (isRefresh && !hasClearedOnRefresh.current) {
      clearFormData()
      sessionStorage.removeItem('pendingQuoteId')
      sessionStorage.removeItem('isGeneratingQuote')
      hasClearedOnRefresh.current = true
      router.push('/company-information')
    }
  }, [router])

  const handleBackClick = () => {
    router.push('/service_selection')
  }

  // Map numeric cost columns -> UI services list
  const mapServicesFromQuote = (quote: QuoteData): ServiceItem[] => {
    const services: ServiceItem[] = []

    const serviceDefinitions: Record<
      keyof QuoteData,
      { name: string; description: string } | undefined
    > = {
      // existing fields we don't map
      sanay_cost_monthly: undefined,
      sanay_cost_annual: undefined,
      current_setup_cost_annual: undefined,
      savings_annual: undefined,
      savings_monthly: undefined,
      efficiency_index: undefined,
      ai_summary: undefined,
      ai_tips: undefined,
      ai_extra_tips: undefined,
      ai_sanay_tips: undefined,

      // service fields
      bk_cost: {
        name: 'Bookkeeping',
        description: 'Monthly bookkeeping & transaction categorisation',
      },
      bku_cost: {
        name: 'Monthly Reporting Uplift',
        description:
          'Additional charge for monthly reporting with low transaction volume',
      },
      pr_cost: {
        name: 'Payroll Processing',
        description: 'Up to 10 employees, monthly payroll run',
      },
      vat_cost: {
        name: 'VAT Returns',
        description: 'Quarterly VAT submission & compliance',
      },
      ma_cost: {
        name: 'Management Accounts',
        description: 'Monthly P&L, balance sheet & analysis',
      },
      fa_cost: {
        name: 'Final Accounts',
        description: 'Annual accounts & tax submissions',
      },
      fcf_cost: {
        name: 'Forecasting',
        description: 'Financial forecasting & planning',
      },
      cfo_cost: {
        name: 'Fractional CFO',
        description: 'Senior finance support for strategy & scaling',
      },
      cc_cost: {
        name: 'Company Compliance',
        description: 'Annual confirmation filing & compliance',
      },
    }

    ;(
      [
        'bk_cost',
        'bku_cost',
        'pr_cost',
        'vat_cost',
        'ma_cost',
        'fa_cost',
        'fcf_cost',
        'cfo_cost',
        'cc_cost',
      ] as (keyof QuoteData)[]
    ).forEach(key => {
      const cost = quote[key] as number | null
      const def = serviceDefinitions[key]

      if (def && cost !== null && cost !== undefined) {
        services.push({
          name: def.name,
          description: def.description,
          price: cost,
          billing_period: 'per month',
        })
      }
    })

    return services
  }

  // If the efficiency is negative we show 0
  let efficiencyValue = 0
  if (quoteData?.efficiency_index && quoteData.efficiency_index > 0) {
    efficiencyValue = quoteData.efficiency_index
  }

  if (loading) {
    return <ResultScreenSkeleton />
  }

  if (error || !quoteData) {
    return (
      <div className='xl:w-[1216px] m-auto bg-white min-h-screen flex flex-col items-center justify-center px-4 pb-10 sm:px-6 md:px-10'>
        <div className='text-center'>
          <p className='text-lg text-red-600 mb-4'>
            {error || 'No quote data available'}
          </p>
          <Link href='/service_selection'>
            <Button>Go Back to Service Selection</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentSetupMonthly = quoteData.current_setup_cost_annual / 12
  const sanayCostGreaterThanCurrentSetup =
    quoteData.sanay_cost_monthly > currentSetupMonthly

  const selectedServices = mapServicesFromQuote(quoteData)

  return (
    <>
      <div className='xl:w-[1216px] m-auto bg-white min-h-screen flex flex-col items-center px-4 pb-10 sm:px-6 md:px-10'>
        <ResultHeader
          steps={FORM_STEPS}
          onBack={handleBackClick}
          quoteId={quoteId}
        />

        <StatsSummaryRow
          currentSetupMonthly={currentSetupMonthly}
          sanayCostMonthly={quoteData.sanay_cost_monthly}
          savingsMonthly={quoteData.savings_monthly}
          savingsAnnual={quoteData.savings_annual}
        />

        {/* review input */}
        <p className='text-[#535862] mb-12'>
          <button
            onClick={() => {
              setShowReviewModal(true)
            }}
            className='underline hover:text-[#7839EE] transition-colors'
          >
            Review your inputs
          </button>
        </p>

        {/* Selected Services (between review + charts) */}
        {selectedServices.length > 0 && (
          <SelectedServicesSection services={selectedServices} />
        )}

        <CostEfficiencySection
          currentSetupMonthly={currentSetupMonthly}
          sanayCostMonthly={quoteData.sanay_cost_monthly}
          efficiencyIndex={efficiencyValue}
        />

        <InsightsSection
          quoteData={quoteData}
          sanayCostGreaterThanCurrentSetup={sanayCostGreaterThanCurrentSetup}
        />
      </div>

      <ReviewInputModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false)
        }}
        data={reviewData}
        loading={loading}
      />
    </>
  )
}
