import { supabaseAdmin } from '@/lib/supabase'
import { OpenAI } from 'openai'
import type { UserInput, SanayCostBreakdown, Assumption } from '@/utils/type'
import { SERVICE_LABELS, SETUP_TYPE_LABELS } from '@/utils/constants/constants'

export type { UserInput, SanayCostBreakdown, Assumption }

// Main quote calculation function
export const calculateQuote = async (
  userInput: UserInput,
  existingQuoteId?: number
) => {
  try {
    // Calculate Sanay costs with breakdown
    const sanayCostBreakdown = await calculateSanayCostMonthly(userInput)
    const sanayCostMonthly = sanayCostBreakdown.total
    const sanayCostAnnual = sanayCostMonthly * 12

    // Calculate current setup costs
    const currentSetupCostAnnual =
      await calculateCurrentSetupCostAnnual(userInput)
    // Validate that we have a valid current setup cost
    if (!currentSetupCostAnnual || currentSetupCostAnnual <= 0) {
      throw new Error(
        `Invalid current setup cost calculated: ${currentSetupCostAnnual}. Setup type: ${userInput.current_setup}`
      )
    }

    // Calculate savings
    const savingsAnnual = currentSetupCostAnnual - sanayCostAnnual
    const savingsMonthly = savingsAnnual / 12

    // Calculate efficiency index
    const efficiencyIndex = calculateEfficiencyIndex(
      sanayCostAnnual,
      currentSetupCostAnnual
    )

    const insights = await generateInsights(
      userInput,
      sanayCostMonthly,
      sanayCostAnnual,
      currentSetupCostAnnual
    )
    // Prepare quote data
    // Ensure all numeric values are properly formatted
    const quoteData = {
      user_input_id: userInput.id,
      sanay_cost_monthly: sanayCostMonthly,
      sanay_cost_annual: sanayCostAnnual,
      current_setup_cost_annual: currentSetupCostAnnual,
      savings_annual: savingsAnnual,
      savings_monthly: savingsMonthly,
      efficiency_index: efficiencyIndex,

      // ⭐ Store individual service costs
      bk_cost: sanayCostBreakdown.bk_cost,
      bku_cost: sanayCostBreakdown.bku_cost,
      pr_cost: sanayCostBreakdown.pr_cost,
      vat_cost: sanayCostBreakdown.vat_cost,
      ma_cost: sanayCostBreakdown.ma_cost,
      fa_cost: sanayCostBreakdown.fa_cost,
      fcf_cost: sanayCostBreakdown.fcf_cost,
      cfo_cost: sanayCostBreakdown.cfo_cost,
      cc_cost: sanayCostBreakdown.cc_cost,

      // ⭐ Store AI results
      ai_summary: insights.summary,
      ai_tips: JSON.stringify(insights.tips), // Store as JSON string
      ai_extra_tips: insights.extra_tips
        ? JSON.stringify(insights.extra_tips)
        : null,
      ai_sanay_tips: insights.sanay_tips
        ? JSON.stringify(insights.sanay_tips)
        : null,
    }
    // Validate required fields before insert/update
    if (
      !quoteData.current_setup_cost_annual ||
      isNaN(quoteData.current_setup_cost_annual)
    ) {
      throw new Error(
        `Invalid current_setup_cost_annual: ${quoteData.current_setup_cost_annual}`
      )
    }

    // If existingQuoteId is provided, update the existing quote; otherwise insert a new one
    let result
    if (existingQuoteId) {
      const { data: updatedQuote, error: updateError } = await supabaseAdmin
        .from('quotes')
        .update(quoteData)
        .eq('id', existingQuoteId)
        .select()
        .single()

      if (updateError) {
        return null
      }

      result = updatedQuote
    } else {
      const { data: newQuote, error: insertError } = await supabaseAdmin
        .from('quotes')
        .insert(quoteData)
        .select()
        .single()

      if (insertError) {
        return null
      }

      result = newQuote
    }

    return result
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error calculating quote:', error)
    return null
  }
}

