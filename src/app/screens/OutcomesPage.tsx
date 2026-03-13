import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { listOutcomes } from '../../features/outcomes/api';
import { queryKeys } from '../../lib/query/keys';

export function OutcomesPage() {
  const { data = [] } = useQuery({ queryKey: queryKeys.outcomes, queryFn: () => listOutcomes() });
  const reach = data.reduce((sum, item) => sum + (item.number_reached ?? 0), 0);

  return (
    <div className="page-grid">
      <header className="page-header"><h2>Outcomes</h2><p>Capture what happened, who was reached, and what changed.</p></header>
      <section className="metrics-grid"><Card><p className="meta">Outcomes This Month</p><h3>{data.length}</h3></Card><Card><p className="meta">Estimated Reach</p><h3>{reach}</h3></Card></section>
      <section className="stack-list">{data.map((item) => <Card key={item.id}><h3>{item.activity}</h3><p>{item.summary}</p><p className="meta">{item.date} · {item.outcome_type}</p>{item.quote_or_story ? <blockquote>“{item.quote_or_story}”</blockquote> : null}</Card>)}</section>
    </div>
  );
}
