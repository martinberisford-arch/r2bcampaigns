import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { listResources } from '../../features/resources/api';
import { queryKeys } from '../../lib/query/keys';

export function ResourcesPage() {
  const [grid, setGrid] = useState(true);
  const { data = [] } = useQuery({ queryKey: queryKeys.resources, queryFn: () => listResources() });

  return (
    <div className="page-grid">
      <header className="page-header"><h2>Resources</h2><p>Shared links, templates, and supporting materials.</p></header>
      <div className="quick-actions"><button className={`btn ${grid ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setGrid(true)}>Grid</button><button className={`btn ${!grid ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setGrid(false)}>List</button></div>
      <section className={grid ? 'project-grid' : 'stack-list'}>
        {data.map((item) => <Card key={item.id}><h3>{item.title}</h3><p>{item.description}</p><p className="meta">{item.type}</p><a href={item.link} target="_blank" rel="noreferrer">Open link</a></Card>)}
      </section>
    </div>
  );
}
