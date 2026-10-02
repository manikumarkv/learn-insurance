import { collection, config, fields, singleton } from '@keystatic/core';
import {
  CATEGORIES,
  CONTENT_SOURCES,
  CONTENT_STATUSES,
  DIFFICULTIES,
  FLOW_STAGES,
  LINE_IDS,
  PAID_BY,
  PLACES,
  QUESTION_TYPES,
  STORY_STAGES,
  TYPE_SEGMENTS,
  USAGE_FREQUENCIES,
} from './src/content/schema/values';

/** Builds Keystatic select options from a list of allowed values. */
function options<T extends string>(values: readonly T[]) {
  return values.map((value) => ({ label: value, value }));
}

const lines = (label: string) =>
  fields.object({
    label: fields.text({ label: 'Label' }),
    lines: fields.array(fields.text({ label: 'Line' }), {
      label,
      itemLabel: (props) => props.value,
    }),
  });

/** Diagram data. Which fields appear depends on the template, as in docs/content/term-schema.md. */
const diagram = fields.conditional(
  fields.select({
    label: 'Template',
    options: [
      { label: 'Before / after (changes to a policy)', value: 'before-after' },
      { label: 'Timeline (time-based terms)', value: 'timeline' },
      { label: 'Who pays (money splits)', value: 'who-pays' },
      { label: 'Split (two sides of one idea)', value: 'split' },
      { label: 'Flow (a step in the policy lifecycle)', value: 'flow' },
    ],
    defaultValue: 'flow',
  }),
  {
    'before-after': fields.object({
      before: lines('Before'),
      change: fields.text({ label: 'Change', description: 'e.g. Endorsement' }),
      after: lines('After'),
    }),
    timeline: fields.object({
      start: fields.text({ label: 'Start' }),
      end: fields.text({ label: 'End' }),
      segments: fields.array(
        fields.object({
          label: fields.text({ label: 'Label' }),
          share: fields.integer({ label: 'Share (%)', description: 'Shares add up to 100.' }),
          paidBy: fields.select({
            label: 'Paid by',
            options: options(PAID_BY),
            defaultValue: 'you',
          }),
        }),
        { label: 'Segments', itemLabel: (props) => props.fields.label.value },
      ),
    }),
    'who-pays': fields.object({
      total: fields.integer({ label: 'Total ($)' }),
      parts: fields.array(
        fields.object({
          label: fields.text({ label: 'Label' }),
          amount: fields.integer({
            label: 'Amount ($)',
            description: 'Amounts add up to the total.',
          }),
          paidBy: fields.select({
            label: 'Paid by',
            options: options(PAID_BY.filter((p) => p !== 'none')),
            defaultValue: 'you',
          }),
        }),
        { label: 'Parts', itemLabel: (props) => props.fields.label.value },
      ),
    }),
    split: fields.object({
      left: lines('Left'),
      right: lines('Right'),
    }),
    flow: fields.object({
      highlight: fields.multiselect({ label: 'Highlighted stages', options: options(FLOW_STAGES) }),
    }),
  },
);

const question = fields.object({
  type: fields.select({
    label: 'Type',
    options: options(QUESTION_TYPES),
    defaultValue: 'scenario',
  }),
  question: fields.text({ label: 'Question', multiline: true }),
  options: fields.array(fields.text({ label: 'Option' }), {
    label: 'Options (3–4, exactly one correct)',
    itemLabel: (props) => props.value,
  }),
  answer: fields.integer({
    label: 'Correct option',
    description: 'Zero-based: 0 is the first option.',
  }),
  explanation: fields.text({ label: 'Explanation', multiline: true }),
});

/*
 * Fields marked "full terms" are empty on basic terms (seed data only).
 * Content validation (story 2.2) requires them when contentStatus is "full".
 */
