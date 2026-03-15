import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/feedback/State';
import { Card } from '../../components/ui/Card';
import { listActions } from '../../features/actions/api';
import { listCalendarItems } from '../../features/calendar/api';
import { listOutcomes } from '../../features/outcomes/api';
import { listProjects } from '../../features/projects/api';
import { queryKeys } from '../../lib/query/keys';

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 6) return `In ${diffDays} days`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function HomePage() {
  const projects = useQuery({ queryKey: queryKeys.projects, queryFn: listProjects });
  const actions = useQuery({ queryKey: queryKeys.actions, queryFn: () => listActions() });
  const dates = useQuery({ queryKey: queryKeys.calendar, queryFn: () => listCalendarItems() });
  const outcomes = useQuery({ queryKey: queryKeys.outcomes, queryFn: () => listOutcomes() });

  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  const activeProjects = (projects.data ?? []).filter((p) => p.status === 'Active');
  const stalledProjects = (projects.data ?? []).filter((p) => p.status === 'On Hold');

  const overdueActions = (actions.data ?? []).filter(
    (a) => a.due_date && new Date(a.due_date) < today && a.status !== 'Done'
  );
  const actionsThisWeek = (actions.data ?? []).filter(
    (a) =>
      a.due_date &&
      new Date(a.due_date) >= today &&
      new Date(a.due_date) <= endOfWeek &&
      a.status !== 'Done'
  );

  const pendingFollowUps = (outcomes.data ?? []).filter((o) => o.follow_up_needed);
  const featuredQuote = (outcomes.data ?? []).find((o) => o.quote_or_story);

  const upcomingDates = (dates.data ?? [])
    .filter((d) => new Date(d.starts_at) >= today)
    .slice(0, 6);

  const recentOutcomes = (outcomes.data ?? []).slice(0, 4);

  const hasAttentionItems =
    overdueActions.length > 0 || pendingFollowUps.length > 0 || stalledProjects.length > 0;

  const heroMessage =
    overdueActions.length > 0
      ? `${overdueActions.length} action${overdueActions.length > 1 ? 's' : ''} overdue — tackle these first to keep momentum.`
      : actionsThisWeek.length > 0
        ? `${actionsThisWeek.length} action${actionsThisWeek.length > 1 ? 's' : ''} due this week. Stay ahead of the work.`
        : 'Everything looks on track. Keep logging outcomes to tell the full story.';

  return (
    <div className="page-grid">
      <header className="page-header">
        <h2>Home</h2>
        <p>A simple overview of current projects, upcoming dates, and recent impact.</p>
      </header>

      <section className="hero-bento">
        <Card>
          <p className="eyebrow">Today's focus</p>
          <h3 className="hero-title">{heroMessage}</h3>
          <p className="meta">Use quick actions to log outcomes and keep next steps visible for everyone.</p>
          <div className="quick-actions">
            <Link className="btn btn-primary" to="/projects">New Project</Link>
            <Link className="btn btn-secondary" to="/outcomes">Add Outcome</Link>
            <Link className="btn btn-secondary" to="/calendar">Add Date</Link>
            <Link className="btn btn-secondary" to="/resources">Add Resource</Link>
          </div>
        </Card>

        <Card>
          <p className="meta">Active Projects</p>
          <h3>{activeProjects.length}</h3>
          <p className="meta">Services, events, and support sessions currently underway.</p>
        </Card>

        <Card>
          <p className="meta">Actions Due This Week</p>
          <h3 className={overdueActions.length > 0 ? 'urgency-number' : ''}>
            {actionsThisWeek.length}
            {overdueActions.length > 0 && (
              <span className="overdue-badge">+{overdueActions.length} overdue</span>
            )}
          </h3>
          <p className="meta">Review and prioritise to keep things moving.</p>
        </Card>

        <Card>
          <p className="meta">Outcomes This Month</p>
          <h3>{outcomes.data?.length ?? 0}</h3>
          <p className="meta">Story-first progress notes to support trustee and funder updates.</p>
        </Card>
      </section>

      {hasAttentionItems && (
        <Card className="attention-card">
          <p className="attention-heading">Needs Attention</p>
          <ul className="attention-list">
            {overdueActions.map((action) => (
              <li key={action.id} className="attention-item attention-overdue">
                <span className="attention-dot" />
                <span>
                  <strong>{action.title}</strong>
                  {action.due_date && (
                    <span className="attention-meta"> · {formatRelativeDate(action.due_date)}</span>
                  )}
                  {action.owner_name && (
                    <span className="attention-meta"> · {action.owner_name}</span>
                  )}
                </span>
              </li>
            ))}
            {pendingFollowUps.map((outcome) => (
              <li key={outcome.id} className="attention-item attention-followup">
                <span className="attention-dot" />
                <span>
                  <strong>Follow-up needed:</strong> {outcome.activity}
                  {outcome.follow_up_note && (
                    <span className="attention-meta"> · {outcome.follow_up_note}</span>
                  )}
                </span>
              </li>
            ))}
            {stalledProjects.map((project) => (
              <li key={project.id} className="attention-item attention-stalled">
                <span className="attention-dot" />
                <span>
                  <strong>{project.title}</strong>
                  <span className="attention-meta"> · On Hold — review when ready</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <section className="two-col">
        <Card>
          <div className="section-head">
            <h3>Active Projects</h3>
            <Link to="/projects">View all</Link>
          </div>
          {activeProjects.length === 0 ? (
            <EmptyState
              title="No active projects yet"
              message="Create your first project to start coordinating shared work."
            />
          ) : (
            <ul className="stack-list">
              {activeProjects.slice(0, 6).map((project) => (
                <li key={project.id}>
                  <Link to={`/projects/${project.id}`} className="stack-item-link">
                    <strong>{project.title}</strong>
                    <p className="meta">{project.type} · Lead: {project.lead_name}</p>
                    {project.end_date && (
                      <p className="meta">Ends {formatRelativeDate(project.end_date)}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="section-head">
            <h3>Upcoming Dates</h3>
            <Link to="/calendar">View calendar</Link>
          </div>
          {upcomingDates.length === 0 ? (
            <EmptyState
              title="No upcoming dates"
              message="Add key events and deadlines to keep the whole team informed."
            />
          ) : (
            <ul className="stack-list">
              {upcomingDates.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <p className="meta">{item.type} · {formatRelativeDate(item.starts_at)}</p>
                  {item.location && <p className="meta">{item.location}</p>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {featuredQuote && (
        <Card className="featured-impact-card">
          <p className="eyebrow">Impact Story</p>
          <blockquote className="featured-quote">"{featuredQuote.quote_or_story}"</blockquote>
          <p className="meta featured-quote-source">
            {featuredQuote.activity} · {featuredQuote.date}
          </p>
        </Card>
      )}

      <Card>
        <div className="section-head">
          <h3>Recent Outcomes</h3>
          <Link to="/outcomes">Open outcomes</Link>
        </div>
        {recentOutcomes.length === 0 ? (
          <EmptyState
            title="No outcomes logged yet"
            message="Record what happened after each activity — even a brief note helps with reporting."
          />
        ) : (
          <ul className="stack-list">
            {recentOutcomes.map((outcome) => (
              <li key={outcome.id}>
                <strong>{outcome.activity}</strong>
                <p>{outcome.summary}</p>
                <p className="meta">{outcome.date} · {outcome.outcome_type}</p>
                {outcome.number_reached != null && outcome.number_reached > 0 && (
                  <p className="meta">{outcome.number_reached} people reached</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
