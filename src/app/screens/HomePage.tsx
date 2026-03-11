import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/feedback/State';
import { queryKeys } from '../../lib/query/keys';
import { listActions } from '../../features/actions/api';
import { listCalendarItems } from '../../features/calendar/api';
import { listOutcomes } from '../../features/outcomes/api';
import { listProjects } from '../../features/projects/api';

export function HomePage() {
  const projects = useQuery({ queryKey: queryKeys.projects, queryFn: listProjects });
  const actions = useQuery({ queryKey: queryKeys.actions, queryFn: () => listActions() });
  const dates = useQuery({ queryKey: queryKeys.calendar, queryFn: () => listCalendarItems() });
  const outcomes = useQuery({ queryKey: queryKeys.outcomes, queryFn: () => listOutcomes() });

  const activeProjects = (projects.data ?? []).filter((p) => p.status === 'Active');
  const dueThisWeek = (actions.data ?? []).filter((a) => !!a.due_date).slice(0, 4);

  return (
    <div className="page-grid">
      <header className="page-header">
        <h2>Home</h2>
        <p>A simple overview of current projects, upcoming dates, and recent impact.</p>
      </header>

      <div className="quick-actions">
        <Link className="btn btn-primary" to="/projects">New Project</Link>
        <Link className="btn btn-secondary" to="/outcomes">Add Outcome</Link>
        <Link className="btn btn-secondary" to="/calendar">Add Date</Link>
        <Link className="btn btn-secondary" to="/resources">Add Resource</Link>
      </div>

      <section className="metrics-grid">
        <Card><p className="meta">Active Projects</p><h3>{activeProjects.length}</h3></Card>
        <Card><p className="meta">Actions Due This Week</p><h3>{dueThisWeek.length}</h3></Card>
        <Card><p className="meta">Upcoming Dates</p><h3>{dates.data?.length ?? 0}</h3></Card>
        <Card><p className="meta">Outcomes This Month</p><h3>{outcomes.data?.length ?? 0}</h3></Card>
      </section>

      <section className="two-col">
        <Card>
          <div className="section-head"><h3>Active Projects</h3><Link to="/projects">View all</Link></div>
          {activeProjects.length === 0 ? <EmptyState title="No active projects yet" message="Create your first project to start coordinating shared work." /> : (
            <ul className="stack-list">{activeProjects.slice(0, 6).map((project) => <li key={project.id}><strong>{project.title}</strong><p>{project.status} · {project.lead_name}</p></li>)}</ul>
          )}
        </Card>
        <Card>
          <div className="section-head"><h3>Upcoming Dates</h3><Link to="/calendar">View calendar</Link></div>
          <ul className="stack-list">{(dates.data ?? []).slice(0, 6).map((item) => <li key={item.id}><strong>{item.title}</strong><p>{new Date(item.starts_at).toLocaleString()}</p></li>)}</ul>
        </Card>
      </section>
    </div>
  );
}
