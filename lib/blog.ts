import { readdir } from "node:fs/promises";
import path from "node:path";
import { cache, type ComponentType } from "react";

export type BlogPostMetadata = {
  title: string;
  description: string;
  publishedAt: string;
  excerpt?: string;
};

type BlogPostModule = {
  default: ComponentType;
  metadata: BlogPostMetadata;
};

export type BlogPostSummary = BlogPostMetadata & {
  slug: string;
};

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");

async function importBlogPost(slug: string): Promise<BlogPostModule> {
  return import(`@/content/blog/${slug}.mdx`);
}

export const getBlogSlugs = cache(async () => {
  const entries = await readdir(BLOG_DIRECTORY, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.replace(/\.mdx$/, ""))
    .toSorted((left, right) => left.localeCompare(right));
});

export const getAllBlogPosts = cache(async (): Promise<BlogPostSummary[]> => {
  const slugs = await getBlogSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await importBlogPost(slug);

      return {
        slug,
        ...metadata,
      };
    }),
  );

  return posts.toSorted(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
});

export const getBlogPost = cache(async (slug: string) => {
  const slugs = await getBlogSlugs();

  if (!slugs.includes(slug)) {
    return null;
  }

  const post = await importBlogPost(slug);

  return {
    slug,
    ...post,
  };
});

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
