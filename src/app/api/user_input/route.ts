import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Schema for creating a new user input (required fields only)
const createSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  businessEmail: z.string().email('Invalid email address'),
})

// Helper to coerce string numbers to numbers with validation
const coerceToNumber = (min?: number) =>
  z
    .union([z.string(), z.number()])
    .transform(val => {
      if (typeof val === 'string') {
        const num = Number(val)
        return isNaN(num) ? val : num
      }
      return val
    })
    .pipe(z.number().min(min ?? 0))

const coerceToInt = (min?: number, max?: number) =>
  z
    .union([z.string(), z.number()])
    .transform(val => {
      if (typeof val === 'string') {
        const num = Number(val)
        return isNaN(num) ? val : num
      }
      return val
    })
    .pipe(
      z
        .number()
        .int()
        .min(min ?? 0)
        .max(max ?? Infinity)
    )

// Schema for updating user input (all fields optional, but requires id)
const updateSchema = z.object({
  id: z
    .union([z.string(), z.number()])
    .transform(val => (typeof val === 'string' ? Number(val) : val))
    .pipe(z.number().int().positive('Valid user input ID is required')),
  // Company Information
  fullName: z.string().min(1).optional(),
  companyName: z.string().min(1).optional(),
  businessEmail: z.string().email().optional(),
  // Current Setup
  setupType: z
    .enum(['owner-led', 'internal-team', 'external-agency', 'hybrid'])
    .optional(),
  // About Business - accept both string and number, coerce to number
  numberOfStaff: coerceToInt(1).optional().nullable(),
  industry: z.string().optional().nullable(),
  annualTurnover: z.string().optional().nullable(),
  hoursSpent: coerceToInt(1, 180).optional().nullable(),
  monthlyTransactionVolume: coerceToInt(0).optional().nullable(),
  hourlyValue: coerceToNumber(0).optional().nullable(),
  internalCost: coerceToNumber(0).optional().nullable(),
  currentExternalCost: coerceToNumber(0).optional().nullable(),
  estimatedHoursSpent: coerceToInt(1).optional().nullable(),
  // Service Selection
  reportingFrequency: z.enum(['Monthly', 'Quarterly']).optional().nullable(),
  transactionVolume: z.string().optional().nullable(),
  selectedServices: z.array(z.string()).optional().nullable(),
})

// Helper function to map frontend field names to database column names
const mapFieldsToDatabase = (payload: Record<string, unknown>) => {
  const fieldMap: Record<string, string> = {
    fullName: 'full_name',
    companyName: 'company_name',
    businessEmail: 'business_email',
    setupType: 'current_setup',
    numberOfStaff: 'number_of_staff',
    industry: 'industry',
    annualTurnover: 'annual_turnover_band',
    hoursSpent: 'hours_spent_per_month',
    monthlyTransactionVolume: 'monthly_transactions',
    hourlyValue: 'owner_hourly_value',
    internalCost: 'current_monthly_spend_internal',
    currentExternalCost: 'current_monthly_spend_external',
    estimatedHoursSpent: 'owner_hours_per_month',
    reportingFrequency: 'reporting_frequency',
    transactionVolume: 'transaction_volume_band',
    selectedServices: 'selected_services',
  }

  const mapped: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(payload)) {
    if (key === 'id') continue // Skip id field
    const dbColumn = fieldMap[key]
    if (dbColumn && value !== undefined) {
      // Map setupType values to database format
      if (key === 'setupType') {
        const setupTypeMap: Record<string, string> = {
          'owner-led': 'owner_led',
          'internal-team': 'internal',
          'external-agency': 'external',
          hybrid: 'hybrid',
        }
        mapped[dbColumn] = setupTypeMap[value as string] || value
      } else {
        mapped[dbColumn] = value
      }
    }
  }

  return mapped
}

// Create a new user input
export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}))

    const validatedPayload = createSchema.safeParse(payload)

    if (!validatedPayload.success) {
      return NextResponse.json(
        {
          ok: false,
          error: validatedPayload.error.issues
            .map(
              (issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`
            )
            .join(', '),
        },
        { status: 400 }
      )
    }

    const { fullName, companyName, businessEmail } = validatedPayload.data

    const { data, error } = await supabaseAdmin
      .from('user_inputs')
      .insert({
        full_name: fullName,
        company_name: companyName,
        business_email: businessEmail,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, data }, { status: 201 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in POST /api/user_input:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update an existing user input (partial update)
export async function PUT(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}))

    const validatedPayload = updateSchema.safeParse(payload)

    if (!validatedPayload.success) {
      return NextResponse.json(
        {
          ok: false,
          error: validatedPayload.error.issues
            .map(
              (issue: z.ZodIssue) => `${issue.path.join('.')}: ${issue.message}`
            )
            .join(', '),
        },
        { status: 400 }
      )
    }

    const { id, ...updateFields } = validatedPayload.data

    // Map frontend field names to database column names
    const dbUpdateFields = mapFieldsToDatabase(
      updateFields as Record<string, unknown>
    )

    // Only update if there are fields to update
    if (Object.keys(dbUpdateFields).length === 0) {
      return NextResponse.json(
        { ok: false, error: 'No fields provided to update' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('user_inputs')
      .update(dbUpdateFields)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { ok: false, error: 'User input not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, data }, { status: 200 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in PUT /api/user_input:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
