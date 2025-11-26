/**
 * Centralized constants for the Sanay Quoting Tool
 * All static data, arrays, and constant values should be exported from here
 */

import {
  File05,
  Users02,
  Phone01,
  Building04,
  TrendUp02,
  BarChart02,
  LinkExternal01,
} from '@untitledui/icons'
import type { Service, Option } from '@/utils/type'
import type { SelectItemType } from '@/components/base/select/select'

// ============================================================================
// Stepper Steps
// ============================================================================

export const FORM_STEPS: string[] = [
  'Your Details',
  'Current Setup',
  'About Your Business',
  'Service Selection',
  'Result Screen',
]

// ============================================================================
// Setup Options
// ============================================================================

export const SETUP_OPTIONS: Option[] = [
  {
    id: 'owner-led',
    title: 'Owner-Led',
    description: 'You handle finance operations yourself',
    icon: Users02,
    tooltip: 'You handle most finance tasks yourself.',
  },
  {
    id: 'internal-team',
    title: 'Internal Team',
    description: 'You handle finance operations yourself',
    icon: Building04,
    tooltip: 'Your employees manage finance operations in-house.',
  },
  {
    id: 'external-agency',
    title: 'External Agency',
    description: 'You outsource to an external provider',
    icon: File05,
    tooltip: 'You outsource most finance work to an accountant or agency.',
  },
  {
    id: 'hybrid',
    title: 'Hybrid Setup',
    description: 'Mix of internal and external',
    icon: LinkExternal01,
    tooltip: 'A mix of in-house and outsourced finance support.',
  },
]

export const SETUP_TYPE_LABELS: Record<string, string> = {
  owner_led: 'Owner-led',
  internal: 'Internal Team',
  external: 'External Agency',
  hybrid: 'Hybrid',
}

// ============================================================================
// Services
// ============================================================================

export const SERVICES: Service[] = [
  {
    id: 'vat-returns',
    title: 'VAT Returns',
    description: 'Quarterly VAT filing',
    icon: File05,
    tooltip: 'VAT Returns',
    tooltipDescription:
      'We handle your quarterly VAT filing and submission to HMRC.',
  },
  {
    id: 'payroll',
    title: 'Payroll',
    description: 'Staff payment processing',
    icon: Users02,
    tooltip: 'Payroll',
    tooltipDescription:
      'Complete payroll processing including salary calculations, tax deductions, and payslip generation.',
  },
  {
    id: 'management-accounts',
    title: 'Management Accounts',
    description: 'Monthly P&L, balance sheet',
    icon: TrendUp02,
    tooltip: 'Management Accounts',
    tooltipDescription:
      'Monthly profit & loss statements and balance sheets to help you track business performance.',
  },
  {
    id: 'credit-control',
    title: 'Credit Control',
    description: 'Chasing outstanding invoices',
    icon: Phone01,
    tooltip: 'Credit Control',
    tooltipDescription:
      'Professional invoice chasing and debt collection services to improve cash flow.',
  },
  {
    id: 'budgeting-forecasting',
    title: 'Budgeting & Cashflow Forecasting',
    description: 'Future cash predictions',
    icon: BarChart02,
    tooltip: 'Budgeting & Cashflow Forecasting',
    tooltipDescription:
      'Financial planning and cashflow forecasting to help you make informed business decisions.',
  },
  {
    id: 'financial-analysis',
    title: 'Financial Analysis',
    description: 'Review of business performance and key financial metrics',
    icon: Building04,
    tooltip: 'Financial Analysis',
    tooltipDescription:
      'In-depth analysis of your business performance, key metrics, and financial health indicators.',
  },
  {
    id: 'CFO Advisory',
    title: 'CFO Advisory',
    description: 'Strategic financial guidance',
    icon: Building04,
    tooltip: 'CFO Advisory',
    tooltipDescription:
      'Shows recommended services based on businesses similar to yours.',
  },
]

export const SERVICE_LABELS: Record<string, string> = {
  'vat-returns': 'VAT Returns',
  VAT: 'VAT Returns',
  payroll: 'Payroll',
  PR: 'Payroll',
  'management-accounts': 'Management Accounts',
  MA: 'Management Accounts',
  'financial-analysis': 'Financial Analysis',
  FA: 'Financial Analysis',
  'budgeting-forecasting': 'Budgeting & Cashflow Forecasting',
  FCF: 'Budgeting & Cashflow Forecasting',
  'credit-control': 'Credit Control',
  CC: 'Credit Control',
  CFO: 'CFO Services',
}

// ============================================================================
// Reporting Frequency Options
// ============================================================================

export const REPORTING_FREQUENCY_OPTIONS: string[] = ['Monthly', 'Quarterly']

export const REPORTING_FREQUENCY_SELECT_ITEMS: SelectItemType[] =
  REPORTING_FREQUENCY_OPTIONS.map(option => ({
    id: option,
    label: option,
  }))

// ============================================================================
// Transaction Volume Options
// ============================================================================

export const TRANSACTION_VOLUME_OPTIONS: string[] = [
  '1-100/month',
  '101-200/month',
  '201-300/month',
  '301-400/month',
  '401-500/month',
  '501-650/month',
  '651-800/month',
  '801-1000/month',
  '1001-1250/month',
  '1251-1500/month',
  '1501-1750/month',
  '1751-2000/month',
  '2000+/month',
]

export const TRANSACTION_VOLUME_SELECT_ITEMS: SelectItemType[] =
  TRANSACTION_VOLUME_OPTIONS.map(option => ({
    id: option,
    label: option,
  }))

// ============================================================================
// Turnover Options
// ============================================================================

export const TURNOVER_OPTIONS: string[] = [
  '£0 - £125k',
  '£125k - £500k',
  '£500k - £1M',
  '£1M - £5M',
  '£5M - £10M',
  '£10M - £20M',
  '£20M+',
]

export const TURNOVER_SELECT_ITEMS: SelectItemType[] = TURNOVER_OPTIONS.map(
  option => ({
    id: option,
    label: option,
  })
)
