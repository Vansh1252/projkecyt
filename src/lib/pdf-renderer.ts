import React from 'react'
// TODO: QuotePDFComponent doesn't exist - this file may be unused
// import QuotePDFComponent from '@/components/pdf/QuotePDFComponent'
import type { QuoteData, UserInput } from '@/utils/type'

/**
 * Server-side utility to render React component to HTML string
 * Uses dynamic import for react-dom/server to avoid Next.js restrictions
 */
export async function renderPDFComponent(
  _quote: QuoteData & { id: number },
  _userInput: UserInput
): Promise<string> {
  // Dynamic import to avoid Next.js restrictions on react-dom/server
  const { default: ReactDOMServer } = await import('react-dom/server')

  // TODO: QuotePDFComponent doesn't exist - using ReactPDFRenderComponents instead
  // This function may be unused - check if it's referenced anywhere
  const ReactPDFRenderComponents = (
    await import('@/components/pdf/reactpdfrendercomponenets')
  ).default
  return ReactDOMServer.renderToString(
    React.createElement(ReactPDFRenderComponents)
  )
}
