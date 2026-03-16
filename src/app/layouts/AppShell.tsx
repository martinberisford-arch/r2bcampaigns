import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { signOut } from '../../features/auth/api';
import { queryKeys } from '../../lib/query/keys';
import { useRealtimeInvalidation } from '../../lib/supabase/realtime';

const links = [
  ['/', 'Home', 'Overview and next steps'],
  ['/projects', 'Projects', 'Plan and coordinate activity'],
  ['/calendar', 'Calendar', 'Shared key dates'],
  ['/outcomes', 'Outcomes', 'Impact notes and stories'],
  ['/resources', 'Resources', 'Useful links and templates'],
  ['/settings', 'Settings', 'Organisation and access']
] as const;

export function AppShell() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const location = useLocation();

  const channels = useMemo(
    () => [
      { table: 'projects', queryKey: queryKeys.projects },
      { table: 'actions', queryKey: queryKeys.actions },
      { table: 'calendar_items', queryKey: queryKeys.calendar },
      { table: 'outcomes', queryKey: queryKeys.outcomes },
      { table: 'resources', queryKey: queryKeys.resources }
    ],
    []
  );

  useRealtimeInvalidation(queryClient, channels);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand-block">
          <p className="brand-kicker">Roots2Branches</p>
          <h1 className="brand-title">Project Hub</h1>
          <p className="brand-summary">Warm planning and impact tracking for local family support work.</p>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {links.map(([to, label, description]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span>{label}</span>
              <small>{description}</small>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p className="meta">Signed in as Community Member</p>
          <Button variant="ghost" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <Button variant="secondary" onClick={() => setOpen((x) => !x)} className="mobile-only">
            Menu
          </Button>
          <div>
            <p className="meta">Roots2Branches internal workspace</p>
            <p className="topbar-route">
            {location.pathname === '/'
              ? 'Home'
              : location.pathname
                  .slice(1)
                  .split('/')
                  .map((segment) => segment.replace(/-/g, ' '))
                  .join(' › ')}
          </p>
          </div>
        </header>

        <main className="page-wrap">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
