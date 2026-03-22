import DigestPanel from '@/components/admin/DigestPanel'

export default function DigestPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cwth-dark font-heading">
          Weekly Digest
        </h1>
        <p className="text-sm text-cwth-mid-grey mt-1">
          Generate and copy this week&apos;s upcoming events for email distribution. Paste into Outlook and send manually — no mailing list required.
        </p>
      </div>
      <DigestPanel />
    </div>
  )
}
