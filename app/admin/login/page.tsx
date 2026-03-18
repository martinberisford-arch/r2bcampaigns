'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError('Invalid email or password. Please try again.')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/cwth-logo.svg"
            alt="Coventry & Warwickshire Training Hub"
            width={200}
            height={48}
            className="mx-auto"
          />
          <h1 className="mt-4 text-xl font-bold text-cwth-dark font-heading">
            Admin Login
          </h1>
          <p className="text-sm text-cwth-mid-grey mt-1">
            Events &amp; Training Calendar
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-cwth-border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-cwth-dark mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full h-10 px-3 rounded-md border border-cwth-border text-sm text-cwth-dark focus:outline-none focus:ring-2 focus:ring-cwth-teal"
                placeholder="admin@cwtraininghub.co.uk"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-cwth-dark mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full h-10 px-3 rounded-md border border-cwth-border text-sm text-cwth-dark focus:outline-none focus:ring-2 focus:ring-cwth-teal"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-cwth-blue text-white font-semibold rounded-md hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center mt-4 text-xs text-cwth-mid-grey">
          Staff calendar:{' '}
          <a href="/" className="text-cwth-teal hover:underline">
            View public calendar
          </a>
        </p>
      </div>
    </div>
  )
}
