import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/Card';
import { listProjects } from '../../domains/projects/api';
import { listCalendarItems } from '../../domains/calendar/api';
import { listStories } from '../../domains/stories/api';

export function OverviewPage() {
  const projects = useQuery({ queryKey: ['projects'], queryFn: listProjects });
  const calendar = useQuery({ queryKey: ['calendar'], queryFn: listCalendarItems });
  const stories = useQuery({ queryKey: ['stories'], queryFn: listStories });

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-lg font-semibold">Welcome</h2>
        <p className="mt-2 text-sm text-slate-700">A calm, low-admin workspace for planning activity and showing impact.</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-600">Open projects</p>
          <p className="text-3xl font-semibold">{projects.data?.length ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-600">Upcoming dates</p>
          <p className="text-3xl font-semibold">{calendar.data?.length ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-600">Impact stories</p>
          <p className="text-3xl font-semibold">{stories.data?.length ?? 0}</p>
        </Card>
      </div>
    </div>
  );
}
