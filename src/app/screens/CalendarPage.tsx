import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/Card';
import { listCalendarItems } from '../../domains/calendar/api';

export function CalendarPage() {
  const calendar = useQuery({ queryKey: ['calendar'], queryFn: listCalendarItems });

  return (
    <Card>
      <h2 className="text-lg font-semibold">Key dates</h2>
      <ul className="mt-4 space-y-3">
        {calendar.data?.map((item) => (
          <li key={item.id} className="rounded-xl border border-emerald-100 p-3">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-slate-600">{new Date(item.starts_at).toLocaleString()} → {new Date(item.ends_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
