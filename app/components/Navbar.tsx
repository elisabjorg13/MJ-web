import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-[70px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className='flex flex-col'>
            <Link href="/">
              <h1>Magnús Jóhann</h1>
            </Link>
            <div className='ml-7 mt-1'>
            <p>Artist, composer, producer</p>
            </div>
          </div>
          {/* Nav Links */}
          <div className="flex gap-8 mt-auto">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              <p>Home</p>
            </Link>
            <Link href="/about" className="hover:text-gray-600 transition-colors">
              <p>About</p>

            </Link>
            <Link href="/contact" className="hover:text-gray-600 transition-colors">
              <p>Contact</p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

