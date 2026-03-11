import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/Card';
import { listResources } from '../../domains/resources/api';

export function ResourcesPage() {
  const resources = useQuery({ queryKey: ['resources'], queryFn: listResources });

  return (
    <Card>
      <h2 className="text-lg font-semibold">Useful resources</h2>
      <ul className="mt-4 space-y-3">
        {resources.data?.map((resource) => (
          <li key={resource.id} className="rounded-xl border border-emerald-100 p-3">
            <a href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a>
            <p className="text-sm text-slate-600">{resource.notes}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
