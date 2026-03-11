import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRealtimeInvalidation } from '../../lib/supabase/realtime';
import { queryKeys } from '../../lib/query/keys';
import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { signOut } from '../../features/auth/api';

const links = [
  ['/', 'Home'],
  ['/projects', 'Projects'],
  ['/calendar', 'Calendar'],
  ['/outcomes', 'Outcomes'],
  ['/resources', 'Resources'],
  ['/settings', 'Settings']
] as const;

export function AppShell() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const channels = useMemo(() => [
    { table: 'projects', queryKey: queryKeys.projects },
    { table: 'actions', queryKey: queryKeys.actions },
    { table: 'calendar_items', queryKey: queryKeys.calendar },
    { table: 'outcomes', queryKey: queryKeys.outcomes },
    { table: 'resources', queryKey: queryKeys.resources }
  ], []);

  useRealtimeInvalidation(queryClient, channels);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div>
          <p className="brand-kicker">Roots2Branches</p>
          <h1 className="brand-title">Project Hub</h1>
        </div>
        <nav className="sidebar-nav">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="meta">Signed in as Community Member</p>
          <Button variant="ghost" onClick={() => signOut()}>Sign out</Button>
        </div>
      </aside>
      <div className="content-shell">
        <header className="topbar">
          <Button variant="secondary" onClick={() => setOpen((x) => !x)} className="mobile-only">Menu</Button>
          <p className="meta">Roots2Branches internal workspace</p>
        </header>
        <main className="page-wrap">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
