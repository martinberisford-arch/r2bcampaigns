// This layout intentionally overrides the parent /admin layout so the login
// page is rendered without the auth check that would cause an infinite redirect.
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
