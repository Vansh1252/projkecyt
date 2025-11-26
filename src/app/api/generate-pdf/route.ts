import puppeteer from 'puppeteer-core'
import getLaunchOptions from '@/lib/chromium-launch'

export async function POST(req: Request) {
  try {
    const { html } = await req.json() // Receive HTML string

    // chromium.executablePath can be a function in some versions or a Promise/value in others
    const launchOptions = await getLaunchOptions()
    const browser = await puppeteer.launch(launchOptions)

    const page = await browser.newPage()

    // Load HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    })

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'a4',
      printBackground: true,
      margin: {
        top: '30px',
        bottom: '30px',
        left: '20px',
        right: '20px',
      },
    })

    await browser.close()

    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('PDF Error:', error)
    return new Response('Failed to generate PDF', { status: 500 })
  }
}
