/** Allowed values from docs/content/term-schema.md. Shared by Keystatic and content validation. */

export const CATEGORIES = [
  'Core Concept',
  'Policy Wording',
  'Lifecycle',
  'Underwriting',
  'Claims',
  'Distribution',
  'Finance & Actuarial',
  'Regulation',
  'Reinsurance',
  'Legal/Latin',
  'Technology',
  'Line-Specific',
] as const;

export const LINE_IDS = [
  'all',
  'life',
  'health',
  'property',
  'casualty',
  'auto',
  'commercial',
  'marine',
  'specialty',
  'financial',
  'agriculture',
  'social',
  'reinsurance',
  'art',
] as const;

export const USAGE_FREQUENCIES = ['High', 'Medium', 'Low'] as const;
export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const PLACES = [
  'Policy document',
  'Declarations page',
  'Quote',
  'Application form',
  'Billing statement',
  'Renewal notice',
  'Insurance ID card',
  'Claim documents',
  'Explanation of benefits',
  'Agent/broker communications',
  'Policy administration system',
  'Rating engine',
  'Underwriting system',
  'Claims system',
  'Data exchange/integration specs',
  'Product specification',
  'Regulatory filings',
  'Financial statements',
  'Reinsurance contract',
] as const;

export const FLOW_STAGES = [
  'Quote',
  'Underwriting',
  'Bind',
  'Issue',
  'Changes',
  'Claim',
  'Renewal',
] as const;

/** Story steps use a flow stage or "Result". */
export const STORY_STAGES = [...FLOW_STAGES, 'Result'] as const;

export const VISUAL_TEMPLATES = ['before-after', 'timeline', 'who-pays', 'split', 'flow'] as const;
export const PAID_BY = ['you', 'insurer', 'none'] as const;

export const QUESTION_TYPES = ['scenario', 'meaning', 'difference'] as const;

/** Question pool size by usage frequency (full terms only). */
export const QUESTION_POOL_SIZE: Record<(typeof USAGE_FREQUENCIES)[number], number> = {
  High: 10,
  Medium: 6,
  Low: 4,
};

/** basic: seed fields only (shows the basic page). full: every field written and reviewed. */
export const CONTENT_STATUSES = ['basic', 'full'] as const;

export const CONTENT_SOURCES = ['ai', 'editorial'] as const;

export const TYPE_SEGMENTS = ['Personal', 'Commercial', 'Both'] as const;
