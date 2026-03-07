import Link from "next/link";
import { formatBlogDate, getAllBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Oh My Brew",
  description: "Coffee notes, menu stories, and updates from Oh My Brew.",
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <section className="mx-auto max-w-3xl">
      <div className="max-w-2xl">
        <h1 className="font-display text-5xl leading-tight text-[color:var(--color-omb-red)] sm:text-6xl">
          Blog
        </h1>
        <p className="mt-4 text-base leading-8 text-[color:var(--color-omb-soft-ink)]">
          A home for menu stories, coffee thoughts, and the details we are learning while
          building Oh My Brew.
        </p>
      </div>

      {posts.length > 0 ? (
        <ul className="mt-12 space-y-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="rounded-[28px] border border-[color:var(--color-omb-warm-grey)]/40 bg-[color:var(--color-omb-off-white)] p-6 shadow-sm transition-transform hover:-translate-y-0.5">
                <p className="text-sm uppercase tracking-[0.16em] text-[color:var(--color-omb-warm-grey)]">
                  {formatBlogDate(post.publishedAt)}
                </p>
                <h2 className="mt-3 text-3xl leading-tight font-[family:var(--font-display)] text-[color:var(--color-omb-red)]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-[color:var(--color-omb-electric-brew-blue)]"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-4 text-base leading-8 text-[color:var(--color-omb-soft-ink)]">
                  {post.excerpt ?? post.description}
                </p>
                <div className="mt-5">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-medium text-[color:var(--color-omb-electric-brew-blue)] underline decoration-[color:var(--color-omb-electric-brew-blue)]/30 underline-offset-4 transition-colors hover:text-[color:var(--color-omb-red)] hover:decoration-[color:var(--color-omb-red)]"
                  >
                    Read post
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 rounded-[28px] border border-dashed border-[color:var(--color-omb-warm-grey)]/60 bg-[color:var(--color-omb-off-white)] p-6 text-base leading-8 text-[color:var(--color-omb-soft-ink)]">
          No posts yet. Drop an `.mdx` file into `content/blog` and it will show up here.
        </div>
      )}
    </section>
  );
}
