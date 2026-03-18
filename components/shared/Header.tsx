import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-cwth-blue text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="CWTH Home">
              <Image
                src="/cwth-logo.svg"
                alt="Coventry & Warwickshire Training Hub"
                width={180}
                height={43}
                priority
              />
            </Link>
            <div className="hidden sm:block border-l border-blue-400 pl-4">
              <h1 className="text-lg font-bold font-heading leading-tight">
                Events &amp; Training Calendar
              </h1>
              <p className="text-xs text-blue-200 leading-snug max-w-sm">
                Upcoming training, events and development opportunities for primary care staff across Coventry &amp; Warwickshire
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="text-xs text-blue-200 hover:text-white transition-colors underline underline-offset-2"
          >
            Admin Login
          </Link>
        </div>
        <div className="sm:hidden mt-3 border-t border-blue-600 pt-3">
          <h1 className="text-base font-bold font-heading leading-tight">
            Events &amp; Training Calendar
          </h1>
          <p className="text-xs text-blue-200 leading-snug mt-1">
            Upcoming training, events and development opportunities for primary care staff across Coventry &amp; Warwickshire
          </p>
        </div>
      </div>
    </header>
  )
}
