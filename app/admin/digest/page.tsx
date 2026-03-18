import DigestPanel from '@/components/admin/DigestPanel'

export default function DigestPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cwth-dark font-heading">
          Send Weekly Digest
        </h1>
        <p className="text-sm text-cwth-mid-grey mt-1">
          Preview and send this week&apos;s events as an email digest to your team.
        </p>
      </div>
      <DigestPanel />
    </div>
  )
}
