import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/Card';
import { listStories } from '../../domains/stories/api';

export function StoriesPage() {
  const stories = useQuery({ queryKey: ['stories'], queryFn: listStories });

  return (
    <Card>
      <h2 className="text-lg font-semibold">Impact stories</h2>
      <ul className="mt-4 space-y-3">
        {stories.data?.map((story) => (
          <li key={story.id} className="rounded-xl border border-emerald-100 p-3">
            <p className="font-medium">{story.title}</p>
            <p className="text-sm">{story.what_happened}</p>
            <p className="mt-1 text-sm text-slate-600">Why it matters: {story.why_it_matters}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
