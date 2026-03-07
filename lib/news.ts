import { readdir } from "node:fs/promises";
import path from "node:path";
import { cache, type ComponentType } from "react";

export type NewsPostMetadata = {
  title: string;
  description: string;
  publishedAt: string;
  excerpt?: string;
};

type NewsPostModule = {
  default: ComponentType;
  metadata: NewsPostMetadata;
};

export type NewsPostSummary = NewsPostMetadata & {
  slug: string;
};

const NEWS_DIRECTORY = path.join(process.cwd(), "content", "news");

async function importNewsPost(slug: string): Promise<NewsPostModule> {
  return import(`@/content/news/${slug}.mdx`);
}

export const getNewsSlugs = cache(async () => {
  const entries = await readdir(NEWS_DIRECTORY, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.replace(/\.mdx$/, ""))
    .toSorted((left, right) => left.localeCompare(right));
});

export const getAllNewsPosts = cache(async (): Promise<NewsPostSummary[]> => {
  const slugs = await getNewsSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await importNewsPost(slug);

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

export const getLatestNewsPosts = cache(async (limit: number) => {
  const posts = await getAllNewsPosts();
  return posts.slice(0, limit);
});

export const getNewsPost = cache(async (slug: string) => {
  const slugs = await getNewsSlugs();

  if (!slugs.includes(slug)) {
    return null;
  }

  const post = await importNewsPost(slug);

  return {
    slug,
    ...post,
  };
});

export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
