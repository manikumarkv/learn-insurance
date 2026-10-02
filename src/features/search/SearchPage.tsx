import { useEffect, useId, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import type { GlossaryItem } from '../glossary/filter';
import { isExactMatch, loadPagefind, rankHits, toHit, type SearchHit } from './pagefind';
import { suggest, type Suggestable } from './suggest';

const MAX_RESULTS = 30;

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; query: string; terms: SearchHit[]; types: SearchHit[] }
  | { status: 'unavailable' };

/**
 * Search results for terms and insurance types. Keeps the query in the URL (?q=).
 * Reads the URL, so render it with client:only="react".
 */
export function SearchPage() {
  const inputId = useId();
  const [query, setQuery] = useState(
    () => new URLSearchParams(window.location.search).get('q') ?? '',
  );
  const [state, setState] = useState<State>({ status: 'idle' });

  useEffect(() => {
    const q = query.trim();
    const url = q ? `?q=${encodeURIComponent(q)}` : window.location.pathname;
    window.history.replaceState(null, '', url);
    if (!q) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setState({ status: 'loading' });
      try {
        const pagefind = await loadPagefind();
        const search = await pagefind.search(q);
        const data = await Promise.all(search.results.slice(0, MAX_RESULTS).map((r) => r.data()));
        const hits = rankHits(data.map(toHit), q);
        if (cancelled) return;
        setState({
          status: 'done',
          query: q,
          terms: hits.filter((h) => h.kind === 'Term'),
          types: hits.filter((h) => h.kind === 'Insurance type'),
        });
        // TODO(story 6.6): send a search event to analytics after cookie consent.
      } catch {
        if (!cancelled) setState({ status: 'unavailable' });
      }
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  const total = state.status === 'done' ? state.terms.length + state.types.length : 0;

  return (
    <div className="flex flex-col gap-6">
      <form
        role="search"
        aria-label="Search terms and insurance types"
        className="flex items-end gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="ui-field min-w-0 flex-1">
          <label className="ui-label" htmlFor={inputId}>
            Search terms and insurance types
          </label>
          <input
            id={inputId}
            className="ui-input w-full"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. deductible, HMO, cyber"
            autoComplete="off"
            autoFocus
          />
        </div>
      </form>

      <p className="text-body-sm text-ink-muted m-0" role="status" aria-live="polite">
        {state.status === 'loading' && 'Searching…'}
        {state.status === 'done' && `${total} results for “${state.query}”`}
        {state.status === 'unavailable' &&
          'Search isn’t available here. It works on the built site (pnpm build && pnpm preview).'}
      </p>

      {state.status === 'done' && (
        <div className="flex flex-col gap-8">
          {![...state.terms, ...state.types].some((h) => isExactMatch(h, state.query)) && (
            <DidYouMean query={state.query} />
          )}
          {state.terms.length > 0 && <Results title="Terms" hits={state.terms} />}
          {state.types.length > 0 && <Results title="Insurance types" hits={state.types} />}
          {total === 0 && <NoResults query={state.query} />}
        </div>
      )}
    </div>
  );
}

function Results({ title, hits }: { title: string; hits: SearchHit[] }) {
  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <h2 className="text-title-md m-0">{title}</h2>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {hits.map((h) => (
          <li key={h.url} className="ui-card">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <a href={h.url} className="text-title-sm">
                {h.title}
              </a>
              <span className="flex gap-2">
                {h.usage && <Badge tone="muted">{h.usage} usage</Badge>}
                {h.kind === 'Insurance type' && (
                  <Badge tone="muted" icon="file">
                    Insurance type
                  </Badge>
                )}
              </span>
            </div>
            {/* Pagefind's excerpt is HTML-escaped text with <mark> around the matched words. */}
            <p className="text-body-sm mt-1 mb-0" dangerouslySetInnerHTML={{ __html: h.excerpt }} />
          </li>
        ))}
      </ul>
    </section>
  );
}

let glossary: Promise<Suggestable[]> | undefined;

/** Term names for "Did you mean", loaded only when a search finds nothing. */
function loadGlossary(): Promise<Suggestable[]> {
  glossary ??= fetch('/terms/index.json')
    .then((r) => (r.ok ? (r.json() as Promise<GlossaryItem[]>) : []))
    .catch(() => []);
  return glossary;
}

/** "Did you mean…" when nothing matches the query exactly. Shows nothing when there's no close term. */
function DidYouMean({ query }: { query: string }) {
  const [suggestions, setSuggestions] = useState<Suggestable[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadGlossary().then((items) => {
      if (!cancelled) setSuggestions(suggest(query, items));
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (suggestions.length === 0) return null;
  return (
    <p className="text-body-lg m-0">
      Did you mean{' '}
      {suggestions.map((s, i) => (
        <span key={s.id}>
          {i > 0 && (i === suggestions.length - 1 ? ' or ' : ', ')}
          <a href={`/terms/${s.id}`} className="font-bold">
            {s.title}
          </a>
        </span>
      ))}
      ?
    </p>
  );
}

function NoResults({ query }: { query: string }) {
  // TODO(story 6.6): record the missed search for analytics after cookie consent.
  return (
    <div className="ui-card flex flex-col gap-4">
      <h2 className="text-title-md m-0">No terms match “{query}”</h2>
      <p className="text-body m-0">
        If it’s an insurance word we haven’t explained yet, ask for it and we’ll add it.
      </p>
      {/* TODO(story 8.1): /request creates the term request; until then it shows the request page. */}
      <a
        href={`/request?term=${encodeURIComponent(query)}`}
        className="ui-btn ui-btn-primary self-start"
      >
        Request this term
      </a>
    </div>
  );
}
