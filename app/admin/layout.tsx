import type { Metadata } from 'next'
import Link from 'next/link'
import AdminLogoutButton from './LogoutButton'

export const metadata: Metadata = {
  title: 'Admin — CWTH Events Calendar',
}

// Auth is enforced by middleware.ts — no session check here to avoid
// wrapping /admin/login in this layout and causing a redirect loop.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-cwth-dark text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-bold text-sm text-white hover:text-blue-200 transition-colors">
              CWTH Admin
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link
                href="/admin"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Events
              </Link>
              <Link
                href="/admin/events/new"
                className="text-gray-300 hover:text-white transition-colors"
              >
                New Event
              </Link>
              <Link
                href="/admin/upload"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Bulk Upload
              </Link>
              <Link
                href="/admin/digest"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Send Digest
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              View Calendar ↗
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="sm:hidden bg-cwth-dark border-t border-gray-700 px-4 py-2 flex gap-4 text-sm">
        <Link href="/admin" className="text-gray-300 hover:text-white">
          Events
        </Link>
        <Link href="/admin/events/new" className="text-gray-300 hover:text-white">
          New Event
        </Link>
        <Link href="/admin/upload" className="text-gray-300 hover:text-white">
          Upload
        </Link>
        <Link href="/admin/digest" className="text-gray-300 hover:text-white">
          Digest
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
