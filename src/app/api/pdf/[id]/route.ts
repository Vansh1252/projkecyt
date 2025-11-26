import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const quoteId = parseInt(id, 10)

    if (isNaN(quoteId)) {
      return NextResponse.json({ error: 'Invalid quote ID' }, { status: 400 })
    }

    // Fetch PDF file info from database
    const { data: pdfFile, error: pdfError } = await supabaseAdmin
      .from('pdf_files')
      .select('file_path, file_name')
      .eq('quote_id', quoteId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (pdfError || !pdfFile) {
      return NextResponse.json(
        { error: 'PDF not found for this quote' },
        { status: 404 }
      )
    }

    // Download PDF from Supabase Storage
    const { data: pdfBuffer, error: downloadError } =
      await supabaseAdmin.storage.from('sanay').download(pdfFile.file_path)

    if (downloadError || !pdfBuffer) {
      return NextResponse.json(
        { error: 'Failed to download PDF from storage' },
        { status: 500 }
      )
    }

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(await pdfBuffer.arrayBuffer())

    // Return PDF with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${pdfFile.file_name || `sanay-quote-${quoteId}.pdf`}"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching PDF:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch PDF',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
