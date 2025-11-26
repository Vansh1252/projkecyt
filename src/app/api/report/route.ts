import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { calculateQuote, type UserInput } from './helper'

const reportSchema = z
  .object({
    userInputId: z.number().int().positive().optional(),
    fullName: z.string().min(1, 'Full name is required'),
    companyName: z.string().min(1, 'Company name is required'),
    businessEmail: z.string().email('Invalid email address'),
    setupType: z.enum([
      'owner-led',
      'internal-team',
      'external-agency',
      'hybrid',
    ]),
    numberOfStaff: z.number().int().min(1, 'Number of staff is required'),
    industry: z.string().optional().nullable(),
    annualTurnover: z.string().min(1, 'Annual turnover is required'),
    hoursSpent: z.number().int().min(1).optional().nullable(),
    monthlyTransactionVolume: z
      .number()
      .int()
      .min(0, 'Monthly transaction volume is required'),
    hourlyValue: z.number().min(0, 'Hourly value is required'),
    estimatedHoursSpent: z.number().int().min(0).optional().nullable(),
    internalCost: z.number().min(0).optional().nullable(),
    currentExternalCost: z.number().min(0).optional().nullable(),
    reportingFrequency: z.enum(['Monthly', 'Quarterly']),
    transactionVolume: z.string().min(1, 'Transaction volume is required'),
    selectedServices: z.array(z.string()).default([]),
  })
  .strict()

// GET /api/report
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Report API is healthy',
    version: 'v1',
  })
}