const terms = collection({
  label: 'Terms',
  path: 'src/content/terms/*',
  format: { data: 'yaml' },
  slugField: 'term',
  columns: ['usageFrequency', 'contentStatus'],
  schema: {
    term: fields.slug({
      name: { label: 'Term (full form)', validation: { isRequired: true } },
      slug: {
        label: 'ID',
        description: 'Lowercase slug of the full term. Also the URL: /terms/<id>.',
        validation: { pattern: { regex: /^[a-z0-9-]+$/, message: 'Use a–z, 0–9 and hyphens.' } },
      },
    }),
    contentStatus: fields.select({
      label: 'Content status',
      description: 'basic shows the short page; full shows everything.',
      options: options(CONTENT_STATUSES),
      defaultValue: 'basic',
    }),
    abbreviation: fields.text({ label: 'Abbreviation', description: 'e.g. ACV, HMO' }),
    abbreviationIsCommonName: fields.checkbox({
      label: 'People mostly use the abbreviation',
      description: 'Title shows "HMO (Health Maintenance Organization)".',
    }),
    alsoKnownAs: fields.array(fields.text({ label: 'Name' }), {
      label: 'Also known as',
      itemLabel: (props) => props.value,
    }),
    category: fields.select({
      label: 'Category',
      options: options(CATEGORIES),
      defaultValue: 'Core Concept',
    }),
    lines: fields.multiselect({ label: 'Insurance lines', options: options(LINE_IDS) }),
    usageFrequency: fields.select({
      label: 'Usage frequency',
      options: options(USAGE_FREQUENCIES),
      defaultValue: 'Medium',
    }),
    difficulty: fields.select({
      label: 'Difficulty',
      options: options(DIFFICULTIES),
      defaultValue: 'Beginner',
    }),
    quickAnswer: fields.text({
      label: 'Quick answer (full terms)',
      description: '40–60 words.',
      multiline: true,
    }),
    definition: fields.text({
      label: 'Definition',
      description: '2–4 short sentences.',
      multiline: true,
    }),
    example: fields.text({ label: 'Example', multiline: true }),
    whereYoullSeeIt: fields.multiselect({ label: "Where you'll see it", options: options(PLACES) }),
    flowStages: fields.multiselect({
      label: 'Flow stages (full terms)',
      options: options(FLOW_STAGES),
    }),
    story: fields.object(
      {
        person: fields.text({ label: 'Person', description: 'A simple first name, e.g. Tom.' }),
        steps: fields.array(
          fields.object({
            stage: fields.select({
              label: 'Stage',
              options: options(STORY_STAGES),
              defaultValue: 'Bind',
            }),
            highlight: fields.checkbox({ label: 'Highlight (exactly one step)' }),
            text: fields.text({ label: 'Text', multiline: true }),
          }),
          { label: 'Steps (3–5)', itemLabel: (props) => props.fields.stage.value },
        ),
      },
      { label: 'Story (full terms)' },
    ),
    visual: fields.object(
      {
        caption: fields.text({ label: 'Caption' }),
        diagram,
      },
      { label: 'Visual (full terms)' },
    ),
    questions: fields.array(question, {
      label: 'Questions (full terms: 10 High, 6 Medium, 4 Low)',
      itemLabel: (props) => props.fields.question.value,
    }),
    faqs: fields.array(
      fields.object({
        question: fields.text({ label: 'Question' }),
        answer: fields.text({
          label: 'Answer',
          description: '50 words or fewer.',
          multiline: true,
        }),
      }),
      { label: 'FAQs (full terms, 2–4)', itemLabel: (props) => props.fields.question.value },
    ),
    relatedTerms: fields.multiRelationship({ label: 'Related terms', collection: 'terms' }),
    usNotes: fields.text({ label: 'US notes', multiline: true }),
    seo: fields.object(
      {
        metaTitle: fields.text({ label: 'Meta title', description: '60 characters or fewer.' }),
        metaDescription: fields.text({
          label: 'Meta description',
          description: '140–160 characters.',
          multiline: true,
        }),
      },
      { label: 'SEO (full terms)' },
    ),
    sources: fields.array(
      fields.object({
        title: fields.text({ label: 'Title' }),
        url: fields.url({ label: 'URL' }),
      }),
      { label: 'Sources (full terms, 2+)', itemLabel: (props) => props.fields.title.value },
    ),
    meta: fields.object(
      {
        source: fields.select({
          label: 'Source',
          options: options(CONTENT_SOURCES),
          defaultValue: 'editorial',
        }),
        createdAt: fields.date({ label: 'Created' }),
        updatedAt: fields.date({ label: 'Updated' }),
        requestIssue: fields.integer({ label: 'Request issue #' }),
        reviewedBy: fields.text({
          label: 'Reviewed by',
          description: 'term-reviewer for AI terms.',
        }),
      },
      { label: 'Meta' },
    ),
  },
});

