import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { Carousel } from "@/components/carousel";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import type { PostCategory, PostDetail, PostSummary } from "@/sanity/lib/posts";
import { CATEGORY_ROUTES } from "./category-routes";
import { ShareButtons } from "./share-buttons";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-base leading-relaxed text-[var(--foreground)]">{children}</p>,
    h2: ({ children }) => (
      <h2 className="pt-2 text-xl font-semibold text-[var(--color-accent)] lg:text-2xl">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="pt-2 text-lg font-semibold text-[var(--color-accent)]">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[var(--color-border)] pl-4 text-[var(--foreground)] italic opacity-80">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;

      return (
        <span className="relative my-2 block aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={urlFor(value).width(1200).url()}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 768px, 100vw"
          />
        </span>
      );
    },
  },
};

export function PostDetailView({
  post,
  category,
  relatedPosts,
  recentPosts,
  shareLabel,
  copyLinkLabel,
  linkCopiedLabel,
  relatedPostsLabel,
  recentPostsLabel,
  scrollPrevLabel,
  scrollNextLabel,
}: {
  post: PostDetail;
  category: PostCategory;
  relatedPosts: PostSummary[];
  recentPosts: PostSummary[];
  shareLabel: string;
  copyLinkLabel: string;
  linkCopiedLabel: string;
  relatedPostsLabel: string;
  recentPostsLabel: string;
  scrollPrevLabel: string;
  scrollNextLabel: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-0 lg:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        <article className="flex flex-col gap-6 lg:col-span-2">
          {post.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={post.imageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 768px, 100vw"
                priority
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-xs text-[var(--color-muted)]">{post.date}</p>
            <h1 className="text-2xl font-semibold text-[var(--color-accent)] lg:text-4xl">{post.title}</h1>
            {post.excerpt && <p className="text-base text-[var(--foreground)] opacity-70">{post.excerpt}</p>}
          </div>

          <div className="bg-[var(--color-background-alt)] px-4 py-4">
            <ShareButtons
              title={post.title}
              label={shareLabel}
              copyLabel={copyLinkLabel}
              copiedLabel={linkCopiedLabel}
            />
          </div>

          <div className="flex flex-col gap-4">
            <PortableText value={post.body} components={components} />
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--color-background-alt)] px-3 py-1 text-xs text-[var(--color-muted)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {recentPosts.length > 0 && (
          <aside>
            <div className="flex flex-col gap-4 lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold text-[var(--color-accent)]">{recentPostsLabel}</h2>
              <div className="flex flex-col gap-4">
                {recentPosts.map((item) => (
                  <Link
                    key={item.id}
                    href={{ pathname: CATEGORY_ROUTES[item.category], params: { slug: item.slug } }}
                    className="group flex items-center gap-3"
                  >
                    <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--color-background-alt)] sm:w-28">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt=""
                          fill
                          className="object-cover transition group-hover:scale-105"
                          sizes="(min-width: 640px) 112px, 96px"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="line-clamp-2 text-sm font-semibold text-[var(--color-accent)]">{item.title}</p>
                      <p className="text-xs text-[var(--color-muted)]">{item.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {relatedPosts.length > 0 && (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-[var(--color-accent)] lg:text-2xl">{relatedPostsLabel}</h2>
          <Carousel prevLabel={scrollPrevLabel} nextLabel={scrollNextLabel} itemsPerView={{ base: 1, lg: 3 }}>
            {relatedPosts.map((item) => (
              <Link
                key={item.id}
                href={{ pathname: CATEGORY_ROUTES[category], params: { slug: item.slug } }}
                className="group flex flex-col gap-3"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[var(--color-background-alt)]">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(min-width: 1024px) 380px, 100vw"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-[var(--color-muted)]">{item.date}</p>
                  <h3 className="text-base font-bold text-[var(--color-accent)] lg:text-lg">{item.title}</h3>
                  {item.excerpt && (
                    <p className="line-clamp-2 text-sm text-[var(--foreground)] opacity-70">{item.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
}
