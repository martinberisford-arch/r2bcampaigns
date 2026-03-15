import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/feedback/State';
import { createAction, listActions } from '../../features/actions/api';
import { listCalendarItems } from '../../features/calendar/api';
import { listOutcomes } from '../../features/outcomes/api';
import { getProject } from '../../features/projects/api';
import { listResources } from '../../features/resources/api';
import { queryKeys } from '../../lib/query/keys';
import { actionSchema, type ActionInput } from '../../lib/validation/schemas';
import { ACTION_STATUSES, PRIORITIES } from '../../types/domain';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function ProjectDetailPage() {
  const { projectId = '' } = useParams();
  const qc = useQueryClient();

  const project = useQuery({
    queryKey: queryKeys.project(projectId),
    queryFn: () => getProject(projectId),
    enabled: Boolean(projectId)
  });
  const actions = useQuery({
    queryKey: [...queryKeys.actions, projectId],
    queryFn: () => listActions(projectId),
    enabled: Boolean(projectId)
  });
  const timeline = useQuery({
    queryKey: [...queryKeys.calendar, projectId],
    queryFn: () => listCalendarItems(projectId),
    enabled: Boolean(projectId)
  });
  const outcomes = useQuery({
    queryKey: [...queryKeys.outcomes, projectId],
    queryFn: () => listOutcomes(projectId),
    enabled: Boolean(projectId)
  });
  const resources = useQuery({
    queryKey: [...queryKeys.resources, projectId],
    queryFn: () => listResources(projectId),
    enabled: Boolean(projectId)
  });

  const form = useForm<ActionInput>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      project_id: projectId,
      title: '',
      notes: '',
      owner_name: '',
      status: 'To Do',
      due_date: null,
      priority: 'Medium'
    }
  });

  const create = useMutation({
    mutationFn: createAction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [...queryKeys.actions, projectId] });
      form.reset({ project_id: projectId, title: '', notes: '', owner_name: '', status: 'To Do', due_date: null, priority: 'Medium' });
    }
  });

  if (!project.data) return <p>Project not found.</p>;

  const today = new Date();
  const overdueActions = (actions.data ?? []).filter(
    (a) => a.due_date && new Date(a.due_date) < today && a.status !== 'Done'
  );
  const totalReach = (outcomes.data ?? []).reduce((sum, o) => sum + (o.number_reached ?? 0), 0);

  return (
    <div className="page-grid">
      <header className="page-header">
        <h2>{project.data.title}</h2>
        <p>
          {project.data.type} · Lead: {project.data.lead_name}
          {project.data.target_audience ? ` · Audience: ${project.data.target_audience}` : ''}
        </p>
      </header>

      <section className="metrics-grid">
        <Card>
          <p className="meta">Status</p>
          <div style={{ marginTop: '8px' }}>
            <Badge>{project.data.status}</Badge>
          </div>
        </Card>
        <Card>
          <p className="meta">Actions</p>
          <h3 className={overdueActions.length > 0 ? 'urgency-number' : ''}>
            {(actions.data ?? []).filter((a) => a.status !== 'Done').length}
            {overdueActions.length > 0 && (
              <span className="overdue-badge">+{overdueActions.length} overdue</span>
            )}
          </h3>
        </Card>
        <Card>
          <p className="meta">Outcomes</p>
          <h3>{outcomes.data?.length ?? 0}</h3>
        </Card>
        <Card>
          <p className="meta">Total Reach</p>
          <h3>{totalReach > 0 ? totalReach.toLocaleString() : '—'}</h3>
        </Card>
      </section>

      <Card>
        <h3>Overview</h3>
        <p style={{ marginTop: '8px' }}>{project.data.summary}</p>
        {project.data.description && (
          <p className="meta" style={{ marginTop: '8px' }}>{project.data.description}</p>
        )}
        {project.data.key_purpose && (
          <p style={{ marginTop: '8px' }}>
            <strong>Purpose:</strong> {project.data.key_purpose}
          </p>
        )}
        {project.data.partners.length > 0 && (
          <p className="meta" style={{ marginTop: '6px' }}>
            Partners: {project.data.partners.join(', ')}
          </p>
        )}
      </Card>

      <section className="two-col">
        <Card>
          <h3 style={{ marginBottom: '12px' }}>Actions</h3>
          {(actions.data ?? []).length === 0 ? (
            <EmptyState title="No actions yet" message="Add tasks to keep next steps visible for everyone." />
          ) : (
            <ul className="stack-list" style={{ marginBottom: '16px' }}>
              {(actions.data ?? []).map((item) => {
                const isOverdue = item.due_date && new Date(item.due_date) < today && item.status !== 'Done';
                return (
                  <li key={item.id} className={isOverdue ? 'action-overdue' : ''}>
                    <div className="section-head" style={{ marginBottom: 0 }}>
                      <strong>{item.title}</strong>
                      <Badge>{item.status}</Badge>
                    </div>
                    <p className="meta">
                      {item.owner_name} · {item.priority} priority
                      {item.due_date ? ` · ${formatDate(item.due_date)}` : ''}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
          <form className="form-grid" onSubmit={form.handleSubmit((v) => create.mutate(v))}>
            <label>
              Action title
              <input {...form.register('title')} />
            </label>
            <label>
              Owner
              <input {...form.register('owner_name')} />
            </label>
            <label>
              Status
              <select {...form.register('status')}>
                {ACTION_STATUSES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label>
              Priority
              <select {...form.register('priority')}>
                {PRIORITIES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </label>
            <label>
              Due date
              <input type="date" {...form.register('due_date')} />
            </label>
            <button className="btn btn-primary" disabled={create.isPending}>
              {create.isPending ? 'Adding...' : 'Add Action'}
            </button>
          </form>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '12px' }}>Timeline</h3>
          {(timeline.data ?? []).length === 0 ? (
            <EmptyState title="No dates yet" message="Add key events and deadlines to this project." />
          ) : (
            <ul className="stack-list">
              {(timeline.data ?? []).map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <p className="meta">
                    {item.type} · {new Date(item.starts_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                  {item.location && <p className="meta">{item.location}</p>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="two-col">
        <Card>
          <h3 style={{ marginBottom: '12px' }}>Outcomes</h3>
          {(outcomes.data ?? []).length === 0 ? (
            <EmptyState title="No outcomes yet" message="Log what happened and who was reached." />
          ) : (
            <ul className="stack-list">
              {(outcomes.data ?? []).map((item) => (
                <li key={item.id}>
                  <strong>{item.activity}</strong>
                  <p>{item.summary}</p>
                  <p className="meta">{item.date} · {item.outcome_type}</p>
                  {item.number_reached != null && item.number_reached > 0 && (
                    <p className="meta">{item.number_reached} reached</p>
                  )}
                  {item.quote_or_story && (
                    <blockquote className="outcome-quote">"{item.quote_or_story}"</blockquote>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 style={{ marginBottom: '12px' }}>Resources</h3>
          {(resources.data ?? []).length === 0 ? (
            <EmptyState title="No resources yet" message="Link documents, templates, and materials here." />
          ) : (
            <ul className="stack-list">
              {(resources.data ?? []).map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <p className="meta">{item.type}</p>
                  {item.description && <p>{item.description}</p>}
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="meta">
                      Open resource →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
