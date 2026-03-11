import { Card } from '../../components/ui/Card';

export function SettingsPage() {
  return (
    <div className="page-grid">
      <header className="page-header"><h2>Settings</h2><p>Keep organisation details and access simple and tidy.</p></header>
      <Card><h3>Organisation</h3><p className="meta">Roots2Branches · Hyper-local family autism support charity.</p></Card>
      <Card><h3>Access</h3><p className="meta">Roles: Admin and Member.</p></Card>
      <Card><h3>Data</h3><p className="meta">Export and seed controls can be added from Supabase SQL editor for now.</p></Card>
    </div>
  );
}
