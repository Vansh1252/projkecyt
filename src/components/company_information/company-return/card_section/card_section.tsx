import Image from 'next/image'
import circleIcon from '@/images/Icon (1).png'
import { BENEFITS } from '@/utils/constants/company-information-constants'

export default function CardSection() {
  return (
    // Outer gradient border + glow
    <div className='w-full max-w-[540px]  rounded-2xl border-t-5 border-[#6857C5] shadow-[0_0_25px_rgba(125,77,255,0.35)]'>
      {/* Inner white card */}
      <div className='bg-white rounded-[22px] px-8 py-7 '>
        {/* Header */}
        <div className='flex items-start gap-4 mb-6'>
          {/* Purple icon box */}
          <div className='flex h-14 w-14 items-center justify-center rounded-[18px] shadow-[0_4px_6px_-4px_rgba(173,70,255,0.3),0_10px_15px_-3px_rgba(173,70,255,0.3)] bg-linear-to-r from-[#6857C5] to-[#582CAF]'>
            <svg
              width='32'
              height='32'
              viewBox='0 0 26 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16 1.4043V7.60011C16 8.44019 16 8.86022 16.1635 9.18109C16.3073 9.46334 16.5368 9.69281 16.819 9.83662C17.1399 10.0001 17.5599 10.0001 18.4 10.0001H24.5958M8.5 22L11.5 25L18.25 18.25M16 1H8.2C5.67976 1 4.41965 1 3.45704 1.49047C2.61031 1.9219 1.9219 2.61031 1.49047 3.45704C1 4.41965 1 5.67976 1 8.2V23.8C1 26.3202 1 27.5804 1.49047 28.543C1.9219 29.3897 2.61031 30.0781 3.45704 30.5095C4.41965 31 5.67976 31 8.2 31H17.8C20.3202 31 21.5804 31 22.543 30.5095C23.3897 30.0781 24.0781 29.3897 24.5095 28.543C25 27.5804 25 26.3202 25 23.8V10L16 1Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>

          <div>
            <h4 className='text-xl font-bold text-gray-900'>
              What you&apos;ll get
            </h4>
            <p className='text-gray-600 text-sm mt-1'>
              Your comprehensive analysis includes:
            </p>
          </div>
        </div>

        {/* Bullet points */}
        <ul className='space-y-4'>
          {BENEFITS.map(item => (
            <li key={item} className='flex items-center gap-3'>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-[#F1E8FF] shadow-sm'>
                <Image
                  src={circleIcon}
                  alt='check'
                  width={16}
                  height={16}
                  // className='w-5 h-5'
                />
              </div>
              <span className='text-lg text-[#535862]'>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
