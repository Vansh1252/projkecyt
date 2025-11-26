'use client'

import Link from 'next/link'
import { Button } from '@/components/base/buttons/button'
import { ArrowLeft } from '@untitledui/icons'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { axiosInstance } from '@/utils/axios'

interface ActionButtonsProps {
  onBack: () => void
  quoteId: string | null
}

export default function ActionButtons({ onBack, quoteId }: ActionButtonsProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const emailsentclick = async () => {
    if (!quoteId) return

    try {
      setIsSendingEmail(true)

      const response = await axiosInstance.post('/api/email', { quoteId })

      if (response.data.ok) {
        window.location.href = `/email-sent?quoteId=${quoteId}`
      } else {
        setIsSendingEmail(false)
        throw new Error(response.data.error || 'Failed to send email')
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsSendingEmail(false)
      // eslint-disable-next-line no-console
      console.error('Error sending email:', error)
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to send email. Please try again or contact support.'
      alert(errorMessage)
    }
  }

  const downloadhandleclick = async () => {
    if (!quoteId) return
    try {
      setIsDownloading(true)
      const response = await axiosInstance.get(`/api/pdf/${quoteId}`, {
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sanay-quote-${quoteId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setIsDownloading(false)
      toast.success('PDF downloaded successfully!')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsDownloading(false)
      // eslint-disable-next-line no-console
      console.error('Error downloading PDF:', error)
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Failed to download PDF. Please try again.'
      toast.error(errorMessage)
    }
  }
  return (
    <div className='xl:w-[1216px] flex flex-wrap gap-4 justify-center'>
      <Button
        type='button'
        onClick={onBack}
        className='px-6 py-3 text-[14px] bg-white text-black hover:bg-active'
        iconLeading={ArrowLeft}
      >
        Back
      </Button>

      {/* DOWNLOAD BUTTON */}
      <Button
        className='px-6 py-3 text-[14px]'
        onClick={downloadhandleclick}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <div className='flex items-center gap-2'>
            <svg
              className='animate-spin'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
            >
              <circle
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
                strokeDasharray='60'
                strokeDashoffset='20'
              />
            </svg>
            Loading…
          </div>
        ) : (
          <div className='flex justify-center items-center text-center gap-1'>
            <svg width={20} height={20} viewBox='0 0 24 24' fill='none'>
              <path
                d='M20 12.5V6.8C20 5.11984 20 4.27976 19.673 3.63803C19.3854 3.07354 18.9265 2.6146 18.362 2.32698C17.7202 2 16.8802 2 15.2 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.1198 22 8.79986 22H12.5M14 11H8M10 15H8M16 7H8M15 19L18 22M18 22L21 19M18 22V16'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Download PDF Report
          </div>
        )}
      </Button>

      {/* EMAIL BUTTON */}
      <Button
        className='px-6 py-3 text-[14px] bg-white text-black hover:bg-active'
        onClick={emailsentclick}
        disabled={isSendingEmail}
      >
        {isSendingEmail ? (
          'Sending...'
        ) : (
          <div className='flex justify-center items-center text-center gap-1'>
            <svg width={20} height={20} viewBox='0 0 24 24' fill='none'>
              <path
                d='M2 7L10.1649 12.7154C10.8261 13.1783 11.1567 13.4097 11.5163 13.4993C11.8339 13.5785 12.1661 13.5785 12.4837 13.4993C12.8433 13.4097 13.1739 13.1783 13.8351 12.7154L22 7M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Email Report
          </div>
        )}
      </Button>

      <Link href='/book-call'>
        <Button className='px-6 py-3 text-[14px]  bg-white text-black  hover:bg-active'>
          <div className='flex justify-center items-center text-center gap-1'>
            <svg width={20} height={20} viewBox='0 0 24 24' fill='none'>
              <path
                d='M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 6.11984 22 7.8 22Z'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Book a Call
          </div>
        </Button>
      </Link>
    </div>
  )
}
