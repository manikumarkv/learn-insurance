/** schema.org JSON-LD builders for term and type pages (story 4.5). */

export interface Crumb {
  name: string;
  path: string;
}

type JsonLd = Record<string, unknown>;

const absolute = (site: URL, path: string) => new URL(path, site).toString();

export function breadcrumbList(site: URL, crumbs: Crumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absolute(site, c.path),
    })),
  };
}

export function faqPage(faqs: { question: string; answer: string }[]): JsonLd | null {
  if (faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function definedTerm(
  site: URL,
  term: { id: string; name: string; description: string; alternateNames: string[] },
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': absolute(site, `/terms/${term.id}`),
    name: term.name,
    description: term.description,
    url: absolute(site, `/terms/${term.id}`),
    ...(term.alternateNames.length ? { alternateName: term.alternateNames } : {}),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'LearnInsurance glossary of US insurance terms',
      url: absolute(site, '/terms'),
    },
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" so content can't close the tag. */
export function toScript(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
