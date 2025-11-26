import * as Yup from 'yup'
import type {
  SetupOption,
  CalculationData,
  AboutBusinessFormValues,
} from '@/utils/type'

export const asNumber = (label: string) =>
  Yup.number()
    .typeError(`${label} must be a number`)
    .transform(value => (Number.isNaN(value) ? undefined : value))

export const createValidationSchema = (setupType: SetupOption) => {
  const showExternalCost =
    setupType === 'external-agency' || setupType === 'hybrid'

  return Yup.object({
    numberOfStaff: asNumber('Number of staff')
      .required('Number of staff is required')
      .min(1, 'Number of staff must be at least 1'),
    industry: Yup.string(),
    annualTurnover: Yup.string().required('Annual turnover is required'),
    hoursSpent: asNumber('Hours spent')
      .required('Hours spent is required')
      .min(1, 'Hours must be at least 1')
      .max(180, 'Hours cannot exceed 180'),
    monthlyTransactionVolume: asNumber('Monthly transaction volume')
      .required('Monthly transaction volume is required')
      .min(1, 'Transaction volume must be at least 1'),
    hourlyValue: asNumber('Hourly value')
      .min(0, 'Hourly value cannot be negative')
      .notRequired(),
    internalCost: asNumber('Internal cost')
      .min(0, 'Internal cost cannot be negative')
      .notRequired(),
    currentExternalCost: asNumber('Current external cost')
      .min(0, 'Current external cost cannot be negative')
      .test('external-required', 'Current external cost is required', value => {
        if (!showExternalCost) return true
        return value !== undefined && value !== null && Number(value) > 0
      }),
    estimatedHoursSpent: Yup.number()
      .transform(value => (Number.isNaN(value) ? undefined : value))
      .when([], {
        is: () => setupType === 'owner-led',
        then: schema =>
          schema
            .required('Estimated hours spent is required')
            .min(1, 'Estimated hours must be at least 1'),
        otherwise: schema => schema.notRequired(), // No min validation
      }),
  })
}

// Helper Functions

export const parseTurnoverBand = (
  band: string
): { min: number; max: number } => {
  const clean = band.replace(/£/g, '').replace(/,/g, '').trim()

  if (clean.includes('+')) {
    const min = parseFloat(clean.replace('+', '').replace(/[mMkK]/g, ''))
    const multiplier =
      clean.includes('m') || clean.includes('M')
        ? 1000000
        : clean.includes('k') || clean.includes('K')
          ? 1000
          : 1
    return { min: min * multiplier, max: Infinity }
  }

  const parts = clean.split(/[-–]/).map(p => p.trim())
  if (parts.length === 2) {
    const parseValue = (val: string) => {
      const num = parseFloat(val.replace(/[mMkK]/g, ''))
      const multiplier =
        val.includes('m') || val.includes('M')
          ? 1000000
          : val.includes('k') || val.includes('K')
            ? 1000
            : 1
      return num * multiplier
    }
    return { min: parseValue(parts[0]), max: parseValue(parts[1]) }
  }

  return { min: 0, max: 0 }
}

export const getOwnerHourlyKey = (annualTurnover: string): string | null => {
  if (!annualTurnover) return null

  const { min, max } = parseTurnoverBand(annualTurnover)

  // Check ranges in order from smallest to largest
  if (max <= 125000) return 'under125k'
  if (min >= 125000 && max <= 500000) return '125k_500k'
  if (min >= 500000 && max <= 1000000) return '500k_1m'
  if (min >= 1000000 && max <= 5000000) return '1m_5m'
  if (min >= 5000000 && max <= 10000000) return '5m_10m'
  if (min >= 10000000 && max <= 20000000) return '10m_20m'
  // For ranges that exceed 20m or have max = Infinity
  return 'over20m'
}

export const calculateOwnerHourlyValue = (
  annualTurnover: string,
  calculationData: CalculationData | null
): number | null => {
  if (!calculationData || !annualTurnover) return null

  const key = getOwnerHourlyKey(annualTurnover)
  if (!key) return null

  return (
    calculationData.ownerHourlyValues[
      key as keyof typeof calculationData.ownerHourlyValues
    ] || null
  )
}

export const calculateInternalCostClient = (
  annualTurnover: string,
  calculationData: CalculationData | null
): number | null => {
  if (!calculationData || !annualTurnover) return null

  const { min, max } = parseTurnoverBand(annualTurnover)

  // Find role mix rule where revenue range overlaps
  const roleMix = calculationData.roleMixRules.find(
    rule => rule.revenue_min <= max && rule.revenue_max >= min
  )

  if (!roleMix) return null

  // Calculate base cost from role mix and salaries
  const roles = [
    { fte: roleMix.bk_fte, role: 'Bookkeeper' },
    { fte: roleMix.acct_fte, role: 'Accountant' },
    { fte: roleMix.fc_fte, role: 'Financial Controller' },
    { fte: roleMix.fd_fte, role: 'Finance Director' },
    { fte: roleMix.cfo_fte, role: 'CFO' },
    { fte: roleMix.cc_fte, role: 'Credit Controller' },
  ]

  let baseCost = 0
  for (const { fte, role } of roles) {
    if (fte > 0) {
      const salary = calculationData.salaries[role] || 0
      baseCost += Number(fte) * salary
    }
  }

  // Apply multipliers
  const {
    employeeOncostPct,
    inefficiencyPctInternal,
    mgmtOverheadPctInternal,
  } = calculationData.costPercentages
  const totalMultiplier =
    1 + employeeOncostPct + inefficiencyPctInternal + mgmtOverheadPctInternal

  const annualCost = baseCost * totalMultiplier
  const monthlyCost = annualCost / 12

  return Math.round(monthlyCost * 100) / 100
}

// ============================================================================
// Form Submission Constants and Helpers
// ============================================================================

export const BASE_REQUIRED_FIELDS: (keyof AboutBusinessFormValues)[] = [
  'numberOfStaff',
  'annualTurnover',
  'hoursSpent',
  'monthlyTransactionVolume',
  'estimatedHoursSpent',
]

export const isExternalCostRequired = (setupType: SetupOption): boolean => {
  return setupType === 'external-agency' || setupType === 'hybrid'
}

export const getRequiredFields = (
  setupType: SetupOption
): (keyof AboutBusinessFormValues)[] => {
  const fields: (keyof AboutBusinessFormValues)[] = [...BASE_REQUIRED_FIELDS]

  if (isExternalCostRequired(setupType)) {
    fields.push('currentExternalCost')
  }

  return fields
}

export const createUserInputPayload = (
  userInputId: string | number,
  formValues: AboutBusinessFormValues
) => {
  return {
    id: userInputId,
    numberOfStaff: Number(formValues.numberOfStaff) || null,
    industry: formValues.industry || null,
    annualTurnover: formValues.annualTurnover || null,
    hoursSpent: Number(formValues.hoursSpent) || null,
    monthlyTransactionVolume:
      Number(formValues.monthlyTransactionVolume) || null,
    hourlyValue: Number(formValues.hourlyValue) || null,
    internalCost: Number(formValues.internalCost) || null,
    currentExternalCost: Number(formValues.currentExternalCost) || null,
    estimatedHoursSpent: Number(formValues.estimatedHoursSpent) || null,
  }
}
