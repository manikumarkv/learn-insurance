import { getCollection } from 'astro:content';
import { displayTitle, truncate } from './display';
import { buildLinkIndex, type LinkIndex } from './links';

export interface TermPreview {
  title: string;
  text: string;
}

let cached: Promise<{ index: LinkIndex; previews: Map<string, TermPreview> }> | undefined;

/** The link index and preview text for every term, built once per build. */
export function getTermLinks() {
  cached ??= getCollection('terms').then((terms) => ({
    index: buildLinkIndex(
      terms.map((t) => ({
        id: t.id,
        term: t.data.term,
        abbreviation: t.data.abbreviation,
        alsoKnownAs: t.data.alsoKnownAs,
      })),
    ),
    previews: new Map(
      terms.map((t) => [
        t.id,
        {
          title: displayTitle(t.data),
          text: truncate(t.data.quickAnswer ?? t.data.definition, 220),
        },
      ]),
    ),
  }));
  return cached;
}
