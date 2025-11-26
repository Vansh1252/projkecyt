import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '', // Use empty string for relative URLs
  timeout: 30000, // Request timeout in milliseconds (30 seconds for PDF generation)
  headers: {
    'Content-Type': 'application/json',
  },
})

export { axiosInstance }
