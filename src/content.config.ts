import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { learningPathSchema } from './content/schema/path';
import { termBaseSchema } from './content/schema/term';
import { insuranceTypeSchema } from './content/schema/type';

/** Use the file name as the id, unchanged (type ids contain dots, e.g. life.term). */
const fileId = ({ entry }: { entry: string }) => entry.replace(/\.yaml$/, '');

// Same schemas as `pnpm validate:content`. Cross-file and full-term rules run there, not here.
const terms = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/terms', generateId: fileId }),
  schema: termBaseSchema,
});

const types = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/types', generateId: fileId }),
  schema: insuranceTypeSchema,
});

const paths = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/paths', generateId: fileId }),
  schema: learningPathSchema,
});

export const collections = { terms, types, paths };
