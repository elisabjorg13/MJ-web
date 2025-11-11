'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname();


  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/60 z-50 h-[150px] md:h-[70px]">
      <div className="w-full px-2 md:px-[18px] lg:px-5 h-full">
        <div className="mx-auto h-full flex items-end">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">

            {/* Column 1: Magnús Jóhann + subtitle */}
            <div className="flex flex-col text-center justify-center">
              <Link href="/">
                <h1>Magnús Jóhann</h1>
              </Link>
              <p className=" mt-1">Artist, composer & producer</p>
            </div>

            {/* Column 2: Empty on desktop */}
            <div className="hidden lg:block"></div>

            {/* Column 3: Works / Info nav links */}
            <div className="flex flex-col items-center text-center invisible">
              <div className='flex flex-row min-h-[48px] items-center'>
                {pathname === '/works' && <h1 className='mr-16'>Works</h1>}
                {pathname === '/info' && <h1 className='ml-16'>Info</h1>}
                {pathname !== '/works' && pathname !== '/info' && <h1 className='opacity-0'>Works</h1>}
              </div>
              <div className='flex flex-row text-center justify-center gap-8'>
                <Link href="/works" className={`transition-colors ${pathname === '/works' ? 'opacity-0 pointer-events-none select-none' : 'hover:text-gray-600'}`}>
                  <p>Works</p>
                </Link>
                <Link href="/info" className={`transition-colors ${pathname === '/info' ? 'opacity-0 pointer-events-none select-none' : 'hover:text-gray-600'}`}>
                  <p>Info</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </nav >
  )
}

