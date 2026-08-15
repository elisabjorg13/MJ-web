'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

function NavItem({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <div className="relative flex flex-col items-center">
      <h1
        className={`absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none ${
          active ? '' : 'invisible'
        }`}
      >
        {label}
      </h1>
      <Link href={href} className={active ? 'invisible' : ''}>
        <p>{label}</p>
      </Link>
    </div>
  )
}

function NavItems({
  isWorks,
  isInfo,
  isLive,
}: {
  isWorks: boolean
  isInfo: boolean
  isLive: boolean
}) {
  return (
    <div className="flex flex-row items-end gap-8">
      <NavItem href="/works" label="Works" active={isWorks} />
      <NavItem href="/info" label="Info" active={isInfo} />
      <NavItem href="/live" label="Live" active={isLive} />
    </div>
  )
}

export default function Navbar() {
  const pathname = usePathname();
  const isWorks = pathname === '/works';
  const isInfo = pathname === '/info';
  const isLive = pathname === '/live';

  const navRef = useRef<HTMLElement>(null);
  const [overlayHeight, setOverlayHeight] = useState(71);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const update = () => setOverlayHeight(el.getBoundingClientRect().height);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      {/*
        Figma Color_Overlay — must be its own fixed layer (not inside the nav
        stacking context) so lighten composites with page content.
        #EEEEEE + lighten over a white page reads as white; over black rows
        it becomes #EEEEEE and wipes the list text.
      */}
      <div
        aria-hidden
        className="fixed top-0 left-0 right-0 z-40 bg-[#EEEEEE] mix-blend-lighten pointer-events-none"
        style={{ height: overlayHeight }}
      />

      {/* Text only — no background, so it isn't affected by the blend */}
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50">
        <div className="md:hidden flex flex-col items-center text-center px-2 pt-3 pb-2">
          <Link href="/">
            <h1>Magnús Jóhann</h1>
          </Link>
          <p>Artist, composer & producer</p>
          <div className="pt-12">
            <NavItems isWorks={isWorks} isInfo={isInfo} isLive={isLive} />
          </div>
        </div>

        <div className="hidden md:block h-[71px]">
          <div className="w-full px-2 md:px-[18px] lg:px-5 h-full">
            <div className="mx-auto h-full flex items-end">
              <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-0.5">
                <div className="flex flex-col text-center justify-center">
                  <Link href="/">
                    <h1>Magnús Jóhann</h1>
                  </Link>
                  <p>Artist, composer & producer</p>
                </div>

                <div className="hidden lg:block"></div>

                <div className="flex justify-center">
                  <NavItems isWorks={isWorks} isInfo={isInfo} isLive={isLive} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
