import { z } from 'zod';
import { linkTargets, sentences, wordCount } from './text';
import {
  CATEGORIES,
  CONTENT_SOURCES,
  CONTENT_STATUSES,
  DIFFICULTIES,
  FLOW_STAGES,
  LINE_IDS,
  PAID_BY,
  PLACES,
  QUESTION_POOL_SIZE,
  QUESTION_TYPES,
  STORY_STAGES,
  USAGE_FREQUENCIES,
} from './values';

/*
 * Zod mirror of docs/content/term-schema.md. The base shape accepts basic terms (seed fields
 * only); checkFullTerm adds the rules for contentStatus: full. Cross-file rules (related terms
 * and [[id]] targets exist) are in validate.ts because they need every term.
 */

const text = z.string().trim();
const optionalText = z.string().optional();

const labelledLines = z.object({ label: text.min(1), lines: z.array(text.min(1)).min(1) });

const diagram = z.discriminatedUnion('discriminant', [
  z.object({
    discriminant: z.literal('before-after'),
    value: z.object({ before: labelledLines, change: text.min(1), after: labelledLines }),
  }),
  z.object({
    discriminant: z.literal('timeline'),
    value: z.object({
      start: text.min(1),
      end: text.min(1),
      segments: z
        .array(
          z.object({
            label: text.min(1),
            share: z.number().int().min(1).max(100),
            paidBy: z.enum(PAID_BY),
          }),
        )
        .min(1),
    }),
  }),
  z.object({
    discriminant: z.literal('who-pays'),
    value: z.object({
      total: z.number().int().positive(),
      parts: z
        .array(
          z.object({
            label: text.min(1),
            amount: z.number().int().nonnegative(),
            paidBy: z.enum(['you', 'insurer']),
          }),
        )
        .min(2),
    }),
  }),
  z.object({
    discriminant: z.literal('split'),
    value: z.object({ left: labelledLines, right: labelledLines }),
  }),
  z.object({
    discriminant: z.literal('flow'),
    value: z.object({ highlight: z.array(z.enum(FLOW_STAGES)) }),
  }),
]);

const question = z.object({
  type: z.enum(QUESTION_TYPES),
  question: text.min(1),
  options: z.array(text.min(1)).min(3).max(4),
  answer: z.number().int().min(0),
  explanation: text.min(1),
});

const isoDate = z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date()]);

export const termBaseSchema = z.object({
  term: text.min(1),
  contentStatus: z.enum(CONTENT_STATUSES),
  abbreviation: optionalText,
  abbreviationIsCommonName: z.boolean().optional(),
  alsoKnownAs: z.array(text.min(1)).default([]),
  category: z.enum(CATEGORIES),
  lines: z
    .array(z.enum(LINE_IDS))
    .min(1, 'add at least one line (use "all" if it applies everywhere)'),
  usageFrequency: z.enum(USAGE_FREQUENCIES),
  difficulty: z.enum(DIFFICULTIES),
  quickAnswer: optionalText,
  definition: text.min(1),
  example: text.min(1),
  whereYoullSeeIt: z.array(z.enum(PLACES)).default([]),
  flowStages: z.array(z.enum(FLOW_STAGES)).default([]),
  story: z
    .object({
      person: optionalText,
      steps: z
        .array(
          z.object({
            stage: z.enum(STORY_STAGES),
            highlight: z.boolean().optional(),
            text: text.min(1),
          }),
        )
        .default([]),
    })
    .optional(),
  visual: z.object({ caption: optionalText, diagram: diagram.optional() }).optional(),
  questions: z.array(question).default([]),
  faqs: z.array(z.object({ question: text.min(1), answer: text.min(1) })).default([]),
  relatedTerms: z.array(z.string()).default([]),
  usNotes: optionalText,
  seo: z.object({ metaTitle: optionalText, metaDescription: optionalText }).optional(),
  sources: z.array(z.object({ title: text.min(1), url: z.url() })).default([]),
  meta: z.object({
    source: z.enum(CONTENT_SOURCES),
    createdAt: isoDate.optional(),
    updatedAt: isoDate.optional(),
    requestIssue: z.number().int().positive().optional(),
    reviewedBy: optionalText,
  }),
});

export type Term = z.infer<typeof termBaseSchema>;

type Issue = { path: (string | number)[]; message: string };

function between(
  issues: Issue[],
  path: Issue['path'],
  actual: number,
  min: number,
  max: number,
  unit: string,
) {
  if (actual < min || actual > max) {
    const range = min === max ? `${min}` : `${min}–${max}`;
    issues.push({ path, message: `${actual} ${unit}, needs ${range}` });
  }
}

/** Rules that apply to every term, basic or full. */
export function checkAnyTerm(t: Term): Issue[] {
  const issues: Issue[] = [];
  if (t.abbreviation && t.abbreviationIsCommonName === undefined) {
    issues.push({
      path: ['abbreviationIsCommonName'],
      message: 'required when abbreviation is set',
    });
  }
  const own = [t.term, t.abbreviation].flatMap((s) => (s ? [s.toLowerCase()] : []));
  t.alsoKnownAs.forEach((name, i) => {
    if (own.includes(name.toLowerCase())) {
      issues.push({
        path: ['alsoKnownAs', i],
        message: 'must not repeat the term or its abbreviation',
      });
    }
  });
  if (t.meta.source === 'ai' && t.contentStatus === 'full' && !t.meta.reviewedBy) {
    issues.push({ path: ['meta', 'reviewedBy'], message: 'required for AI-written terms' });
  }
  return issues;
}

