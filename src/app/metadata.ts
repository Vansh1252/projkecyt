import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sanay - Financial Services ROI Calculator',
  description:
    'Calculate your ROI with Sanay financial services. Get personalized quotes for bookkeeping, VAT returns, payroll, and more.',
  keywords: [
    'bookkeeping',
    'VAT returns',
    'payroll',
    'financial services',
    'accounting',
    'UK business',
    'ROI calculator',
  ],
  authors: [{ name: 'Sanay' }],
  creator: 'Sanay',
  publisher: 'Sanay',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://sanay.co.uk'
  ),
  openGraph: {
    title: 'Sanay - Financial Services ROI Calculator',
    description:
      'Calculate your ROI with Sanay financial services. Get personalized quotes for bookkeeping, VAT returns, payroll, and more.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sanay.co.uk',
    siteName: 'Sanay',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanay - Financial Services ROI Calculator',
    description:
      'Calculate your ROI with Sanay financial services. Get personalized quotes for bookkeeping, VAT returns, payroll, and more.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}
