import { z } from 'zod';

export const learningPathSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().optional(),
  type: z.string().nullable().optional(),
  modules: z
    .array(z.object({ title: z.string().trim().min(1), terms: z.array(z.string()).min(1) }))
    .min(1, 'add at least one module'),
});

export type LearningPath = z.infer<typeof learningPathSchema>;
