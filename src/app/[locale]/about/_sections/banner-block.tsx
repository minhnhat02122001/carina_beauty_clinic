import { BannerImage } from "./banner-image";

// Sections 7a, 7b and 10 of the wireframe are the same block — optional heading,
// a couple of italic lines, one wide photo — so they share this component.
export function BannerBlock({
  heading,
  lines,
  imageUrl,
  mobileImageUrl,
  imageAlt,
  altBackground = false,
}: {
  heading?: string;
  lines: string[];
  imageUrl: string;
  mobileImageUrl: string;
  imageAlt: string;
  altBackground?: boolean;
}) {
  const text = (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      {heading && (
        <h2 className="text-center text-lg font-medium text-[var(--color-accent)] sm:text-xl md:text-2xl lg:text-4xl">
          {heading}
        </h2>
      )}
      {lines.map((line) => (
        <p key={line} className="text-center font-serif text-xs text-[rgba(99,43,14,0.7)] italic sm:text-sm lg:text-lg">
          {line}
        </p>
      ))}
    </div>
  );

  return (
    <section
      className={`${altBackground ? "bg-[var(--color-background-alt)]" : "bg-white"} px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12`}
    >
      {/* Per the wireframe: text stacked above one full-width banner, not a
          side-by-side photo/text split like the Luxury section. */}
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-5 sm:gap-6 lg:gap-8">
        {text}
        <BannerImage desktopSrc={imageUrl} mobileSrc={mobileImageUrl} alt={imageAlt} />
      </div>
    </section>
  );
}
