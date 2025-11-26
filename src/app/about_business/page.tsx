'use client'

import { useState, useEffect } from 'react'
import AboutBusinessSkeleton from '@/components/skeleton-loader/about-business-skeleton'
import AboutBusinessContent from '@/components/about-business/about-business-content'

export default function AboutBusiness() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loader for 1 second, then show content
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <AboutBusinessSkeleton />
  }

  return <AboutBusinessContent />
}
