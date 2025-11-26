'use client'

import Link from 'next/link'
import { Button } from '@/components/base/buttons/button'
import { useEffect, useState } from 'react'
import { clearFormData } from '@/utils/sessionStorage'
import { axiosInstance } from '@/utils/axios'

export default function EmailSent() {
  const [quoteId, setQuoteId] = useState<string | null>(null)
  const [emailAddress, setEmailAddress] = useState<string | null>(null)

  useEffect(() => {
    // Get quoteId from sessionStorage
    const storedQuoteId = sessionStorage.getItem('pendingQuoteId')
    if (storedQuoteId) {
      setQuoteId(storedQuoteId)
    }
  }, [])

  useEffect(() => {
    // Fetch email address if quoteId is available
    if (quoteId) {
      axiosInstance
        .get(`/api/review_input/${quoteId}`)
        .then(response => {
          if (response.data.ok && response.data.data?.business_email) {
            setEmailAddress(response.data.data.business_email)
          }
        })
        .catch(() => {
          // Error fetching email address - silently fail
        })
    }
  }, [quoteId])
  const continuehandler = () => {
    clearFormData()
  }
  return (
    <div className='xl:w-[1216px] m-auto bg-white min-h-screen flex flex-col items-center justify-center px-4 pb-10 sm:px-6 md:px-10'>
      <div className='text-center max-w-2xl'>
        {/* Success Icon */}
        <div className='mb-8 flex justify-center'>
          <div className='w-20 h-20 bg-[#12B76A] rounded-full flex items-center justify-center'>
            <svg
              width={40}
              height={40}
              viewBox='0 0 24 24'
              fill='none'
              className='text-white'
            >
              <path
                d='M20 6L9 17L4 12'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className='font-semibold text-2xl sm:text-3xl md:text-4xl mb-4'>
          Email Sent Successfully!
        </h1>

        {/* Message */}
        <p className='text-[#535862] text-base sm:text-lg mb-6'>
          Your ROI report has been sent to{' '}
          {emailAddress ? (
            <strong className='text-[#7839EE]'>{emailAddress}</strong>
          ) : (
            'your email address'
          )}
          .
        </p>

        <div className='bg-[#f8f9fa] border border-[#E4E7EC] rounded-2xl p-6 mb-8 text-left'>
          <h2 className='font-semibold text-xl mb-4 text-[#7839EE]'>
            What's Next?
          </h2>
          <ul className='space-y-3 text-[#535862]'>
            <li className='flex items-start gap-3'>
              <span className='text-[#12B76A] font-bold mt-1'>✓</span>
              <span>
                Check your inbox (and spam folder) for the email with your PDF
                report attached
              </span>
            </li>
            <li className='flex items-start gap-3'>
              <span className='text-[#12B76A] font-bold mt-1'>✓</span>
              <span>
                Review your personalized ROI report with cost comparisons and
                recommendations
              </span>
            </li>
            <li className='flex items-start gap-3'>
              <span className='text-[#12B76A] font-bold mt-1'>✓</span>
              <span>
                Book a consultation call to discuss how Sanay can help your
                business
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-4 justify-center'>
          {quoteId && (
            <Link href={`/result-screen`}>
              <Button className='px-6 py-3 text-[14px] bg-white text-black hover:bg-active'>
                Back to Report
              </Button>
            </Link>
          )}

          <Link href='/company-information'>
            <Button onClick={continuehandler} className='px-6 py-3 text-[14px]'>
              Create New Quote
            </Button>
          </Link>

          <Link href='/book-call'>
            <Button className='px-6 py-3 text-[14px] bg-white text-black hover:bg-active'>
              Book a Call
            </Button>
          </Link>
        </div>

        {/* Support Info */}
        <p className='mt-8 text-sm text-[#999]'>
          Need help? Contact us at{' '}
          <a
            href='mailto:info@sanay.co.uk'
            className='text-[#7839EE] hover:underline'
          >
            info@sanaybpo.com
          </a>
        </p>
      </div>
    </div>
  )
}
