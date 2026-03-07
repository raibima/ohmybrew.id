import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

function MdxLink({
  className,
  href = "",
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  const linkClassName = cn(
    "font-medium text-[color:var(--color-omb-electric-brew-blue)] underline decoration-[color:var(--color-omb-electric-brew-blue)]/30 underline-offset-4 transition-colors hover:text-[color:var(--color-omb-red)] hover:decoration-[color:var(--color-omb-red)]",
    className,
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClassName}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={linkClassName}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

function MdxImage({
  alt = "",
  className,
  height,
  src = "",
  width,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  const parsedWidth = typeof width === "string" ? Number(width) : width;
  const parsedHeight = typeof height === "string" ? Number(height) : height;
  const imageClassName = cn(
    "my-8 h-auto w-full rounded-3xl border border-[color:var(--color-omb-warm-grey)]/40 bg-[color:var(--color-omb-off-white)] object-cover shadow-sm",
    className,
  );

  if (
    typeof src === "string" &&
    typeof parsedWidth === "number" &&
    typeof parsedHeight === "number" &&
    Number.isFinite(parsedWidth) &&
    Number.isFinite(parsedHeight)
  ) {
    return (
      <Image
        alt={alt}
        className={imageClassName}
        height={parsedHeight}
        sizes="(min-width: 1024px) 768px, 100vw"
        src={src}
        width={parsedWidth}
      />
    );
  }

  return <img alt={alt} className={imageClassName} height={height} src={src} width={width} {...props} />;
}

const baseComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "mt-2 text-4xl leading-tight font-(--font-display) text-(--color-omb-red) sm:text-5xl",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-12 text-3xl leading-snug font-(--font-display) text-(--color-omb-red) sm:text-4xl",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "mt-10 text-2xl leading-snug font-(--font-display) text-(--color-omb-night-black)",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "mt-5 text-base leading-8 text-(--color-omb-soft-ink)",
        className,
      )}
      {...props}
    />
  ),
  a: MdxLink,
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "mt-5 list-disc space-y-3 pl-6 text-base leading-8 text-(--color-omb-soft-ink) marker:text-(--color-omb-red)",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "mt-5 list-decimal space-y-3 pl-6 text-base leading-8 text-(--color-omb-soft-ink) marker:text-(--color-omb-red)",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => <li className={cn("pl-1", className)} {...props} />,
  strong: ({ className, ...props }) => (
    <strong className={cn("font-bold text-(--color-omb-night-black)", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-8 rounded-3xl border-l-4 border-(--color-omb-red) bg-(--color-omb-off-white) px-6 py-5 text-lg leading-8 text-(--color-omb-soft-ink) shadow-sm [&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-10 border-omb-warm-grey/50", className)} {...props} />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded-md bg-(--color-omb-off-white) px-1.5 py-0.5 font-mono text-[0.95em] text-(--color-omb-night-black)",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-8 overflow-x-auto rounded-3xl bg-(--color-omb-night-black) px-5 py-4 text-sm leading-7 text-(--color-omb-off-white) shadow-lg",
        className,
      )}
      {...props}
    />
  ),
  img: MdxImage,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...baseComponents,
    ...components,
  };
}
