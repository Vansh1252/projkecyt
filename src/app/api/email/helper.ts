import { supabaseAdmin } from '@/lib/supabase'

export const getUserInputByQuoteId = async (quoteId: string) => {
  // First, get the quote to find the user_input_id
  const { data: quoteData, error: quoteError } = await supabaseAdmin
    .from('quotes')
    .select('user_input_id')
    .eq('id', quoteId)
    .single()

  if (quoteError || !quoteData) {
    throw new Error(quoteError?.message || 'Quote not found')
  }

  // Get the user input data using the user_input_id from the quote
  const { data, error } = await supabaseAdmin
    .from('user_inputs')
    .select('business_email, full_name, company_name')
    .eq('id', quoteData.user_input_id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('User input data not found')
  }

  return data
}
