import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getUserInputByQuoteId } from './helper'
import { emailHtml, emailSubject } from './emailtemplate'
import { supabaseAdmin } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}))
  const { quoteId } = payload

  try {
    const userInput = await getUserInputByQuoteId(quoteId)

    const recipientEmail = userInput.business_email
    const recipientName = userInput.full_name || userInput.company_name
    const companyName = userInput.company_name

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'Email address not found' },
        { status: 400 }
      )
    }

    // Fetch PDF from Supabase Storage
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

    // Convert ArrayBuffer to Buffer and then to base64
    const buffer = Buffer.from(await pdfBuffer.arrayBuffer())
    const pdfBase64 = buffer.toString('base64')

    const subject = emailSubject(companyName)
    const html = emailHtml(recipientName, companyName, recipientEmail)

    // Send email with PDF attachment
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: recipientEmail,
      subject: subject,
      html: html,
      attachments: [
        {
          filename: pdfFile.file_name || `sanay-quote-${quoteId}.pdf`,
          content: pdfBase64,
        },
      ],
    })

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error sending email:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        ok: true,
        message: 'Email sent successfully',
        emailId: data?.id,
      },
      { status: 200 }
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error sending email with PDF:', error)

    return NextResponse.json(
      {
        error: 'Failed to send email',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}
