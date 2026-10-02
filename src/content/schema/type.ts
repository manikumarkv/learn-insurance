import { z } from 'zod';
import { TYPE_SEGMENTS } from './values';

export const insuranceTypeSchema = z.object({
  name: z.string().trim().min(1),
  parent: z.string().nullable().optional(),
  alsoKnownAs: z.string().optional(),
  /** Optional 40–60 word answer to "What is X?". The page falls back to the description. */
  quickAnswer: z.string().optional(),
  description: z.string().trim().min(1),
  example: z.string().optional(),
  segment: z.enum(TYPE_SEGMENTS),
  usNotes: z.string().optional(),
  updatedAt: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.date()]).optional(),
  faqs: z
    .array(z.object({ question: z.string().trim().min(1), answer: z.string().trim().min(1) }))
    .default([]),
});

export type InsuranceType = z.infer<typeof insuranceTypeSchema>;
