import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/Card';
import { createProject, listProjects } from '../../domains/projects/api';
import { projectSchema, type ProjectInput } from '../../lib/schemas';

export function ProjectsPage() {
  const queryClient = useQueryClient();
  const projects = useQuery({ queryKey: ['projects'], queryFn: listProjects });
  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  });

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
      related_links: [],
      action_items: []
    }
  });

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Card>
        <h2 className="text-lg font-semibold">Projects</h2>
        <ul className="mt-4 space-y-3">
          {projects.data?.map((project) => (
            <li key={project.id} className="rounded-xl border border-emerald-100 p-3">
              <p className="font-medium">{project.title}</p>
              <p className="text-sm text-slate-600">{project.type} · {project.status}</p>
              <p className="mt-1 text-sm">{project.summary}</p>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h3 className="font-semibold">Add project</h3>
        <form className="mt-3 space-y-3" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Project title" {...form.register('title')} />
          <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2" rows={3} placeholder="Short summary" {...form.register('summary')} />
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Lead name" {...form.register('lead_name')} />
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" type="date" {...form.register('start_date')} />
          <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2" rows={3} placeholder="Description" {...form.register('description')} />
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Target audience" {...form.register('target_audience')} />
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Key purpose" {...form.register('key_purpose')} />
          <button className="w-full rounded-lg bg-emerald-600 px-3 py-2 font-medium text-white">Save project</button>
        </form>
      </Card>
    </div>
  );
}