// Calculate Sanay monthly cost with breakdown
export const calculateSanayCostMonthly = async (
  userInput: UserInput
): Promise<SanayCostBreakdown> => {
  // Initialize breakdown with all costs set to null (except BK which is always present)
  const breakdown: SanayCostBreakdown = {
    total: 0,
    bk_cost: 0,
    bku_cost: 0,
    pr_cost: null,
    vat_cost: null,
    ma_cost: null,
    fa_cost: null,
    fcf_cost: null,
    cfo_cost: null,
    cc_cost: null,
  }

  // 1. Bookkeeping (BK) - mandatory, based on transaction volume
  const bkRule = await getPricingRule('BK', userInput.monthly_transactions)
  if (!bkRule || !bkRule.monthly_price) {
    throw new Error('Bookkeeping pricing rule not found')
  }
  breakdown.bk_cost = Number(bkRule.monthly_price)
  breakdown.total += breakdown.bk_cost

  // 2. Reporting frequency uplift (BKU): if Monthly reporting and transactions <= 100, add £100/month
  if (
    userInput.reporting_frequency === 'Monthly' &&
    userInput.monthly_transactions <= 100
  ) {
    breakdown.bku_cost = 100
    breakdown.total += breakdown.bku_cost
  }

  // 3. Payroll (PR) - if selected
  if (
    userInput.selected_services.includes('payroll') ||
    userInput.selected_services.includes('PR')
  ) {
    const { data: basePrice, error: basePriceError } = await supabaseAdmin
      .from('pricing_rules')
      .select('monthly_price')
      .eq('service_code', 'PR')
      .single()

    if (basePriceError || !basePrice) {
      throw new Error('Base price not found')
    }

    const additionalEmployees = userInput.number_of_staff - 5
    breakdown.pr_cost =
      Number(basePrice.monthly_price) + additionalEmployees * 10
    breakdown.total += breakdown.pr_cost
  }

  // 4. Other add-on services (VAT, MA, FA, FCF, CFO, CC) - based on turnover band
  const addOnServices = [
    'vat-returns',
    'VAT',
    'management-accounts',
    'MA',
    'financial-analysis',
    'FA',
    'budgeting-forecasting',
    'FCF',
    'credit-control',
    'CC',
    'CFO',
  ]

  const serviceCodeMap: Record<string, string> = {
    'vat-returns': 'VAT',
    VAT: 'VAT',
    'management-accounts': 'MA',
    MA: 'MA',
    'financial-analysis': 'FA',
    FA: 'FA',
    'budgeting-forecasting': 'FCF',
    FCF: 'FCF',
    'credit-control': 'CC',
    CC: 'CC',
    CFO: 'CFO',
  }

  // Map service codes to breakdown property names
  const serviceToPropertyMap: Record<string, keyof SanayCostBreakdown> = {
    VAT: 'vat_cost',
    MA: 'ma_cost',
    FA: 'fa_cost',
    FCF: 'fcf_cost',
    CC: 'cc_cost',
    CFO: 'cfo_cost',
  }

  for (const service of userInput.selected_services) {
    if (addOnServices.includes(service)) {
      const serviceCode = serviceCodeMap[service] || service
      const serviceRule = await getPricingRule(
        serviceCode,
        undefined,
        userInput.annual_turnover_band
      )
      if (serviceRule && serviceRule.monthly_price) {
        const cost = Number(serviceRule.monthly_price)
        const propertyName = serviceToPropertyMap[serviceCode]
        if (propertyName) {
          breakdown[propertyName] = cost
          breakdown.total += cost
        }
      }
    }
  }

  return breakdown
}

// Calculate current setup cost annual based on setup type
export const calculateCurrentSetupCostAnnual = async (
  userInput: UserInput
): Promise<number> => {
  try {
    let cost = 0
    switch (userInput.current_setup) {
      case 'owner_led':
        cost = await calculateOwnerCostAnnual(userInput)
        break
      case 'internal':
        cost = await calculateInternalCostAnnual(userInput)
        break
      case 'external':
        cost = await calculateExternalCostAnnual(userInput)
        break
      case 'hybrid':
        cost = await calculateHybridCostAnnual(userInput)
        break
      default:
        cost = 0
    }
    // Ensure we always return a valid number
    return Number(cost) || 0
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error calculating current setup cost:', error)
    // Return 0 as fallback instead of null/undefined
    return 0
  }
}

