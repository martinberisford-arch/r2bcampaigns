import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/feedback/State';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { createProject, listProjects } from '../../features/projects/api';
import { queryKeys } from '../../lib/query/keys';
import { splitCsv } from '../../lib/utils';
import { projectSchema, type ProjectInput } from '../../lib/validation/schemas';
import { PROJECT_STATUSES, PROJECT_TYPES } from '../../types/domain';

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: queryKeys.projects, queryFn: listProjects });

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      type: 'Service Delivery',
      status: 'Idea',
      summary: '',
      description: '',
      lead_name: '',
      start_date: '',
      end_date: null,
      target_audience: '',
      key_purpose: '',
      partners: [],
      funding_source: null,
      budget_note: null,
      tags: [],
      related_links: []
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      form.reset();
    }
  });

  const filtered = useMemo(
    () =>
      data.filter(
        (project) =>
          (!search || project.title.toLowerCase().includes(search.toLowerCase())) &&
          (!status || project.status === status) &&
          (!type || project.type === type)
      ),
    [data, search, status, type]
  );

  return (
    <div className="page-grid">
      <header className="page-header">
        <h2>Projects</h2>
        <p>Track service delivery, events, campaigns, and practical community activity in one place.</p>
      </header>

      <Card>
        <div className="filter-row">
          <input aria-label="Search projects" placeholder="Search by title" value={search} onChange={(event) => setSearch(event.target.value)} />
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            {PROJECT_STATUSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">All types</option>
            {PROJECT_TYPES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          title="No projects match your search"
          message="Try adjusting filters, or add a new project such as a coffee morning, school session, or volunteer drive."
        />
      ) : (
        <section className="project-grid">
          {filtered.map((project) => (
            <Link className="project-card" key={project.id} to={`/projects/${project.id}`}>
              <div className="section-head">
                <h3>{project.title}</h3>
                <Badge>{project.status}</Badge>
              </div>
              <p>{project.summary}</p>
              <p className="meta">{project.type} · Lead: {project.lead_name}</p>
              <p className="meta">Starts {project.start_date}{project.end_date ? ` · Ends ${project.end_date}` : ''}</p>
            </Link>
          ))}
        </section>
      )}

      <Card>
        <h3>New Project</h3>
        <form className="form-grid" onSubmit={form.handleSubmit((value) => createProjectMutation.mutate(value))}>
          <label>
            Title
            <input {...form.register('title')} />
          </label>
          <label>
            Type
            <select {...form.register('type')}>
              {PROJECT_TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select {...form.register('status')}>
              {PROJECT_STATUSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Lead name
            <input {...form.register('lead_name')} />
          </label>
          <label>
            Start date
            <input type="date" {...form.register('start_date')} />
          </label>
          <label className="span-2">
            Summary
            <textarea rows={3} {...form.register('summary')} />
          </label>
          <label className="span-2">
            Description
            <textarea rows={4} {...form.register('description')} />
          </label>
          <label>
            Target audience
            <input {...form.register('target_audience')} />
          </label>
          <label>
            Key purpose
            <input {...form.register('key_purpose')} />
          </label>
          <label>
            Partners (comma separated)
            <input onChange={(event) => form.setValue('partners', splitCsv(event.target.value))} />
          </label>
          <label>
            Tags (comma separated)
            <input onChange={(event) => form.setValue('tags', splitCsv(event.target.value))} />
          </label>
          <button className="btn btn-primary" disabled={createProjectMutation.isPending}>
            {createProjectMutation.isPending ? 'Saving...' : 'Save project'}
          </button>
        </form>
      </Card>
    </div>
  );
}
