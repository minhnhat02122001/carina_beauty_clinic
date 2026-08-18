import Image from "next/image";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import type { PostSummary } from "@/sanity/lib/posts";

type LinkHref = ComponentProps<typeof Link>["href"];

export function PostList({
  posts,
  emptyLabel,
  getHref,
}: {
  posts: PostSummary[];
  emptyLabel: string;
  getHref: (slug: string) => LinkHref;
}) {
  if (posts.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--color-muted)]">{emptyLabel}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post.id} href={getHref(post.slug)} className="group flex flex-col gap-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[var(--color-background-alt)]">
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt=""
                fill
                className="object-cover transition group-hover:scale-105"
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-[var(--color-muted)]">{post.date}</p>
            <h2 className="text-base font-bold text-[var(--color-accent)] lg:text-lg">{post.title}</h2>
            {post.excerpt && (
              <p className="line-clamp-2 text-sm text-[var(--foreground)] opacity-70">{post.excerpt}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
