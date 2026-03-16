import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/feedback/State';
import { listOutcomes } from '../../features/outcomes/api';
import { queryKeys } from '../../lib/query/keys';

export function OutcomesPage() {
  const { data = [] } = useQuery({ queryKey: queryKeys.outcomes, queryFn: () => listOutcomes() });

  const reach = data.reduce((sum, item) => sum + (item.number_reached ?? 0), 0);
  const followUpCount = data.filter((item) => item.follow_up_needed).length;
  const featuredQuote = data.find((item) => item.quote_or_story);

  return (
    <div className="page-grid">
      <header className="page-header">
        <h2>Outcomes</h2>
        <p>Capture what happened, who was reached, and what changed. These notes power your impact reports and trustee updates.</p>
      </header>

      <section className="metrics-grid">
        <Card>
          <p className="meta">Outcomes Logged</p>
          <h3>{data.length}</h3>
        </Card>
        <Card>
          <p className="meta">Estimated Reach</p>
          <h3>{reach.toLocaleString()}</h3>
        </Card>
        <Card>
          <p className="meta">Quotes &amp; Stories</p>
          <h3>{data.filter((item) => item.quote_or_story).length}</h3>
        </Card>
        <Card>
          <p className="meta">Follow-ups Needed</p>
          <h3 className={followUpCount > 0 ? 'urgency-number' : ''}>{followUpCount}</h3>
        </Card>
      </section>

      {featuredQuote && (
        <Card className="featured-impact-card">
          <p className="eyebrow">Featured Story</p>
          <blockquote className="featured-quote">"{featuredQuote.quote_or_story}"</blockquote>
          <p className="meta featured-quote-source">
            {featuredQuote.activity} · {featuredQuote.date} · {featuredQuote.audience}
          </p>
        </Card>
      )}

      {data.length === 0 ? (
        <EmptyState
          title="No outcomes logged yet"
          message="After each activity, add a brief outcome note. Even a sentence or two helps build your impact story for funders and trustees."
        />
      ) : (
        <section className="stack-list">
          {data.map((item) => (
            <Card key={item.id}>
              <div className="section-head">
                <h3>{item.activity}</h3>
                <span className="badge">{item.outcome_type}</span>
              </div>
              <p className="meta">{item.date}{item.audience ? ` · ${item.audience}` : ''}</p>
              {item.number_reached != null && item.number_reached > 0 && (
                <p className="outcome-reach">{item.number_reached} people reached</p>
              )}
              <p style={{ marginTop: '8px' }}>{item.summary}</p>
              {item.impact_note && (
                <p className="meta" style={{ marginTop: '6px' }}>{item.impact_note}</p>
              )}
              {item.quote_or_story && (
                <blockquote className="outcome-quote">"{item.quote_or_story}"</blockquote>
              )}
              {item.follow_up_needed && (
                <p className="follow-up-flag">
                  Follow-up needed{item.follow_up_note ? `: ${item.follow_up_note}` : ''}
                </p>
              )}
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
