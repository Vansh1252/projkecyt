import Image from 'next/image'
import logo_1 from '@/images/Group 1.png'
import featured_icon from '@/images/Featured icon.svg'
import featured_icon_2 from '@/images/Featured icon_2.svg'
import { Button } from '@/components/base/buttons/button'
import Link from 'next/link'

export default function IntroPage() {
  return (
    <div className='xl:w-[1216px] m-auto  bg-white min-h-screen flex flex-col items-center px-4 pb-4 sm:px-6 sm:pb-6 md:px-10 md:pb-10'>
      {/* HERO SECTION */}
      <div
        className='flex flex-col items-center justify-center pt-12 sm:pt-16 md:pt-20 pb-10 w-full gap-6'
        style={{ opacity: 1 }}
      >
        <Image
          src={logo_1}
          alt='logo'
          width={150}
          height={150}
          className='w-28 sm:w-32 md:w-40 lg:w-48'
        />
        <h1 className='font-semibold xl:text-6xl lg:text-5xl md:text-4xl sm:text-3xl text-2xl leading-tight tracking-tight text-center font-display '>
          Discover how much you could save <br /> with Sanay
        </h1>
        <p className='text-xs sm:text-sm text-gray-500 text-center max-w-sm'>
          Get a personalised cost and ROI analysis in under 3 minutes
        </p>
        {/* BUTTON */}
        <Link href='/company-information'>
          <Button className='Button px-6 py-3 sm:px-8 sm:py-3 md:px-10 md:py-4'>
            Start Free Calculations
          </Button>
        </Link>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-4'>
          <div className='flex flex-row items-center gap-2'>
            <Image src={featured_icon} width={30} height={30} alt='icon' />
            <p className='text-sm sm:text-base'>
              Automate your financial admin
            </p>
          </div>
          <div className='flex flex-row items-center gap-2'>
            <Image src={featured_icon_2} width={30} height={30} alt='icon' />
            <p className='text-sm sm:text-base text-bold'>
              Instantly see how much you could save
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className='w-full flex flex-col xl:flex-row xl:justify-evenly gap-10 pb-12'>
        <div className='flex flex-col items-center'>
          <p className='text-[#7839EE] font-bold text-4xl sm:text-5xl md:text-6xl'>
            500+
          </p>
          <p className='text-[#080B13] font-medium text-base sm:text-lg mt-1'>
            Businesses served
          </p>
        </div>
        <div className='flex flex-col items-center'>
          <p
            className='text-[#7839EE] font-bold 
                  text-4xl sm:text-5xl md:text-6xl'
          >
            £2.4M
          </p>
          <p className='text-[#080B13] font-medium text-base sm:text-lg mt-1'>
            Total savings generated
          </p>
        </div>
        <div className='flex flex-col items-center'>
          <p
            className='text-[#7839EE] font-bold 
                  text-4xl sm:text-5xl md:text-6xl'
          >
            4.9/5
          </p>
          <p className='text-[#080B13] font-medium text-base sm:text-lg mt-1'>
            Client satisfaction
          </p>
        </div>
      </div>
    </div>
  )
}
