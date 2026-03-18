import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CWTH Events & Training Calendar',
  description:
    'Upcoming training, events and development opportunities for primary care staff across Coventry & Warwickshire',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
