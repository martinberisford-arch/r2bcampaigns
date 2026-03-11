import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/feedback/State';
import { createProject, listProjects } from '../../features/projects/api';
import { queryKeys } from '../../lib/query/keys';
import { projectSchema, type ProjectInput } from '../../lib/validation/schemas';
import { splitCsv } from '../../lib/utils';
import { PROJECT_STATUSES, PROJECT_TYPES } from '../../types/domain';

export function ProjectsPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: queryKeys.projects, queryFn: listProjects });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const form = useForm<ProjectInput>({ resolver: zodResolver(projectSchema), defaultValues: { title: '', type: 'Service Delivery', status: 'Idea', summary: '', description: '', lead_name: '', start_date: '', end_date: null, target_audience: '', key_purpose: '', partners: [], funding_source: null, budget_note: null, tags: [], related_links: [] } });

  const create = useMutation({ mutationFn: createProject, onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.projects }); form.reset(); } });

  const filtered = useMemo(() => data.filter((p) => (!search || p.title.toLowerCase().includes(search.toLowerCase())) && (!status || p.status === status) && (!type || p.type === type)), [data, search, status, type]);

  return (
    <div className="page-grid">
      <header className="page-header"><h2>Projects</h2><p>Plan and track services, events, campaigns, and community activity.</p></header>
      <Card>
        <div className="filter-row">
          <input aria-label="Search projects" placeholder="Search projects" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{PROJECT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
          <select value={type} onChange={(e) => setType(e.target.value)}><option value="">All types</option>{PROJECT_TYPES.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
      </Card>
      {filtered.length === 0 ? <EmptyState title="No projects match yet" message="Try a different filter, or create a new project to get started." /> : (
        <section className="project-grid">{filtered.map((project) => (
          <Link className="project-card" key={project.id} to={`/projects/${project.id}`}>
            <div className="section-head"><h3>{project.title}</h3><Badge>{project.status}</Badge></div>
            <p>{project.summary}</p>
            <p className="meta">{project.type} · Lead: {project.lead_name}</p>
          </Link>
        ))}</section>
      )}
      <Card>
        <h3>New Project</h3>
        <form className="form-grid" onSubmit={form.handleSubmit((value) => create.mutate(value))}>
          <label>Title<input {...form.register('title')} /></label>
          <label>Type<select {...form.register('type')}>{PROJECT_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Status<select {...form.register('status')}>{PROJECT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Lead name<input {...form.register('lead_name')} /></label>
          <label>Start date<input type="date" {...form.register('start_date')} /></label>
          <label className="span-2">Summary<textarea rows={3} {...form.register('summary')} /></label>
          <label className="span-2">Description<textarea rows={4} {...form.register('description')} /></label>
          <label>Target audience<input {...form.register('target_audience')} /></label>
          <label>Key purpose<input {...form.register('key_purpose')} /></label>
          <label>Partners (comma separated)<input onChange={(e) => form.setValue('partners', splitCsv(e.target.value))} /></label>
          <label>Tags (comma separated)<input onChange={(e) => form.setValue('tags', splitCsv(e.target.value))} /></label>
          <button className="btn btn-primary" disabled={create.isPending}>{create.isPending ? 'Saving...' : 'Save project'}</button>
        </form>
      </Card>
    </div>
  );
}
