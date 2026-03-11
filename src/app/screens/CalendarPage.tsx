import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { listCalendarItems } from '../../features/calendar/api';
import { queryKeys } from '../../lib/query/keys';
import { monthLabel } from '../../lib/utils';

export function CalendarPage() {
  const [view, setView] = useState<'Agenda' | 'Month'>('Agenda');
  const { data = [] } = useQuery({ queryKey: queryKeys.calendar, queryFn: () => listCalendarItems() });

  const grouped = useMemo(() => data.reduce<Record<string, typeof data>>((acc, item) => {
    const key = monthLabel(item.starts_at);
    acc[key] = [...(acc[key] ?? []), item];
    return acc;
  }, {}), [data]);

  return (
    <div className="page-grid">
      <header className="page-header"><h2>Calendar</h2><p>Shared schedule of key project dates and activity.</p></header>
      <div className="quick-actions"><button className={`btn ${view === 'Agenda' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('Agenda')}>Agenda</button><button className={`btn ${view === 'Month' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView('Month')}>Month</button></div>
      <Card>
        {view === 'Agenda' ? Object.entries(grouped).map(([month, items]) => (
          <div key={month} className="month-block"><h3>{month}</h3><ul className="stack-list">{items.map((item) => <li key={item.id}><strong>{item.title}</strong><p>{new Date(item.starts_at).toLocaleString()} {item.location ? `· ${item.location}` : ''}</p></li>)}</ul></div>
        )) : <p className="meta">Month view keeps dates uncluttered. Use Agenda for full details.</p>}
      </Card>
    </div>
  );
}