// Calculate owner cost annual
export const calculateOwnerCostAnnual = async (
  userInput: UserInput
): Promise<number> => {
  let owner_hourly_value = 0
  const owner_hours_per_month = Number(userInput.owner_hours_per_month)

  // User did NOT provide custom hourly value
  if (!userInput.owner_hourly_value) {
    const assumptionsKey = getOwnerHourlyKey(userInput.annual_turnover_band)
    const assumption = await getAssumption(assumptionsKey)

    if (!assumption) {
      return 0 // no assumption found → safe fallback
    }

    // CASE 1: assumption is an object (value_json)
    if (typeof assumption === 'object') {
      const json = assumption as Assumption
      owner_hourly_value = Number(json.amount)
    }

    // CASE 2: assumption is a number (value_number)
    else {
      owner_hourly_value = Number(assumption)
    }
  }

  // User provided their own value
  else {
    owner_hourly_value = Number(userInput.owner_hourly_value)
  }
  return owner_hourly_value * owner_hours_per_month * 12
}

export const getOwnerHourlyKey = (band: string): string => {
  const { min, max } = parseTurnoverBand(band)

  if (max < 125000) return 'owner_hourly_value_under_125k'
  if (min >= 125000 && max <= 500000) return 'owner_hourly_value_125k_500k'
  if (min >= 500000 && max <= 1000000) return 'owner_hourly_value_500k_1m'
  if (min >= 1000000 && max <= 5000000) return 'owner_hourly_value_1m_5m'
  if (min >= 5000000 && max <= 10000000) return 'owner_hourly_value_5m_10m'
  if (min >= 10000000 && max <= 20000000) return 'owner_hourly_value_10m_20m'
  return 'owner_hourly_value_over_20m'
}

// Calculate internal cost annual
export const calculateInternalCostAnnual = async (
  userInput: UserInput
): Promise<number> => {
  // If user provided override, use that as base, otherwise calculate from FTE
  if (!userInput.current_monthly_spend_internal) {
    return 0
  }
  const baseCost = Number(userInput.current_monthly_spend_internal) * 12
  return baseCost
}

// Calculate external cost annual
export const calculateExternalCostAnnual = async (
  userInput: UserInput
): Promise<number> => {
  if (!userInput.current_monthly_spend_external) {
    return 0
  }

  const providerFee = userInput.current_monthly_spend_external * 12
  // Get oversight hours and inefficiency from assumptions
  const oversightHours = await getAssumption(
    'oversight_hours_per_month_external'
  )
  const inefficiencyPct = await getAssumption('inefficiency_pct_external')
  const oversightHoursValue =
    (typeof oversightHours === 'number' ? oversightHours : 8) *
    userInput.owner_hourly_value *
    12
  const inefficiencyCost =
    (typeof inefficiencyPct === 'number' ? inefficiencyPct : 0.05) * providerFee
  return providerFee + oversightHoursValue + inefficiencyCost
}

// Calculate hybrid cost annual
export const calculateHybridCostAnnual = async (
  userInput: UserInput
): Promise<number> => {
  const internalCost = await calculateInternalCostAnnual(userInput)
  const externalCost = await calculateExternalCostAnnual(userInput)

  // Validate that we have at least one valid cost
  const hasValidInternal = internalCost && internalCost > 0
  const hasValidExternal = externalCost && externalCost > 0

  if (!hasValidInternal && !hasValidExternal) {
    throw new Error(
      `Hybrid setup requires External cost ` +
        `External cost: ${externalCost}. ` +
        `Please provide current_monthly_spend_external.`
    )
  }

  // If only one is valid, use that one (100% weight)
  if (!hasValidInternal) {
    return externalCost
  }

  if (!hasValidExternal) {
    return internalCost
  }

  const internalWeightValue = 0.4
  const externalWeightValue = 0.6

  const hybridCost =
    internalCost * internalWeightValue + externalCost * externalWeightValue

  // Ensure we return a valid number
  return Number(hybridCost) || 0
}

