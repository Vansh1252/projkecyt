import { readFileSync } from 'fs'

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