const types = collection({
  label: 'Insurance types',
  path: 'src/content/types/*',
  format: { data: 'yaml' },
  slugField: 'name',
  columns: ['parent', 'segment'],
  schema: {
    name: fields.slug({
      name: { label: 'Name', validation: { isRequired: true } },
      slug: {
        label: 'ID',
        description:
          'Dotted path from data/insurance-taxonomy.csv, e.g. life.term. URL: /types/<id>.',
        validation: {
          pattern: {
            regex: /^[a-z0-9._-]+$/,
            message: 'Use a–z, 0–9, dots, underscores and hyphens.',
          },
        },
      },
    }),
    parent: fields.relationship({ label: 'Parent type', collection: 'types' }),
    alsoKnownAs: fields.text({ label: 'Also known as' }),
    quickAnswer: fields.text({
      label: 'Quick answer',
      description: '40–60 words. Optional: the page uses the description when empty.',
      multiline: true,
    }),
    description: fields.text({ label: 'Plain-English description', multiline: true }),
    example: fields.text({ label: 'Example', multiline: true }),
    segment: fields.select({
      label: 'Personal or commercial',
      options: options(TYPE_SEGMENTS),
      defaultValue: 'Both',
    }),
    usNotes: fields.text({ label: 'US notes', multiline: true }),
    faqs: fields.array(
      fields.object({
        question: fields.text({ label: 'Question' }),
        answer: fields.text({ label: 'Answer', multiline: true }),
      }),
      { label: 'FAQs', itemLabel: (props) => props.fields.question.value },
    ),
  },
});

const paths = collection({
  label: 'Learning paths',
  path: 'src/content/paths/*',
  format: { data: 'yaml' },
  slugField: 'title',
  schema: {
    title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
    description: fields.text({ label: 'Description', multiline: true }),
    type: fields.relationship({
      label: 'Insurance type',
      description: 'Leave empty for Insurance basics.',
      collection: 'types',
    }),
    modules: fields.array(
      fields.object({
        title: fields.text({ label: 'Module title' }),
        terms: fields.multiRelationship({ label: 'Terms, in learning order', collection: 'terms' }),
      }),
      { label: 'Modules', itemLabel: (props) => props.fields.title.value },
    ),
  },
});

const page = (label: string, path: string) =>
  singleton({
    label,
    path,
    format: { contentField: 'body' },
    schema: {
      title: fields.text({ label: 'Title' }),
      updatedAt: fields.date({ label: 'Last updated' }),
      body: fields.markdoc({ label: 'Body' }),
    },
  });

/** local: save to files on disk (dev). github: commit to the repo (production). See docs/keystatic-github-mode.md. */
const storage =
  import.meta.env?.KEYSTATIC_STORAGE === 'github'
    ? ({ kind: 'github', repo: { owner: 'manikumarkv', name: 'learn-insurance' } } as const)
    : ({ kind: 'local' } as const);

export default config({
  storage,
  ui: {
    brand: { name: 'LearnInsurance' },
    navigation: {
      Content: ['terms', 'types', 'paths'],
      Pages: ['about', 'privacy', 'termsOfUse', 'disclaimer'],
    },
  },
  collections: { terms, types, paths },
  singletons: {
    about: page('About', 'src/content/pages/about'),
    privacy: page('Privacy policy', 'src/content/pages/privacy'),
    termsOfUse: page('Terms of use', 'src/content/pages/terms-of-use'),
    disclaimer: page('Disclaimer', 'src/content/pages/disclaimer'),
  },
});
