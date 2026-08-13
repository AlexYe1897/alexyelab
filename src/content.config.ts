import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
  }),

  schema: z.object({
    title: z.string(),

    description: z.string(),

    pubDate: z.string().date(),

    tags: z.array(z.string()),

    category: z.string(),

    draft: z.boolean(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    status: z.enum(['planned', 'in-progress', 'completed']),
    featured: z.boolean(),
    order: z.number(),
    repository: z.string().url().optional(),
    website: z.string().url().optional(),
    draft: z.boolean(),
  }),
});

export const collections = {
  blog,
  projects,
};
