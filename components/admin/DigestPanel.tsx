'use client'

import { useState } from 'react'
import { Toast, useToast } from '@/components/shared/Toast'

export default function DigestPanel() {
  const { toast, showToast, hideToast } = useToast()
  const [preview, setPreview] = useState<string | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState(
    process.env.NEXT_PUBLIC_DIGEST_EMAIL_HINT ?? ''
  )
  const [eventCount, setEventCount] = useState<number | null>(null)

  async function handlePreview() {
    setLoadingPreview(true)
    setPreview(null)
    try {
      const res = await fetch('/api/digest/preview')
      if (!res.ok) throw new Error('Preview failed')
      const data = await res.json()
      setPreview(data.html)
      setEventCount(data.eventCount)
    } catch {
      showToast('Failed to load preview. Check your Supabase connection.', 'error')
    } finally {
      setLoadingPreview(false)
    }
  }

  async function handleSend() {
    if (!recipientEmail.trim()) {
      showToast('Please enter a recipient email address.', 'error')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/digest/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipientEmail }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Send failed')
      }
      showToast('Weekly digest sent successfully!', 'success')
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to send digest.',
        'error'
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-cwth-light-blue rounded-lg p-5 border border-blue-200">
        <h2 className="text-base font-bold text-cwth-dark mb-1">
          How it works
        </h2>
        <ol className="text-sm text-cwth-dark space-y-1 list-decimal list-inside">
          <li>Click &ldquo;Preview Digest&rdquo; to see this week&apos;s events formatted as an email.</li>
          <li>Review the preview below.</li>
          <li>Enter the recipient email address and click &ldquo;Send Digest&rdquo;.</li>
        </ol>
      </div>

      {/* Preview button */}
      <div>
        <button
          onClick={handlePreview}
          disabled={loadingPreview}
          className="px-5 py-2.5 bg-cwth-blue text-white font-semibold rounded-md hover:bg-blue-800 transition-colors disabled:opacity-60"
        >
          {loadingPreview ? 'Loading preview…' : 'Preview Digest'}
        </button>
        {eventCount !== null && (
          <span className="ml-3 text-sm text-cwth-mid-grey">
            {eventCount} event{eventCount !== 1 ? 's' : ''} in the next 7 days
          </span>
        )}
      </div>

      {/* Preview iframe */}
      {preview && (
        <div className="border border-cwth-border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-cwth-border flex items-center justify-between">
            <span className="text-xs font-semibold text-cwth-mid-grey uppercase tracking-wide">
              Email Preview
            </span>
            <span className="text-xs text-cwth-mid-grey">
              This is how the email will look in most clients.
            </span>
          </div>
          <iframe
            srcDoc={preview}
            title="Digest email preview"
            className="w-full h-[500px] bg-white"
            sandbox="allow-same-origin"
          />
        </div>
      )}

      {/* Send section */}
      <div className="border border-cwth-border rounded-lg p-5 bg-white">
        <h3 className="text-sm font-bold text-cwth-dark mb-3">
          Send Digest Email
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label
              htmlFor="recipient-email"
              className="block text-xs font-semibold text-cwth-mid-grey mb-1"
            >
              Recipient Email Address(es)
            </label>
            <input
              id="recipient-email"
              type="email"
              value={recipientEmail}
              onChange={e => setRecipientEmail(e.target.value)}
              placeholder="team@cwtraininghub.co.uk"
              className="w-full h-9 px-3 rounded-md border border-cwth-border text-sm text-cwth-dark focus:outline-none focus:ring-2 focus:ring-cwth-teal"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSend}
              disabled={sending || !preview}
              className="h-9 px-5 bg-cwth-teal text-white font-semibold rounded-md hover:bg-teal-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              title={!preview ? 'Generate a preview first' : undefined}
            >
              {sending ? 'Sending…' : 'Send Digest'}
            </button>
          </div>
        </div>
        {!preview && (
          <p className="text-xs text-cwth-mid-grey mt-2">
            Generate a preview first before sending.
          </p>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  )
}
