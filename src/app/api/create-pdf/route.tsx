import puppeteer from 'puppeteer-core'
import getLaunchOptions from '@/lib/chromium-launch'
import { supabaseAdmin } from '@/lib/supabase'
import { renderPDFComponent } from '@/lib/pdf-renderer'
import type { QuoteData, UserInput } from '@/utils/type'
import { NextResponse } from 'next/server'

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

    // 3. Convert React PDF component to HTML
    let html: string
    try {
      html = await renderPDFComponent(
        quoteData as QuoteData & { id: number },
        userInputData as UserInput
      )
    } catch (renderError) {
      // eslint-disable-next-line no-console
      console.error('Error rendering PDF component:', renderError)
      throw new Error(
        `Failed to render PDF component: ${
          renderError instanceof Error ? renderError.message : 'Unknown error'
        }`
      )
    }

    // 4. Add CSS styles inline (since we can't import CSS in server-side rendering)
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              color: #1a1a1a;
              line-height: 1.6;
            }
            .pdf-container {
              width: 100%;
              background: #ffffff;
            }
            .pdf-page {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm 15mm;
              margin: 0 auto;
              background: white;
              page-break-after: always;
              page-break-inside: avoid;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
            }
            .cover-page {
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              background: linear-gradient(135deg, #7839ee 0%, #5b21b6 100%);
              color: white;
            }
            .cover-content {
              width: 100%;
            }
            .company-logo {
              font-size: 72px;
              font-weight: 700;
              letter-spacing: 8px;
              margin: 0;
              text-transform: uppercase;
            }
            .report-title {
              font-size: 48px;
              font-weight: 600;
              margin: 20px 0 60px;
              text-transform: uppercase;
              letter-spacing: 4px;
            }
            .company-name {
              font-size: 32px;
              font-weight: 500;
              margin: 20px 0;
            }
            .generated-date {
              font-size: 18px;
              opacity: 0.9;
              margin-top: 20px;
            }
            .page-header {
              border-bottom: 3px solid #7839ee;
              padding-bottom: 15px;
              margin-bottom: 30px;
            }
            .page-header h2 {
              font-size: 32px;
              font-weight: 700;
              color: #7839ee;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .content-section {
              flex: 1;
            }
            .summary-text {
              font-size: 16px;
              line-height: 1.8;
              margin-bottom: 30px;
              text-align: justify;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-top: 20px;
            }
            .info-item {
              padding: 15px;
              background: #f8f9fa;
              border-left: 4px solid #7839ee;
              border-radius: 4px;
            }
            .info-item .label {
              display: block;
              font-size: 12px;
              font-weight: 600;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            .info-item .value {
              display: block;
              font-size: 18px;
              font-weight: 600;
              color: #1a1a1a;
            }
            .comparison-cards {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 30px;
              margin: 40px 0;
            }
            .comparison-card {
              padding: 30px;
              border-radius: 12px;
              text-align: center;
              border: 2px solid #e4e7ec;
            }
            .comparison-card.current {
              background: #f8f9fa;
            }
            .comparison-card.sanay {
              background: linear-gradient(135deg, #7839ee 0%, #5b21b6 100%);
              color: white;
              border-color: #7839ee;
            }
            .comparison-card h3 {
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 20px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .cost-amount {
              font-size: 48px;
              font-weight: 700;
              margin: 20px 0;
            }
            .comparison-card.sanay .cost-amount {
              color: #e5b800;
            }
            .cost-period {
              font-size: 14px;
              opacity: 0.8;
              margin-bottom: 15px;
            }
            .annual-cost {
              font-size: 18px;
              font-weight: 500;
              opacity: 0.9;
            }
            .savings-highlight {
              text-align: center;
              padding: 40px;
              background: linear-gradient(135deg, #12b76a 0%, #0d9d5f 100%);
              color: white;
              border-radius: 12px;
              margin-top: 40px;
            }
            .savings-highlight h3 {
              font-size: 24px;
              font-weight: 600;
              margin-bottom: 20px;
              text-transform: uppercase;
            }
            .savings-amount {
              font-size: 42px;
              font-weight: 700;
              margin: 15px 0;
            }
            .savings-annual {
              font-size: 20px;
              opacity: 0.9;
            }
            .efficiency-score {
              display: flex;
              align-items: center;
              gap: 60px;
              margin: 40px 0;
            }
            .score-circle {
              width: 200px;
              height: 200px;
              border-radius: 50%;
              background: linear-gradient(135deg, #7839ee 0%, #5b21b6 100%);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              flex-shrink: 0;
            }
            .score-value {
              font-size: 56px;
              font-weight: 700;
            }
            .score-label {
              font-size: 16px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 10px;
            }
            .efficiency-description {
              flex: 1;
            }
            .efficiency-description p {
              font-size: 16px;
              line-height: 1.8;
              margin-bottom: 20px;
            }
            .efficiency-benefits {
              list-style: none;
              padding: 0;
              margin-top: 20px;
            }
            .efficiency-benefits li {
              padding: 12px 0;
              padding-left: 30px;
              position: relative;
              font-size: 16px;
            }
            .efficiency-benefits li::before {
              content: '✓';
              position: absolute;
              left: 0;
              color: #12b76a;
              font-weight: 700;
              font-size: 20px;
            }
            .services-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              list-style: none;
              padding: 0;
              margin-bottom: 30px;
            }
            .service-item {
              padding: 15px;
              background: #f8f9fa;
              border-left: 4px solid #7839ee;
              border-radius: 4px;
              font-size: 16px;
              font-weight: 500;
            }
            .service-note {
              background: #e8f5e9;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .service-note p {
              margin: 8px 0;
              font-size: 15px;
            }
            .service-note strong {
              color: #12b76a;
            }
            .ai-summary {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 8px;
              border-left: 4px solid #7839ee;
            }
            .ai-summary h3 {
              font-size: 24px;
              font-weight: 600;
              color: #7839ee;
              margin-bottom: 15px;
            }
            .ai-summary p {
              font-size: 16px;
              line-height: 1.8;
              text-align: justify;
            }
            .recommendations h3 {
              font-size: 24px;
              font-weight: 600;
              color: #333;
              margin-bottom: 20px;
            }
            .tips-list {
              list-style: none;
              padding: 0;
            }
            .tips-list li {
              padding: 15px;
              margin-bottom: 15px;
              background: #f8f9fa;
              border-left: 4px solid #12b76a;
              border-radius: 4px;
              font-size: 16px;
              line-height: 1.6;
            }
            .next-steps h3 {
              font-size: 28px;
              font-weight: 600;
              color: #7839ee;
              margin-bottom: 30px;
              text-align: center;
            }
            .steps-list {
              display: flex;
              flex-direction: column;
              gap: 25px;
            }
            .step-item {
              display: flex;
              gap: 20px;
              align-items: flex-start;
            }
            .step-number {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              background: #7839ee;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              font-weight: 700;
              flex-shrink: 0;
            }
            .step-content {
              flex: 1;
            }
            .step-content h4 {
              font-size: 20px;
              font-weight: 600;
              color: #333;
              margin-bottom: 8px;
            }
            .step-content p {
              font-size: 15px;
              line-height: 1.6;
              color: #666;
            }
            .contact-info {
              text-align: center;
              padding: 40px;
              background: #f8f9fa;
              border-radius: 12px;
            }
            .contact-info h3 {
              font-size: 28px;
              font-weight: 600;
              color: #7839ee;
              margin-bottom: 20px;
            }
            .contact-info > p {
              font-size: 16px;
              line-height: 1.8;
              margin-bottom: 30px;
            }
            .contact-details {
              margin-top: 30px;
            }
            .contact-details p {
              font-size: 18px;
              margin: 15px 0;
            }
            .contact-details strong {
              color: #7839ee;
            }
            .disclaimer {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 8px;
              border: 1px solid #e4e7ec;
              margin-top: 30px;
            }
            .disclaimer h3 {
              font-size: 20px;
              font-weight: 600;
              color: #333;
              margin-bottom: 15px;
            }
            .disclaimer p {
              font-size: 14px;
              line-height: 1.7;
              color: #666;
              margin-bottom: 15px;
              text-align: justify;
            }
            .footer-note {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e4e7ec;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
            .business-overview {
              margin-top: 30px;
            }
            .business-overview h3 {
              font-size: 24px;
              font-weight: 600;
              color: #333;
              margin-bottom: 20px;
            }
            .services-list h3 {
              font-size: 24px;
              font-weight: 600;
              color: #333;
              margin-bottom: 25px;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `

    // 5. Launch a Chromium instance (serverless-friendly: use @sparticuz/chromium-min + puppeteer-core)
    let browser
    try {
      // chromium.executablePath can be a function in some versions or a Promise/value in others
      const launchOptions = await getLaunchOptions()

      browser = await puppeteer.launch(launchOptions)
    } catch (launchError) {
      // eslint-disable-next-line no-console
      console.error('Error launching Puppeteer:', launchError)
      throw new Error(
        `Failed to launch Puppeteer: ${
          launchError instanceof Error ? launchError.message : 'Unknown error'
        }`
      )
    }

    let pdfBuffer: Buffer
    try {
      const page = await browser.newPage()
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' })

      // 6. Generate PDF
      const pdfUint8Array = await page.pdf({
        format: 'a4',
        printBackground: true,
        margin: {
          top: '40px',
          bottom: '40px',
          left: '20px',
          right: '20px',
        },
      })

      // Convert Uint8Array to Buffer
      pdfBuffer = Buffer.from(pdfUint8Array)

      await browser.close()
    } catch (pdfError) {
      await browser.close().catch(() => {
        // Ignore close errors
      })
      // eslint-disable-next-line no-console
      console.error('Error generating PDF with Puppeteer:', pdfError)
      throw new Error(
        `Failed to generate PDF: ${
          pdfError instanceof Error ? pdfError.message : 'Unknown error'
        }`
      )
    }

    // 7. Upload to Supabase Storage
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
      pdfKey: filePath,
      pdfUrl: publicUrl,
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
