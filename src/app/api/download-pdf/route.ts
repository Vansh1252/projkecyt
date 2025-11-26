import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json(
        { error: 'PDF key is required' },
        { status: 400 }
      )
    }

    // Download PDF from Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('sanay')
      .download(key)

    if (error || !data) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(await data.arrayBuffer())

    // Return PDF with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=quote.pdf`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error downloading PDF:', error)
    return NextResponse.json(
      {
        error: 'Failed to download PDF',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
