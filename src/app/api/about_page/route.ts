import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET /api/about_page - Fetch all data needed for internal cost calculation
export async function GET() {
  try {
    // Fetch all role mix rules
    const { data: roleMixRules, error: roleMixError } = await supabaseAdmin
      .from('role_mix_rules')
      .select('*')
      .order('revenue_min', { ascending: true })

    if (roleMixError) {
      // eslint-disable-next-line no-console
      console.error('Error fetching role mix rules:', roleMixError)
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch role mix rules' },
        { status: 500 }
      )
    }

    // Fetch all salaries
    const { data: salaries, error: salariesError } = await supabaseAdmin
      .from('salaries')
      .select('role, annual_salary_gbp')
      .order('role', { ascending: true })

    if (salariesError) {
      // eslint-disable-next-line no-console
      console.error('Error fetching salaries:', salariesError)
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch salaries' },
        { status: 500 }
      )
    }

    // Fetch cost percentages and owner hourly values from assumptions
    const costPercentageKeys = [
      'employee_oncost_pct',
      'inefficiency_pct_internal',
      'mgmt_overhead_pct_internal',
    ]

    const ownerHourlyValueKeys = [
      'owner_hourly_value_under_125k',
      'owner_hourly_value_125k_500k',
      'owner_hourly_value_500k_1m',
      'owner_hourly_value_1m_5m',
      'owner_hourly_value_5m_10m',
      'owner_hourly_value_10m_20m',
      'owner_hourly_value_over_20m',
    ]

    const allKeys = [...costPercentageKeys, ...ownerHourlyValueKeys]

    const { data: assumptions, error: assumptionsError } = await supabaseAdmin
      .from('assumptions')
      .select('key, value')
      .in('key', allKeys)

    if (assumptionsError) {
      // eslint-disable-next-line no-console
      console.error('Error fetching assumptions:', assumptionsError)
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch assumptions' },
        { status: 500 }
      )
    }

    // Transform assumptions into a key-value map
    const costPercentages: Record<string, number> = {}
    const ownerHourlyValues: Record<
      string,
      { amount: number; description: string }
    > = {}

    assumptions?.forEach(assumption => {
      if (costPercentageKeys.includes(assumption.key)) {
        // Parse the value - it might be a JSON object with {value, description}, string, number, or null
        let value = assumption.value

        // If it's a string, try to parse as JSON first
        if (typeof value === 'string') {
          try {
            const parsed = JSON.parse(value)
            // If parsed is an object with a 'value' property, use that
            if (parsed && typeof parsed === 'object' && 'value' in parsed) {
              value = parsed.value
            } else {
              // Otherwise, try to parse as number
              const numParsed = parseFloat(value)
              value = isNaN(numParsed) ? null : numParsed
            }
          } catch {
            // Not JSON, try to parse as number
            const numParsed = parseFloat(value)
            value = isNaN(numParsed) ? null : numParsed
          }
        } else if (value && typeof value === 'object' && 'value' in value) {
          // If it's already an object with 'value' property, extract it
          value = value.value
        }

        // Store the value (or 0 if null/undefined)
        const numValue = value != null ? Number(value) : 0
        costPercentages[assumption.key] = numValue
      } else if (ownerHourlyValueKeys.includes(assumption.key)) {
        // Parse JSON value for owner hourly values
        try {
          const parsedValue =
            typeof assumption.value === 'string'
              ? JSON.parse(assumption.value)
              : assumption.value
          ownerHourlyValues[assumption.key] = {
            amount: Number(parsedValue?.amount) || 0,
            description: parsedValue?.description || '',
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
            `Error parsing owner hourly value for ${assumption.key}:`,
            error
          )
          ownerHourlyValues[assumption.key] = {
            amount: 0,
            description: '',
          }
        }
      }
    })

    // Transform salaries into a role-salary map
    const salaryMap: Record<string, number> = {}
    salaries?.forEach(salary => {
      salaryMap[salary.role] = Number(salary.annual_salary_gbp) || 0
    })

    // Prepare cost percentages with proper defaults
    const finalCostPercentages = {
      employeeOncostPct:
        costPercentages['employee_oncost_pct'] != null
          ? Number(costPercentages['employee_oncost_pct'])
          : 0.2,
      inefficiencyPctInternal:
        costPercentages['inefficiency_pct_internal'] != null
          ? Number(costPercentages['inefficiency_pct_internal'])
          : 0.1,
      mgmtOverheadPctInternal:
        costPercentages['mgmt_overhead_pct_internal'] != null
          ? Number(costPercentages['mgmt_overhead_pct_internal'])
          : 0.15,
    }

    return NextResponse.json({
      ok: true,
      data: {
        roleMixRules: roleMixRules || [],
        salaries: salaryMap,
        costPercentages: finalCostPercentages,
        ownerHourlyValues: {
          under125k:
            ownerHourlyValues['owner_hourly_value_under_125k']?.amount ?? 0,
          '125k_500k':
            ownerHourlyValues['owner_hourly_value_125k_500k']?.amount ?? 0,
          '500k_1m':
            ownerHourlyValues['owner_hourly_value_500k_1m']?.amount ?? 0,
          '1m_5m': ownerHourlyValues['owner_hourly_value_1m_5m']?.amount ?? 0,
          '5m_10m': ownerHourlyValues['owner_hourly_value_5m_10m']?.amount ?? 0,
          '10m_20m':
            ownerHourlyValues['owner_hourly_value_10m_20m']?.amount ?? 0,
          over20m:
            ownerHourlyValues['owner_hourly_value_over_20m']?.amount ?? 0,
        },
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in GET /api/about_page:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}
