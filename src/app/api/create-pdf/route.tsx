import { NextResponse } from 'next/server'
import React from 'react'
// Generate PDF directly using @react-pdf/renderer
const { renderToBuffer } = await import('@react-pdf/renderer')
import ReactPDFRenderComponents from '@/components/pdf/reactpdfrendercomponenets'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { quoteId } = await req.json()

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      )
    }

    // 1. Fetch quote data
    const { data: quoteData, error: quoteError } = await supabaseAdmin
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single()

    if (quoteError || !quoteData) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // 2. Fetch user input data
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

    const pdfBuffer = await renderToBuffer(
      React.createElement(ReactPDFRenderComponents)
    )

    const fileName = `quote-${quoteId}-${Date.now()}.pdf`
    const filePath = `quotes/${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from('sanay')
      .upload(filePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      // eslint-disable-next-line no-console
      console.error('Error uploading PDF:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload PDF to storage' },
        { status: 500 }
      )
    }

    // 8. Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('sanay').getPublicUrl(filePath)

    // 9. Insert/Update DB record in pdf_files table
    const { error: dbError } = await supabaseAdmin.from('pdf_files').insert({
      quote_id: quoteId,
      file_name: fileName,
      file_path: filePath,
      file_url: publicUrl,
    })

    if (dbError) {
      // eslint-disable-next-line no-console
      console.error('Error saving PDF record:', dbError)
      // Don't fail the request - PDF was uploaded successfully
    }

    return NextResponse.json({
      success: true,
      message: 'PDF generated and stored successfully',
      pdfKey: filePath,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error generating PDF:', err)
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
