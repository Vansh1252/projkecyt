/**
 * Centralized type definitions for the Sanay Quoting Tool
 * All types used across the application should be exported from here
 */

import type { ComponentType } from 'react'

// ============================================================================
// Setup & Configuration Types
// ============================================================================

export type SetupOption =
  | 'owner-led'
  | 'internal-team'
  | 'external-agency'
  | 'hybrid'

export type SetupType = 'owner_led' | 'internal' | 'external' | 'hybrid'

export type ReportingFrequency = 'Monthly' | 'Quarterly'

export interface CompanyInformationFormValues {
  fullName: string
  companyName: string
  businessEmail: string
  agreeToTerms: boolean
}

export interface AboutBusinessFormValues {
  numberOfStaff: string
  industry: string
  annualTurnover: string
  hoursSpent: string
  monthlyTransactionVolume: string
  hourlyValue: string
  internalCost: string
  currentExternalCost: string
  estimatedHoursSpent: string
}

export interface ServiceSelectionFormValues {
  reportingFrequency: string
  transactionVolume: string
  selectedServices: string[]
}

export interface UserInput {
  id: number
  full_name: string
  company_name: string
  business_email: string
  current_setup: SetupType
  number_of_staff: number
  industry: string | null
  annual_turnover_band: string
  hours_spent_per_month: number | null
  monthly_transactions: number
  owner_hourly_value: number
  owner_hours_per_month: number | null
  current_monthly_spend_internal: number | null
  current_monthly_spend_external: number | null
  reporting_frequency: ReportingFrequency
  transaction_volume_band: string
  selected_services: string[]
  created_at: string
}

export type UserInputData = UserInput

export interface QuoteData {
  sanay_cost_monthly: number
  sanay_cost_annual: number
  current_setup_cost_annual: number
  savings_annual: number
  savings_monthly: number
  efficiency_index: number
  ai_summary: string
  ai_tips: string
  ai_extra_tips: string
  ai_sanay_tips: string

  // Service cost columns from quotes table
  bk_cost: number | null
  bku_cost: number | null
  pr_cost: number | null
  vat_cost: number | null
  ma_cost: number | null
  fa_cost: number | null
  fcf_cost: number | null
  cfo_cost: number | null
  cc_cost: number | null
}

export interface SanayCostBreakdown {
  total: number
  bk_cost: number
  bku_cost: number | null
  pr_cost: number | null
  vat_cost: number | null
  ma_cost: number | null
  fa_cost: number | null
  fcf_cost: number | null
  cfo_cost: number | null
  cc_cost: number | null
}

export interface CalculationData {
  roleMixRules: Array<{
    revenue_min: number
    revenue_max: number
    bk_fte: number
    acct_fte: number
    fc_fte: number
    fd_fte: number
    cfo_fte: number
    cc_fte: number
  }>
  salaries: Record<string, number>
  costPercentages: {
    employeeOncostPct: number
    inefficiencyPctInternal: number
    mgmtOverheadPctInternal: number
  }
  ownerHourlyValues: {
    under125k: number
    '125k_500k': number
    '500k_1m': number
    '1m_5m': number
    '5m_10m': number
    '10m_20m': number
    over20m: number
  }
}

export interface Assumption {
  amount: number
  description?: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  tooltip?: string
  tooltipDescription?: string
}

export interface ServiceItem {
  name: string
  description: string
  price: number
  billing_period?: string // e.g. "per month"
}

export interface Option {
  id: string
  title: string
  description: string
  icon: ComponentType<{ className?: string }>
  tooltip?: string
  tooltipDescription?: string
}

export interface ReviewInputModalProps {
  isOpen: boolean
  onClose: () => void
  data: UserInput | null
  loading: boolean
}

// ============================================================================
// Session Storage Types (re-exported from sessionStorage.ts)
// ============================================================================

// Note: FormData is already exported from sessionStorage.ts
// Import it directly: import type { FormData } from '@/utils/sessionStorage'