/** Extra rules for contentStatus: full. */
export function checkFullTerm(t: Term): Issue[] {
  const issues: Issue[] = [];
  const required = (path: Issue['path'], value: unknown) => {
    const empty =
      value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
    if (empty) issues.push({ path, message: 'required for full terms' });
    return !empty;
  };

  if (required(['quickAnswer'], t.quickAnswer) && t.quickAnswer) {
    between(issues, ['quickAnswer'], wordCount(t.quickAnswer), 40, 60, 'words');
  }
  between(issues, ['definition'], sentences(t.definition).length, 2, 4, 'sentences');
  required(['whereYoullSeeIt'], t.whereYoullSeeIt);
  required(['flowStages'], t.flowStages);

  // Story
  const steps = t.story?.steps ?? [];
  required(['story', 'person'], t.story?.person);
  between(issues, ['story', 'steps'], steps.length, 3, 5, 'steps');
  const highlights = steps.filter((s) => s.highlight).length;
  if (steps.length && highlights !== 1) {
    issues.push({
      path: ['story', 'steps'],
      message: `${highlights} highlighted steps, needs exactly 1`,
    });
  }

  // Visual
  const d = t.visual?.diagram;
  required(['visual', 'caption'], t.visual?.caption);
  if (required(['visual', 'diagram'], d) && d) {
    if (d.discriminant === 'who-pays') {
      const sum = d.value.parts.reduce((a, p) => a + p.amount, 0);
      if (sum !== d.value.total) {
        issues.push({
          path: ['visual', 'diagram', 'value', 'parts'],
          message: `amounts add up to ${sum}, but total is ${d.value.total}`,
        });
      }
    }
    if (d.discriminant === 'timeline') {
      const sum = d.value.segments.reduce((a, s) => a + s.share, 0);
      if (sum !== 100) {
        issues.push({
          path: ['visual', 'diagram', 'value', 'segments'],
          message: `shares add up to ${sum}, needs 100`,
        });
      }
    }
  }

  // Questions
  const pool = QUESTION_POOL_SIZE[t.usageFrequency];
  between(
    issues,
    ['questions'],
    t.questions.length,
    pool,
    pool,
    `questions for ${t.usageFrequency} usage`,
  );
  t.questions.forEach((q, i) => {
    if (q.answer >= q.options.length) {
      issues.push({
        path: ['questions', i, 'answer'],
        message: `answer ${q.answer} is out of range (${q.options.length} options, counted from 0)`,
      });
    }
  });
  const scenarios = t.questions.filter((q) => q.type === 'scenario').length;
  if (t.questions.length && scenarios * 2 < t.questions.length) {
    issues.push({
      path: ['questions'],
      message: `${scenarios} of ${t.questions.length} are scenario questions, needs at least half`,
    });
  }
  const answers = new Set(t.questions.map((q) => q.answer));
  if (t.questions.length > 2 && answers.size === 1) {
    issues.push({
      path: ['questions'],
      message: 'the correct answer is in the same position every time',
    });
  }

  // FAQs
  between(issues, ['faqs'], t.faqs.length, 2, 4, 'FAQs');
  const first = t.faqs[0]?.question.toLowerCase() ?? '';
  if (t.faqs.length && !first.startsWith('what is') && !first.startsWith('what are')) {
    issues.push({
      path: ['faqs', 0, 'question'],
      message: `should be "What is ${t.term} in insurance?"`,
    });
  }
  t.faqs.forEach((f, i) => {
    const words = wordCount(f.answer);
    if (words > 50) issues.push({ path: ['faqs', i, 'answer'], message: `${words} words, max 50` });
  });

  between(issues, ['relatedTerms'], t.relatedTerms.length, 2, 6, 'related terms');

  // SEO and sources
  const metaTitle = t.seo?.metaTitle;
  if (required(['seo', 'metaTitle'], metaTitle) && metaTitle && metaTitle.length > 60) {
    issues.push({ path: ['seo', 'metaTitle'], message: `${metaTitle.length} characters, max 60` });
  }
  const metaDescription = t.seo?.metaDescription;
  if (required(['seo', 'metaDescription'], metaDescription) && metaDescription) {
    between(issues, ['seo', 'metaDescription'], metaDescription.length, 140, 160, 'characters');
  }
  if (t.sources.length < 2) {
    issues.push({ path: ['sources'], message: `${t.sources.length} sources, needs at least 2` });
  }
  return issues;
}

/** Every text field that may contain [[id]] term links, with its path. */
export function linkableTexts(t: Term): { path: Issue['path']; text: string }[] {
  const out: { path: Issue['path']; text: string }[] = [];
  const add = (path: Issue['path'], value: string | undefined) => {
    if (value) out.push({ path, text: value });
  };
  add(['quickAnswer'], t.quickAnswer);
  add(['definition'], t.definition);
  add(['example'], t.example);
  add(['usNotes'], t.usNotes);
  t.story?.steps.forEach((s, i) => add(['story', 'steps', i, 'text'], s.text));
  t.faqs.forEach((f, i) => add(['faqs', i, 'answer'], f.answer));
  t.questions.forEach((q, i) => add(['questions', i, 'explanation'], q.explanation));
  return out;
}

export { linkTargets };
