import { Document } from '@react-pdf/renderer'
import Pdf_page1 from './PDF_Pages/pdf_page1'
import Pdf_page2 from './PDF_Pages/pdf_page2'

export default function ReactPDFRenderComponents() {
  return (
    <Document>
      <Pdf_page1 />
      <Pdf_page2 />
    </Document>
  )
}
