import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatBlogDate, getBlogPost, getBlogSlugs } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post not found | Oh My Brew",
    };
  }

  return {
    title: `${post.metadata.title} | Oh My Brew`,
    description: post.metadata.description,
  };
}

export const dynamicParams = false;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const { default: Post, metadata } = post;

  return (
    <article className="mx-auto max-w-3xl">
      <header className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.16em] text-[color:var(--color-omb-warm-grey)]">
          {formatBlogDate(metadata.publishedAt)}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-[color:var(--color-omb-red)] sm:text-6xl">
          {metadata.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-[color:var(--color-omb-soft-ink)]">
          {metadata.description}
        </p>
      </header>

      <div className="mt-12">
        <Post />
      </div>
    </article>
  );
}
