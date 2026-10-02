/**
 * Wiki-style term links (docs/content/term-schema.md › Term links).
 *
 * - Mentions of another term's name, abbreviation or "also known as" link to it.
 * - Whole words; names are case-insensitive, abbreviations case-sensitive
 *   (so the word "art" doesn't link to ART, Alternative Risk Transfer).
 * - Longest match wins; first mention per section only; never the page itself; at most 5 per section.
 * - Overrides: [[id]] and [[id|text]] force a link, [[!word]] stops one.
 */

export interface LinkTarget {
  id: string;
  term: string;
  abbreviation?: string;
  alsoKnownAs?: string[];
}

export type Segment = { text: string } | { text: string; termId: string };

export interface LinkIndex {
  /** Lowercased name → term id. */
  names: Map<string, string>;
  /** Abbreviation (exact case) → term id. */
  abbreviations: Map<string, string>;
  nameRegex: RegExp | null;
  abbreviationRegex: RegExp | null;
  ids: Set<string>;
}

export const MAX_LINKS_PER_SECTION = 5;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function boundaryRegex(phrases: string[], flags: string): RegExp | null {
  if (phrases.length === 0) return null;
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  return new RegExp(
    `(?<![\\p{L}\\p{N}_-])(?:${sorted.map(escape).join('|')})(?![\\p{L}\\p{N}_-])`,
    `gu${flags}`,
  );
}

/**
 * Builds the lookup once for all pages.
 * TODO(edge-cases): a name or abbreviation shared by two terms (e.g. BI, ART) is left unlinked;
 * it needs a "did you mean" choice.
 */
export function buildLinkIndex(targets: LinkTarget[]): LinkIndex {
  const nameOwners = new Map<string, Set<string>>();
  const abbrOwners = new Map<string, Set<string>>();
  const add = (map: Map<string, Set<string>>, key: string, id: string) => {
    if (!map.has(key)) map.set(key, new Set());
    map.get(key)?.add(id);
  };
  for (const t of targets) {
    for (const name of [t.term, ...(t.alsoKnownAs ?? [])]) {
      const key = name.trim().toLowerCase();
      if (key.length >= 3) add(nameOwners, key, t.id);
    }
    if (t.abbreviation && t.abbreviation.trim().length >= 2)
      add(abbrOwners, t.abbreviation.trim(), t.id);
  }
  const unique = (map: Map<string, Set<string>>) =>
    new Map(
      [...map].filter(([, ids]) => ids.size === 1).map(([k, ids]) => [k, [...ids][0] as string]),
    );
  const names = unique(nameOwners);
  const abbreviations = unique(abbrOwners);
  return {
    names,
    abbreviations,
    nameRegex: boundaryRegex([...names.keys()], 'i'),
    abbreviationRegex: boundaryRegex([...abbreviations.keys()], ''),
    ids: new Set(targets.map((t) => t.id)),
  };
}

interface Match {
  start: number;
  end: number;
  termId: string;
}

function autoMatches(text: string, index: LinkIndex): Match[] {
  const found: Match[] = [];
  for (const [regex, lookup, lower] of [
    [index.nameRegex, index.names, true],
    [index.abbreviationRegex, index.abbreviations, false],
  ] as const) {
    if (!regex) continue;
    for (const m of text.matchAll(regex)) {
      const id = lookup.get(lower ? m[0].toLowerCase() : m[0]);
      if (id && m.index !== undefined)
        found.push({ start: m.index, end: m.index + m[0].length, termId: id });
    }
  }
  // Longest first at each position, then drop overlaps.
  found.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
  const kept: Match[] = [];
  for (const m of found) {
    const last = kept[kept.length - 1];
    if (last && m.start < last.end) {
      if (m.end - m.start > last.end - last.start && m.start === last.start)
        kept[kept.length - 1] = m;
      continue;
    }
    kept.push(m);
  }
  return kept;
}

/** Splits one section of text into plain and linked segments. */
export function linkify(
  text: string,
  index: LinkIndex,
  selfId: string,
  max = MAX_LINKS_PER_SECTION,
): Segment[] {
  const out: Segment[] = [];
  const linked = new Set<string>([selfId]);
  let count = 0;

  const pushText = (s: string) => {
    if (!s) return;
    const prev = out[out.length - 1];
    if (prev && !('termId' in prev)) prev.text += s;
    else out.push({ text: s });
  };

  /** Auto-links a stretch of text that has no overrides in it. */
  const autoLink = (chunk: string) => {
    let pos = 0;
    for (const m of autoMatches(chunk, index)) {
      if (count >= max || linked.has(m.termId)) continue;
      pushText(chunk.slice(pos, m.start));
      out.push({ text: chunk.slice(m.start, m.end), termId: m.termId });
      linked.add(m.termId);
      count++;
      pos = m.end;
    }
    pushText(chunk.slice(pos));
  };

  const overrides = /\[\[(!?)([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let pos = 0;
  for (const m of text.matchAll(overrides)) {
    const start = m.index ?? 0;
    autoLink(text.slice(pos, start));
    const [, noLink, target = '', label] = m;
    if (noLink) {
      pushText(target);
    } else {
      const id = target.trim();
      const shown = label ?? id.replace(/-/g, ' ');
      if (index.ids.has(id) && id !== selfId) {
        out.push({ text: shown, termId: id });
        linked.add(id);
      } else {
        pushText(shown);
      }
    }
    pos = start + m[0].length;
  }
  autoLink(text.slice(pos));
  return out;
}
