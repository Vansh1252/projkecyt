import React from 'react'
// import QuotePDFComponent from '@/components/pdf/QuotePDFComponent'
import ReactPDFRenderComponents from '@/components/pdf/reactpdfrendercomponenets'
// import type { QuoteData, UserInput } from '@/utils/type'

/**
 * Server-side utility to render React component to HTML string
 * Uses dynamic import for react-dom/server to avoid Next.js restrictions
 */
export async function renderPDFComponent(): Promise<string> {
  // Dynamic import to avoid Next.js restrictions on react-dom/server
  const { default: ReactDOMServer } = await import('react-dom/server')

  return ReactDOMServer.renderToString(
    React.createElement(ReactPDFRenderComponents)
  )
}
