import { z } from 'zod';
import { TYPE_SEGMENTS } from './values';

export const insuranceTypeSchema = z.object({
  name: z.string().trim().min(1),
  parent: z.string().nullable().optional(),
  alsoKnownAs: z.string().optional(),
  description: z.string().trim().min(1),
  example: z.string().optional(),
  segment: z.enum(TYPE_SEGMENTS),
  usNotes: z.string().optional(),
});

export type InsuranceType = z.infer<typeof insuranceTypeSchema>;