// POST /api/report
export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}))

    const validatedPayload = reportSchema.safeParse(payload)

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

    const {
      userInputId,
      fullName,
      companyName,
      businessEmail,
      setupType,
      numberOfStaff,
      industry,
      annualTurnover,
      hoursSpent,
      monthlyTransactionVolume,
      hourlyValue,
      estimatedHoursSpent,
      internalCost,
      currentExternalCost,
      reportingFrequency,
      transactionVolume,
      selectedServices,
    } = validatedPayload.data

    // Map setupType to database values
    const setupTypeMap: Record<string, string> = {
      'owner-led': 'owner_led',
      'internal-team': 'internal',
      'external-agency': 'external',
      hybrid: 'hybrid',
    }
    const currentSetup = setupTypeMap[setupType] || setupType

    let data: UserInput

    // If userInputId is provided, update existing record; otherwise create new one
    if (userInputId) {
      // Update existing user_input with all fields from payload
      const { data: updatedData, error: updateError } = await supabaseAdmin
        .from('user_inputs')
        .update({
          full_name: fullName,
          company_name: companyName,
          business_email: businessEmail,
          current_setup: currentSetup,
          number_of_staff: numberOfStaff,
          industry: industry || null,
          annual_turnover_band: annualTurnover,
          hours_spent_per_month: hoursSpent || null,
          monthly_transactions: monthlyTransactionVolume,
          owner_hourly_value: hourlyValue,
          owner_hours_per_month: estimatedHoursSpent || null,
          current_monthly_spend_internal: internalCost || null,
          current_monthly_spend_external: currentExternalCost || null,
          reporting_frequency: reportingFrequency,
          transaction_volume_band: transactionVolume,
          selected_services: selectedServices || [],
        })
        .eq('id', userInputId)
        .select()
        .single()

      if (updateError || !updatedData) {
        return NextResponse.json(
          { ok: false, error: updateError?.message || 'User input not found' },
          { status: updateError ? 500 : 404 }
        )
      }

      data = updatedData as UserInput

      // Check if a quote already exists for this user_input_id
      const { data: existingQuote } = await supabaseAdmin
        .from('quotes')
        .select('id')
        .eq('user_input_id', userInputId)
        .maybeSingle()

      // Calculate quote and update existing or create new
      const quote = await calculateQuote(data as UserInput, existingQuote?.id)
      if (!quote) {
        return NextResponse.json(
          { ok: false, error: 'Failed to calculate quote' },
          { status: 500 }
        )
      }

      // Generate PDF and upload to Supabase Storage (non-blocking)
      if (quote.id) {
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          const response = await fetch(`${baseUrl}/api/create-pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quoteId: quote.id }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            // eslint-disable-next-line no-console
            console.error(
              'Error generating PDF:',
              errorData.error || 'Failed to generate PDF'
            )
          }
          // PDF is automatically uploaded and saved by /api/create-pdf
        } catch (pdfError) {
          // Log error but don't fail the request - quote was created successfully
          // eslint-disable-next-line no-console
          console.error('Error generating PDF:', pdfError)
        }
      }

      // Send data to Zapier webhook (non-blocking - don't fail if this fails)
      if (process.env.ZAPIER_WEBHOOK_URL && quote.id) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
          // Get PDF URL from database
          const { data: pdfFile } = await supabaseAdmin
            .from('pdf_files')
            .select('file_url')
            .eq('quote_id', quote.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          const pdfLink = pdfFile?.file_url || `${baseUrl}/api/pdf/${quote.id}`

          await fetch(process.env.ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: fullName,
              email: businessEmail,
              company: companyName,
              sanay_cost: quote.sanay_cost_annual?.toString() || '0',
              current_cost: quote.current_setup_cost_annual?.toString() || '0',
              efficiency_score: quote.efficiency_index?.toString() || '0',
              pdf_link: pdfLink,
            }),
          })
        } catch (zapierError) {
          // Log error but don't fail the request - quote was created successfully
          // eslint-disable-next-line no-console
          console.error('Error sending data to Zapier webhook:', zapierError)
        }
      }

      return NextResponse.json({ ok: true, data: quote }, { status: 200 })
    } else {
      // Create new user_input
      const { data: newData, error: insertError } = await supabaseAdmin
        .from('user_inputs')
        .insert({
          full_name: fullName,
          company_name: companyName,
          business_email: businessEmail,
          current_setup: currentSetup,
          number_of_staff: numberOfStaff,
          industry: industry || null,
          annual_turnover_band: annualTurnover,
          hours_spent_per_month: hoursSpent || null,
          monthly_transactions: monthlyTransactionVolume,
          owner_hourly_value: hourlyValue,
          owner_hours_per_month: estimatedHoursSpent || null,
          current_monthly_spend_internal: internalCost || null,
          current_monthly_spend_external: currentExternalCost || null,
          reporting_frequency: reportingFrequency,
          transaction_volume_band: transactionVolume,
          selected_services: selectedServices || [],
        })
        .select()
        .single()

      if (insertError) {
        return NextResponse.json(
          { ok: false, error: insertError.message },
          { status: 500 }
        )
      }

      data = newData as UserInput

      // Create new quote (no existing quote for new user_input)
      const quote = await calculateQuote(data as UserInput)
      if (!quote) {
        return NextResponse.json(
          { ok: false, error: 'Failed to calculate quote' },
          { status: 500 }
        )
      }

      // Generate PDF and upload to Supabase Storage (non-blocking)
      if (quote.id) {
        try {
          // Call internal API - use env var or default to localhost for dev
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          const response = await fetch(`${baseUrl}/api/create-pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quoteId: quote.id }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            // eslint-disable-next-line no-console
            console.error(
              'Error generating PDF:',
              errorData.error || 'Failed to generate PDF'
            )
          }
          // PDF is automatically uploaded and saved by /api/create-pdf
        } catch (pdfError) {
          // Log error but don't fail the request - quote was created successfully
          // eslint-disable-next-line no-console
          console.error('Error generating PDF:', pdfError)
        }
      }

      // Send data to Zapier webhook (non-blocking - don't fail if this fails)
      if (process.env.ZAPIER_WEBHOOK_URL && quote.id) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
          // Get PDF URL from database
          const { data: pdfFile } = await supabaseAdmin
            .from('pdf_files')
            .select('file_url')
            .eq('quote_id', quote.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          const pdfLink = pdfFile?.file_url || `${baseUrl}/api/pdf/${quote.id}`

          await fetch(process.env.ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: fullName,
              email: businessEmail,
              company: companyName,
              sanay_cost: quote.sanay_cost_annual?.toString() || '0',
              current_cost: quote.current_setup_cost_annual?.toString() || '0',
              efficiency_score: quote.efficiency_index?.toString() || '0',
              pdf_link: pdfLink,
            }),
          })
        } catch (zapierError) {
          // Log error but don't fail the request - quote was created successfully
          // eslint-disable-next-line no-console
          console.error('Error sending data to Zapier webhook:', zapierError)
        }
      }

      return NextResponse.json({ ok: true, data: quote }, { status: 201 })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in POST /api/report:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
