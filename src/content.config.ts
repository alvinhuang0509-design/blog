import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const commonFields = {
  title: z.string(),
  description: z.string(),
  meta_title: z.string().optional(),
  date: z.date().optional(),
  image: z.string().optional(),
  draft: z.boolean(),
};

// Post collection schema
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    updated: z.date().optional(),
    image: z.string().optional(),
    author: z.string().default("Lewin"),
    categories: z.array(z.string()).default(["others"]),
    tags: z.array(z.string()).default(["others"]),
    draft: z.boolean().optional(),
    views: z.number().default(0),
    comments: z.number().default(0),
    featured: z.boolean().default(false),
    pinned: z.boolean().default(false),
    weight: z.number().optional(),
    subcategory: z.string().optional(),
  }),
});

// AI collection schema
const aiCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/ai" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    updated: z.date().optional(),
    image: z.string().optional(),
    author: z.string().default("Lewin"),
    categories: z.array(z.string()).default(["AI"]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().optional(),
    views: z.number().default(0),
    comments: z.number().default(0),
    featured: z.boolean().default(false),
    pinned: z.boolean().default(false),
    weight: z.number().optional(),
    related_papers: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
    model_type: z.string().optional(),
  }),
});

// Security collection schema
const securityCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/security" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date().optional(),
    updated: z.date().optional(),
    image: z.string().optional(),
    author: z.string().default("Lewin"),
    categories: z.array(z.string()).default(["Security"]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().optional(),
    views: z.number().default(0),
    comments: z.number().default(0),
    featured: z.boolean().default(false),
    pinned: z.boolean().default(false),
    weight: z.number().optional(),
    severity: z.enum(["low", "medium", "high", "critical"]).optional(),
    cve_id: z.string().optional(),
  }),
});

// Author collection schema
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/authors" }),
  schema: z.object({
    ...commonFields,
    social: z
      .array(
        z
          .object({
            name: z.string().optional(),
            icon: z.string().optional(),
            link: z.string().optional(),
          })
          .optional(),
      )
      .optional(),
    draft: z.boolean().optional(),
  }),
});

// Pages collection schema
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    ...commonFields,
  }),
});

// about collection schema
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({
    ...commonFields,
  }),
});

// contact collection schema
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    ...commonFields,
  }),
});

// Homepage collection schema
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      title: z.string(),
      content: z.string(),
      image: z.string(),
      image_dark: z.string().optional(),
      button: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
    }),
    features: z.array(
      z.object({
        title: z.string(),
        image: z.string(),
        content: z.string(),
        bulletpoints: z.array(z.string()),
        button: z.object({
          enable: z.boolean(),
          label: z.string(),
          link: z.string(),
        }),
      }),
    ),
  }),
});

// Call to Action collection schema
const ctaSectionCollection = defineCollection({
  loader: glob({
    pattern: "call-to-action.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
  }),
});

// Testimonials Section collection schema
const testimonialSectionCollection = defineCollection({
  loader: glob({
    pattern: "testimonial.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    testimonials: z.array(
      z.object({
        name: z.string(),
        avatar: z.string(),
        designation: z.string(),
        content: z.string(),
      }),
    ),
  }),
});

// Daily Life collection schema
const dailyLifeCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/daily-life" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.date(),
    updated: z.date().optional(),
    image: z.string().optional(),
    author: z.string().default("Lewin"),
    categories: z.array(z.string()).default(["others"]),
    tags: z.array(z.string()).default(["others"]),
    draft: z.boolean().optional(),
    views: z.number().default(0),
    comments: z.number().default(0),
    featured: z.boolean().default(false),
    pinned: z.boolean().default(false),
    weight: z.number().optional(),
    location: z.string().optional(),
    mood: z.string().optional(),
  }),
});

// Export collections
export const collections = {
  // Pages
  homepage: homepageCollection,
  blog: blogCollection,
  ai: aiCollection,
  security: securityCollection,
  authors: authorsCollection,
  pages: pagesCollection,
  about: aboutCollection,
  contact: contactCollection,
  dailyLife: dailyLifeCollection,

  // sections
  ctaSection: ctaSectionCollection,
  testimonialSection: testimonialSectionCollection,
};