// helper for getting data from the DB

// Helper function to parse turnover band to numeric range
export const parseTurnoverBand = (
  band: string
): { min: number; max: number } => {
  // Handle formats like "£1m–£5m", "£0 - £100k", "£10M+"
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

// Helper function to get pricing rule for a service
export const getPricingRule = async (
  serviceCode: string,
  transactionVolume?: number,
  turnoverBand?: string
) => {
  let query = supabaseAdmin
    .from('pricing_rules')
    .select('*')
    .eq('service_code', serviceCode)

  // For transaction volume: find rule where transactionVolume falls within band_min and band_max
  if (transactionVolume !== undefined) {
    query = query
      .lte('band_min', transactionVolume)
      .gte('band_max', transactionVolume)
  }

  // For turnover band: find rule where turnover range overlaps
  if (turnoverBand) {
    const { min, max } = parseTurnoverBand(turnoverBand)
    if (min > 0 || max < Infinity) {
      // Find rules where turnover ranges overlap: turnover_min <= max AND turnover_max >= min
      query = query.lte('turnover_min', max).gte('turnover_max', min)
    }
  }

  // Order by the appropriate field: turnover_max for turnover bands, band_max for transaction bands
  if (turnoverBand) {
    query = query.order('turnover_max', { ascending: false })
  } else {
    query = query.order('band_max', { ascending: false })
  }

  const { data, error } = await query.limit(1).maybeSingle()

  if (error || !data) return null
  return data
}

// Helper function to get assumption value
export const getAssumption = async (
  key: string
): Promise<number | null | unknown> => {
  const { data, error } = await supabaseAdmin
    .from('assumptions')
    .select('value')
    .eq('key', key)
    .maybeSingle()

  if (error || !data) return null

  return data.value
}

// Helper function to get cost percentage from assumptions table
export const getCostPercentage = async (key: string): Promise<number> => {
  const value = await getAssumption(key)
  return value ? Number(value) : 0
}

// Helper function to get role mix rules for turnover band
export const getRoleMixRules = async (turnoverBand: string) => {
  const { min, max } = parseTurnoverBand(turnoverBand)

  // Find rule where revenue range overlaps: revenue_min <= max AND revenue_max >= min
  const { data, error } = await supabaseAdmin
    .from('role_mix_rules')
    .select('*')
    .lte('revenue_min', max)
    .gte('revenue_max', min)
    .order('revenue_max', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching role mix rules:', error)
    return null
  }

  if (!data) {
    // eslint-disable-next-line no-console
    console.error(
      `No role mix rule found for turnover band: "${turnoverBand}" (min: ${min}, max: ${max})`
    )
    // Try to get all available rules for debugging
    const { data: allRules } = await supabaseAdmin
      .from('role_mix_rules')
      .select('revenue_min, revenue_max')
      .order('revenue_min', { ascending: true })
    if (allRules) {
      // eslint-disable-next-line no-console
      console.error('Available role mix rules:', allRules)
    }
    return null
  }

  return data
}

// Helper function to get salary for a role
export const getSalary = async (role: string): Promise<number> => {
  const { data, error } = await supabaseAdmin
    .from('salaries')
    .select('annual_salary_gbp')
    .eq('role', role)
    .single()

  if (error || !data) return 0
  return Number(data.annual_salary_gbp || 0)
}

export const generateInsights = async (
  user: UserInput,
  sanayMonthly: number,
  sanayAnnual: number,
  currentAnnual: number
) => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })

  const savingsAnnual = currentAnnual - sanayAnnual
  const savingsMonthly = savingsAnnual / 12
  const isOwnerCheaper = currentAnnual < sanayAnnual
  const hasSavings = savingsAnnual > 0

  // Format selected services for better context
  const selectedServicesList =
    user.selected_services.map(s => SERVICE_LABELS[s] || s).join(', ') ||
    'Bookkeeping only'

  const prompt = `
You are a financial advisor at Sanay, a UK-based financial services provider specializing in bookkeeping, VAT returns, payroll, management accounts, credit control, budgeting & forecasting, financial analysis, and CFO services.

We have here the app where we will takes the details from the user and then giving to you your job is to compare it all the things in it with our company sanay cost and then give him an summary and tips according to it

BUSINESS PROFILE:
- Company: ${user.company_name}
- Industry: ${user.industry || 'Not specified'}
- Annual Turnover: ${user.annual_turnover_band}
- Number of Staff: ${user.number_of_staff}
- Monthly Transactions: ${user.monthly_transactions}
- Current Setup: ${SETUP_TYPE_LABELS[user.current_setup] || user.current_setup}
- Reporting Frequency: ${user.reporting_frequency}
- Selected Services: ${selectedServicesList}

FINANCIAL COMPARISON:
- Current Annual Cost: £${currentAnnual.toLocaleString('en-GB')}
- Sanay Annual Cost: £${sanayAnnual.toLocaleString('en-GB')}
- ${hasSavings ? `Annual Savings with Sanay: £${savingsAnnual.toLocaleString('en-GB')}` : `Additional Annual Cost: £${Math.abs(savingsAnnual).toLocaleString('en-GB')}`}
- Monthly Difference: £${Math.abs(savingsMonthly).toLocaleString('en-GB')} ${hasSavings ? 'saved' : 'additional'}

TASKS - Generate insights tailored to this specific business:

1. SUMMARY (exactly 2 lines, professional tone):
   - First line: Analyze their current ${SETUP_TYPE_LABELS[user.current_setup] || user.current_setup} setup and ${user.monthly_transactions} monthly transactions
   - Second line: ${hasSavings ? 'Highlight the potential savings and efficiency gains' : 'Emphasize the VALUE PROPOSITION - how Sanay provides superior efficiency, reliability, and quality that justifies the investment, even at a higher cost. Focus on operational excellence and strategic benefits.'} based on their ${user.annual_turnover_band} turnover and ${user.selected_services.length > 0 ? 'selected services' : 'basic bookkeeping needs'}

2. EFFICIENCY TIPS (3 actionable tips, specific to their situation):
   - Focus on their ${user.current_setup === 'owner_led' ? 'time management and delegation' : user.current_setup === 'internal' ? 'team efficiency and process optimization' : user.current_setup === 'external' ? 'cost control and oversight' : 'hybrid setup optimization'}
   - Consider their ${user.monthly_transactions} monthly transaction volume and ${user.reporting_frequency.toLowerCase()} reporting needs
   - Make tips relevant to ${user.industry ? `the ${user.industry} industry` : 'their business size'}

3. EXTRA TIPS (only if current setup is cheaper than Sanay - provide 2 tips):
   - Explain why their current ${SETUP_TYPE_LABELS[user.current_setup] || user.current_setup} setup appears cost-effective
   - Suggest specific improvements they could make to their current processes
   - Consider hidden costs like owner time value, inefficiencies, or missed opportunities

4. SANAY RECOMMENDATIONS (3 specific recommendations):
   ${
     !hasSavings
       ? `IMPORTANT: Sanay costs MORE than their current setup. Focus on VALUE, not cost:
   - Emphasize EFFICIENCY: Streamlined processes, reduced errors, faster turnaround times
   - Emphasize RELIABILITY: Consistent service delivery, professional expertise, reduced risk
   - Emphasize QUALITY: Higher accuracy, better reporting, strategic insights, compliance assurance
   - Emphasize TIME SAVINGS: Free up owner/team time for strategic work, less oversight needed
   - Emphasize SCALABILITY: Can grow with business, no need to hire/train staff
   - Emphasize PEACE OF MIND: Professional handling, reduced stress, compliance confidence
   - Reference their selected services: ${selectedServicesList}
   - Be specific about benefits for a ${user.annual_turnover_band} turnover business with ${user.number_of_staff} staff
   - Explain why the additional investment is worth it for their growth stage`
       : `- Reference their selected services: ${selectedServicesList}
   - Explain how Sanay's ${user.selected_services.length > 0 ? 'selected services' : 'bookkeeping service'} can address their specific needs
   - Highlight value beyond cost: professional expertise, time savings, compliance, scalability, and strategic insights
   - Be specific about benefits for a ${user.annual_turnover_band} turnover business with ${user.number_of_staff} staff`
   }

TONE & STYLE:
- Professional, consultative, and supportive
- Use UK business terminology and currency references
- Be specific to their business context, not generic
- Focus on actionable insights and strategic value
- ${hasSavings ? 'If savings exist, emphasize ROI and efficiency gains' : 'CRITICAL: When Sanay costs more, focus on VALUE PROPOSITION - efficiency, reliability, quality, time savings, scalability, and peace of mind. Frame the additional cost as an investment in business growth and operational excellence.'}

CRITICAL: You must respond with ONLY valid JSON. No markdown, no code blocks, no explanations - just the JSON object.

Required JSON structure:
${
  isOwnerCheaper
    ? `{
  "summary": "First line analyzing their ${SETUP_TYPE_LABELS[user.current_setup] || user.current_setup} setup and ${user.monthly_transactions} monthly transactions. Second line highlighting ${hasSavings ? 'potential savings' : 'value proposition'} and key opportunity.",
  "tips": ["Actionable tip 1 specific to their ${user.current_setup === 'owner_led' ? 'time management' : user.current_setup === 'internal' ? 'team efficiency' : 'cost control'} needs", "Actionable tip 2 relevant to ${user.monthly_transactions} monthly transactions", "Actionable tip 3 for ${user.industry ? user.industry : 'their business size'}"],
  "extra_tips": ["Explanation of why ${SETUP_TYPE_LABELS[user.current_setup] || user.current_setup} setup appears cost-effective", "Specific improvement suggestion for their current processes"],
  "sanay_tips": ["How Sanay's ${selectedServicesList} addresses their ${user.annual_turnover_band} turnover business needs", "Value beyond cost: expertise, time savings, compliance benefits", "Strategic benefits for ${user.number_of_staff} staff business"]
}`
    : `{
  "summary": "First line analyzing their ${SETUP_TYPE_LABELS[user.current_setup] || user.current_setup} setup and ${user.monthly_transactions} monthly transactions. Second line emphasizing Sanay's superior EFFICIENCY, RELIABILITY, and QUALITY that justify the investment for their ${user.annual_turnover_band} turnover business.",
  "tips": ["Actionable tip 1 specific to their ${user.current_setup === 'owner_led' ? 'time management' : user.current_setup === 'internal' ? 'team efficiency' : 'cost control'} needs", "Actionable tip 2 relevant to ${user.monthly_transactions} monthly transactions", "Actionable tip 3 for ${user.industry ? user.industry : 'their business size'}"],
  "extra_tips": null,
  "sanay_tips": ["Sanay delivers superior EFFICIENCY through streamlined processes and faster turnaround, reducing errors and improving operational speed for your ${user.monthly_transactions} monthly transactions", "Sanay provides RELIABILITY with consistent professional service, reducing risk and ensuring compliance - critical for your ${user.annual_turnover_band} turnover business", "Sanay offers QUALITY expertise and strategic insights that free up ${user.current_setup === 'owner_led' ? 'your time' : 'your team'} for growth-focused activities, making the investment worthwhile for scaling your ${user.number_of_staff} staff business"]
}`
}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a financial advisor at Sanay. Always respond with valid JSON only, no additional text or markdown formatting.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 800,
    response_format: { type: 'json_object' },
  })

  // Clean + safe parse
  const content = response.choices[0].message.content || '{}'

  try {
    return JSON.parse(content)
  } catch {
    // fallback in case of formatting error
    return {
      summary: '',
      tips: [],
      extra_tips: [],
      sanay_tips: [],
    }
  }
}

// Calculate efficiency index
export const calculateEfficiencyIndex = (
  sanayCostAnnual: number,
  currentSetupCostAnnual: number
): number => {
  if (currentSetupCostAnnual === 0) return 0
  return 100 - (sanayCostAnnual / currentSetupCostAnnual) * 100
}
