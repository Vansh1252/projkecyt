import { Document } from '@react-pdf/renderer'
import Pdf_page1 from './PDF_Pages/pdf_page1'
import { readFileSync } from 'fs'
import Pdf_page2 from './PDF_Pages/pdf_page2'

// Convert image to base64 for @react-pdf/renderer
export const getImageBase64 = (imagePath: string): string => {
  try {
    const imageBuffer = readFileSync(imagePath)
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg'
    return `data:${mimeType};base64,${imageBuffer.toString('base64')}`
  } catch {
    return ''
  }
}

export default function ReactPDFRenderComponents() {
  return (
    <Document>
      <Pdf_page1 />
      <Pdf_page2 />
    </Document>
  )
}
