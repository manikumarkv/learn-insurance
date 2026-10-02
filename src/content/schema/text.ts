/** Small text helpers used by content validation. */

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Splits prose into sentences. Good enough for limit checks, not for linguistics. */
export function sentences(text: string): string[] {
  return text
    .replace(/\b(e\.g|i\.e|etc|vs|U\.S)\./gi, (m) => m.replace(/\./g, ''))
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** IDs referenced with [[id]] or [[id|text]] term-link overrides. [[!word]] (no link) is ignored. */
export function linkTargets(text: string): string[] {
  const ids: string[] = [];
  for (const match of text.matchAll(/\[\[([^\]|!][^\]|]*)(?:\|[^\]]*)?\]\]/g)) {
    const id = match[1]?.trim();
    if (id) ids.push(id);
  }
  return ids;
}
