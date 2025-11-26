import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    // First, get the quote to find the user_input_id
    const { data: quoteData, error: quoteError } = await supabaseAdmin
      .from('quotes')
      .select('user_input_id')
      .eq('id', id)
      .single()

    if (quoteError || !quoteData) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Get the user input data
    const { data: userInputData, error: userInputError } = await supabaseAdmin
      .from('user_inputs')
      .select('*')
      .eq('id', quoteData.user_input_id)
      .single()

    if (userInputError || !userInputData) {
      return NextResponse.json(
        { error: 'User input data not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, data: userInputData }, { status: 200 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching user input:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
