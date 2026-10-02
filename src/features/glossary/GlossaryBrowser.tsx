import { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { DIFFICULTIES, USAGE_FREQUENCIES } from '../../content/schema/values';
import {
  filterAndSort,
  filtersFromQuery,
  filtersToQuery,
  LETTERS,
  letterOf,
  paginate,
  type GlossaryFilters,
  type GlossaryItem,
} from './filter';

interface Props {
  /** Insurance lines for the type filter: [line ID, label]. */
  lines: [string, string][];
}

/**
 * Terms A–Z: letter bar, filters, sort and pages, all kept in the URL.
 * Reads the URL and loads /terms/index.json, so render it with client:only="react".
 */
export function GlossaryBrowser({ lines }: Props) {
  const [items, setItems] = useState<GlossaryItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [filters, setFilters] = useState<GlossaryFilters>(() =>
    filtersFromQuery(window.location.search),
  );

  useEffect(() => {
    fetch('/terms/index.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: GlossaryItem[]) => setItems(data))
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    const onPop = () => setFilters(filtersFromQuery(window.location.search));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  function update(change: Partial<GlossaryFilters>) {
    // Any filter change goes back to page 1, unless the page itself is changing.
    const next = { ...filters, page: 1, ...change };
    setFilters(next);
    window.history.pushState(null, '', `${window.location.pathname}${filtersToQuery(next)}`);
  }

  const matched = useMemo(() => (items ? filterAndSort(items, filters) : []), [items, filters]);
  const lettersWithTerms = useMemo(
    () => new Set((items ?? []).map((i) => letterOf(i.title))),
    [items],
  );
  const { items: pageItems, page, pages } = paginate(matched, filters.page);

  if (failed) return <p role="alert">Couldn’t load the term list. Please reload the page.</p>;

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Letters">
        <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
          <li>
            <button
              type="button"
              className={`pd-btn pd-btn-sm ${filters.letter ? 'pd-btn-ghost' : 'pd-btn-primary'}`}
              aria-pressed={!filters.letter}
              onClick={() => update({ letter: undefined })}
            >
              All
            </button>
          </li>
          {LETTERS.map((l) => (
            <li key={l}>
              <button
                type="button"
                className={`pd-btn pd-btn-sm pd-btn-icon ${filters.letter === l ? 'pd-btn-primary' : 'pd-btn-ghost'}`}
                aria-pressed={filters.letter === l}
                aria-label={l === '#' ? 'Numbers' : l}
                disabled={items !== null && !lettersWithTerms.has(l)}
                onClick={() => update({ letter: l })}
              >
                {l}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <fieldset className="m-0 flex flex-wrap items-end gap-4 border-0 p-0">
        <legend className="sr-only">Filter terms</legend>
        <Select
          label="Usage"
          value={filters.usage ?? ''}
          options={USAGE_FREQUENCIES.map((u) => [u, u])}
          onChange={(v) => update({ usage: (v || undefined) as GlossaryFilters['usage'] })}
        />
        <Select
          label="Difficulty"
          value={filters.difficulty ?? ''}
          options={DIFFICULTIES.map((d) => [d, d])}
          onChange={(v) =>
            update({ difficulty: (v || undefined) as GlossaryFilters['difficulty'] })
          }
        />
        <Select
          label="Insurance type"
          value={filters.type ?? ''}
          options={lines}
          onChange={(v) => update({ type: (v || undefined) as GlossaryFilters['type'] })}
        />
        <Select
          label="Sort"
          value={filters.sort}
          options={[
            ['az', 'A–Z'],
            ['most-used', 'Most used'],
          ]}
          allLabel={null}
          onChange={(v) => update({ sort: v === 'most-used' ? 'most-used' : 'az' })}
        />
        <div className="pb-2">
          <Checkbox
            label="Abbreviations only"
            checked={Boolean(filters.abbreviations)}
            onChange={(e) => update({ abbreviations: e.target.checked || undefined })}
          />
        </div>
      </fieldset>

      <p className="text-body-sm text-ink-muted m-0" role="status">
        {items === null ? 'Loading terms…' : `${matched.length} terms`}
      </p>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {pageItems.map((t) => (
          <li key={t.id} className="border-ink rounded-md border-2 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <a href={`/terms/${t.id}`} className="text-title-sm">
                {t.title}
              </a>
              <span className="flex gap-2">
                <Badge tone="muted">{t.usage} usage</Badge>
                <Badge tone="muted">{t.difficulty}</Badge>
              </span>
            </div>
            <p className="text-body-sm mt-1 mb-0">{t.summary}</p>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <nav aria-label="Pages" className="flex items-center gap-3">
          <Button
            size="sm"
            icon="arrow-left"
            disabled={page <= 1}
            onClick={() => update({ page: page - 1 })}
          >
            Previous
          </Button>
          <span className="text-body-sm">
            Page {page} of {pages}
          </span>
          <Button
            size="sm"
            iconRight="arrow-right"
            disabled={page >= pages}
            onClick={() => update({ page: page + 1 })}
          >
            Next
          </Button>
        </nav>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  allLabel = 'All',
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
  allLabel?: string | null;
}) {
  const id = `filter-${label.toLowerCase().replace(/\W+/g, '-')}`;
  return (
    <div className="pd-field">
      <label className="pd-label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="pd-input pd-input-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {allLabel !== null && <option value="">{allLabel}</option>}
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );
}
