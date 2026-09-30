import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({
    chapter: z.number(),
    title: z.string(),
    subtitle: z.string(),
    tags: z.array(z.string()),
    sources: z.array(z.string()),
    summary: z.array(z.string()),
    coreQuestion: z.string().optional(),
    prev: z.object({
      id: z.string(),
      no: z.number().optional(),
      title: z.string(),
    }).nullable().optional(),
    next: z.object({
      id: z.string(),
      no: z.number().optional(),
      title: z.string(),
    }).nullable().optional(),
  }),
});

const cases = defineCollection({
  loader: file('./src/content/cases/cases.json'),
  schema: z.object({
    id: z.string(),
    chapterId: z.string(),
    chapterNo: z.number(),
    chapterTitle: z.string(),
    title: z.string(),
    context: z.string(),
    analysis: z.array(z.string()),
    takeaway: z.string(),
  }),
});

const practice = defineCollection({
  loader: file('./src/content/practice/practice.json'),
  schema: z.object({
    id: z.string(),
    chapterId: z.string(),
    chapterNo: z.number(),
    chapterTitle: z.string().optional(),
    type: z.string(),
    prompt: z.string(),
    guidance: z.string(),
  }),
});

const diagnostic = defineCollection({
  loader: file('./src/content/diagnostic/diagnostic.json'),
  schema: z.object({
    id: z.string(),
    dimensions: z.array(z.object({
      key: z.string(),
      name: z.string(),
      detail: z.string(),
      items: z.array(z.string()),
      chapters: z.array(z.string()),
    })),
    levels: z.array(z.object({
      level: z.number(),
      name: z.string(),
      detail: z.string(),
      criteria: z.array(z.string()),
    })),
  }),
});

const methodology = defineCollection({
  loader: file('./src/content/methodology/methodology.json'),
  schema: z.object({
    id: z.string(),
    thirteenSteps: z.array(z.object({
      no: z.string(),
      en: z.string(),
      zh: z.string(),
      note: z.string(),
    })),
    cycle: z.array(z.object({
      en: z.string(),
      zh: z.string(),
      note: z.string(),
    })),
    reliabilityTiers: z.array(z.object({
      tier: z.string(),
      name: z.string(),
      note: z.string(),
    })),
    axioms: z.array(z.string()),
    matrixDimensions: z.array(z.string()),
    stopLossProcedure: z.array(z.object({
      step: z.number(),
      title: z.string(),
      note: z.string(),
    })),
  }),
});

const knowledge = defineCollection({
  loader: file('./src/content/knowledge/knowledge.json'),
  schema: z.object({
    id: z.string(),
    field: z.string(),
    items: z.array(z.string()),
  }),
});

export const collections = {
  chapters,
  cases,
  practice,
  diagnostic,
  methodology,
  knowledge,
};
