import type { LINE_IDS } from '../schema/values';

/** Glossary CSV line names → line IDs (docs/content/term-schema.md › Line IDs). */
export const LINE_NAME_TO_ID: Record<string, (typeof LINE_IDS)[number]> = {
  All: 'all',
  Life: 'life',
  Health: 'health',
  Property: 'property',
  'Casualty/Liability': 'casualty',
  Motor: 'auto',
  Commercial: 'commercial',
  'Marine/Aviation/Transit': 'marine',
  Specialty: 'specialty',
  'Financial Lines': 'financial',
  Agriculture: 'agriculture',
  'Social/Government': 'social',
  Reinsurance: 'reinsurance',
  'Alternative Risk Transfer': 'art',
};

export type CsvRow = Record<string, string>;

function list(value: string | undefined, separator: string): string[] {
  return (value ?? '')
    .split(separator)
    .map((v) => v.trim())
    .filter(Boolean);
}

function optional(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

/** Drops undefined values so the YAML only has fields that are set. */
function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

/** One glossary CSV row → a basic term file (seed fields only). */
export function rowToTerm(row: CsvRow): { id: string; data: Record<string, unknown> } {
  const lines = list(row['Applies To Lines'], ',').map((name) => {
    const id = LINE_NAME_TO_ID[name];
    if (!id) throw new Error(`${row.ID}: unknown line "${name}"`);
    return id;
  });
  const abbreviation = optional(row.Abbreviation);
  return {
    id: (row.ID ?? '').trim(),
    data: compact({
      term: (row.Term ?? '').trim(),
      contentStatus: 'basic',
      abbreviation,
      abbreviationIsCommonName: abbreviation
        ? row['Abbreviation Is Common Name'] === 'Yes'
        : undefined,
      alsoKnownAs: list(row['Also Known As'], ';'),
      category: row.Category,
      lines: [...new Set(lines)],
      usageFrequency: row['Usage Frequency'],
      difficulty: row.Difficulty,
      definition: (row['Plain-English Definition'] ?? '').trim(),
      example: (row.Example ?? '').trim(),
      whereYoullSeeIt: list(row["Where You'll See It"], ','),
      relatedTerms: list(row['Related Terms'], ','),
      usNotes: optional(row['US Notes']),
      meta: { source: 'editorial' },
    }),
  };
}

/** One taxonomy CSV row → an insurance type file. */
export function rowToType(row: CsvRow): { id: string; data: Record<string, unknown> } {
  return {
    id: (row.ID ?? '').trim(),
    data: compact({
      name: (row.Name ?? '').trim(),
      parent: optional(row['Parent ID']),
      alsoKnownAs: optional(row['Also Known As']),
      description: (row['Plain-English Description'] ?? '').trim(),
      example: optional(row.Example),
      segment: row['Personal/Commercial/Both'],
      usNotes: optional(row['US Notes']),
    }),
  };
}
