import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Overview' },
  { to: '/projects', label: 'Projects' },
  { to: '/calendar', label: 'Dates' },
  { to: '/resources', label: 'Resources' },
  { to: '/stories', label: 'Impact stories' }
];

export function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-emerald-200 bg-white/95">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-sm text-emerald-700">Roots2Branches</p>
            <h1 className="text-xl font-semibold">Project Hub</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 text-sm no-underline ${isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-6">
        <Outlet />
      </main>
    </div>
  );
}
