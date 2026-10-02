import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { parse } from 'yaml';
import type { z } from 'zod';
import { learningPathSchema, type LearningPath } from './path';
import {
  checkAnyTerm,
  checkFullTerm,
  linkableTexts,
  linkTargets,
  termBaseSchema,
  type Term,
} from './term';
import { insuranceTypeSchema, type InsuranceType } from './type';

export interface ContentError {
  file: string;
  field: string;
  message: string;
}

export interface ContentFile {
  file: string;
  id: string;
  data: unknown;
}

const TERM_ID = /^[a-z0-9-]+$/;
const TYPE_ID = /^[a-z0-9._-]+$/;

/** Formats a path like ['faqs', 0, 'answer'] as "faqs[0].answer". */
export function formatPath(path: readonly PropertyKey[]): string {
  return path
    .map((p, i) => (typeof p === 'number' ? `[${p}]` : `${i ? '.' : ''}${String(p)}`))
    .join('');
}

function parseWith<T>(schema: z.ZodType<T>, f: ContentFile, errors: ContentError[]): T | undefined {
  const result = schema.safeParse(f.data);
  if (result.success) return result.data;
  for (const issue of result.error.issues) {
    errors.push({
      file: f.file,
      field: formatPath(issue.path) || '(file)',
      message: issue.message,
    });
  }
  return undefined;
}

/** Validates every content file, including links between them. Pure: takes parsed files. */
export function validateContent(files: {
  terms: ContentFile[];
  types: ContentFile[];
  paths: ContentFile[];
}): ContentError[] {
  const errors: ContentError[] = [];
  const termIds = new Set(files.terms.map((f) => f.id));
  const typeIds = new Set(files.types.map((f) => f.id));

  const terms: { f: ContentFile; t: Term }[] = [];
  for (const f of files.terms) {
    if (!TERM_ID.test(f.id)) {
      errors.push({ file: f.file, field: '(file name)', message: 'use a–z, 0–9 and hyphens' });
    }
    const t = parseWith(termBaseSchema, f, errors);
    if (!t) continue;
    terms.push({ f, t });
    const issues = [...checkAnyTerm(t), ...(t.contentStatus === 'full' ? checkFullTerm(t) : [])];
    for (const i of issues)
      errors.push({ file: f.file, field: formatPath(i.path), message: i.message });
  }

  for (const { f, t } of terms) {
    t.relatedTerms.forEach((id, i) => {
      if (id === f.id) {
        errors.push({
          file: f.file,
          field: `relatedTerms[${i}]`,
          message: 'a term cannot relate to itself',
        });
      } else if (!termIds.has(id)) {
        errors.push({
          file: f.file,
          field: `relatedTerms[${i}]`,
          message: `no term with id "${id}"`,
        });
      }
    });
    for (const { path, text } of linkableTexts(t)) {
      for (const id of linkTargets(text)) {
        if (!termIds.has(id)) {
          errors.push({
            file: f.file,
            field: formatPath(path),
            message: `[[${id}]] links to a term that doesn't exist`,
          });
        }
      }
    }
  }

  for (const f of files.types) {
    if (!TYPE_ID.test(f.id)) {
      errors.push({
        file: f.file,
        field: '(file name)',
        message: 'use a–z, 0–9, dots, underscores and hyphens',
      });
    }
    const t: InsuranceType | undefined = parseWith(insuranceTypeSchema, f, errors);
    if (t?.parent && !typeIds.has(t.parent)) {
      errors.push({
        file: f.file,
        field: 'parent',
        message: `no insurance type with id "${t.parent}"`,
      });
    }
  }

  for (const f of files.paths) {
    const p: LearningPath | undefined = parseWith(learningPathSchema, f, errors);
    if (!p) continue;
    if (p.type && !typeIds.has(p.type)) {
      errors.push({
        file: f.file,
        field: 'type',
        message: `no insurance type with id "${p.type}"`,
      });
    }
    p.modules.forEach((m, mi) =>
      m.terms.forEach((id, ti) => {
        if (!termIds.has(id)) {
          errors.push({
            file: f.file,
            field: `modules[${mi}].terms[${ti}]`,
            message: `no term with id "${id}"`,
          });
        }
      }),
    );
  }
  return errors;
}

/** Reads every *.yaml file in a folder. A file that isn't valid YAML becomes an error. */
export async function readFolder(dir: string, errors: ContentError[]): Promise<ContentFile[]> {
  let names: string[];
  try {
    names = (await readdir(dir)).filter((n) => n.endsWith('.yaml')).sort();
  } catch {
    return [];
  }
  const files: ContentFile[] = [];
  for (const name of names) {
    const file = join(dir, name);
    try {
      files.push({ file, id: basename(name, '.yaml'), data: parse(await readFile(file, 'utf8')) });
    } catch (e) {
      errors.push({ file, field: '(file)', message: `not valid YAML: ${(e as Error).message}` });
    }
  }
  return files;
}
