import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { createAction, listActions } from '../../features/actions/api';
import { listCalendarItems } from '../../features/calendar/api';
import { listOutcomes } from '../../features/outcomes/api';
import { getProject } from '../../features/projects/api';
import { listResources } from '../../features/resources/api';
import { queryKeys } from '../../lib/query/keys';
import { actionSchema, type ActionInput } from '../../lib/validation/schemas';
import { ACTION_STATUSES, PRIORITIES } from '../../types/domain';

export function ProjectDetailPage() {
  const { projectId = '' } = useParams();
  const qc = useQueryClient();
  const project = useQuery({ queryKey: queryKeys.project(projectId), queryFn: () => getProject(projectId), enabled: Boolean(projectId) });
  const actions = useQuery({ queryKey: [...queryKeys.actions, projectId], queryFn: () => listActions(projectId), enabled: Boolean(projectId) });
  const timeline = useQuery({ queryKey: [...queryKeys.calendar, projectId], queryFn: () => listCalendarItems(projectId), enabled: Boolean(projectId) });
  const outcomes = useQuery({ queryKey: [...queryKeys.outcomes, projectId], queryFn: () => listOutcomes(projectId), enabled: Boolean(projectId) });
  const resources = useQuery({ queryKey: [...queryKeys.resources, projectId], queryFn: () => listResources(projectId), enabled: Boolean(projectId) });

  const form = useForm<ActionInput>({ resolver: zodResolver(actionSchema), defaultValues: { project_id: projectId, title: '', notes: '', owner_name: '', status: 'To Do', due_date: null, priority: 'Medium' } });
  const create = useMutation({ mutationFn: createAction, onSuccess: () => qc.invalidateQueries({ queryKey: [...queryKeys.actions, projectId] }) });

  if (!project.data) return <p>Project not found.</p>;

  return (
    <div className="page-grid">
      <header className="page-header"><h2>{project.data.title}</h2><p>{project.data.type} · Lead: {project.data.lead_name}</p></header>
      <Card><h3>Overview</h3><p>{project.data.summary}</p><p>{project.data.description}</p></Card>
      <section className="two-col">
        <Card>
          <h3>Actions</h3>
          <ul className="stack-list">{(actions.data ?? []).map((item) => <li key={item.id}><strong>{item.title}</strong><p>{item.status} · {item.owner_name} · {item.due_date ?? 'No due date'}</p></li>)}</ul>
          <form className="form-grid" onSubmit={form.handleSubmit((v) => create.mutate(v))}>
            <label>Action title<input {...form.register('title')} /></label>
            <label>Owner<input {...form.register('owner_name')} /></label>
            <label>Status<select {...form.register('status')}>{ACTION_STATUSES.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label>Priority<select {...form.register('priority')}>{PRIORITIES.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label>Due date<input type="date" {...form.register('due_date')} /></label>
            <button className="btn btn-primary">Add Action</button>
          </form>
        </Card>
        <Card><h3>Timeline</h3><ul className="stack-list">{(timeline.data ?? []).map((item) => <li key={item.id}><strong>{item.title}</strong><p>{new Date(item.starts_at).toLocaleString()}</p></li>)}</ul></Card>
      </section>
      <section className="two-col">
        <Card><h3>Outcomes</h3><ul className="stack-list">{(outcomes.data ?? []).map((item) => <li key={item.id}><strong>{item.activity}</strong><p>{item.summary}</p></li>)}</ul></Card>
        <Card><h3>Resources</h3><ul className="stack-list">{(resources.data ?? []).map((item) => <li key={item.id}><strong>{item.title}</strong><p>{item.type}</p></li>)}</ul></Card>
      </section>
    </div>
  );
}
