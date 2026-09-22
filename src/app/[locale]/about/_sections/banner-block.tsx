import Image from "next/image";

// Sections 7a, 7b and 10 of the wireframe are the same block — optional heading,
// a couple of italic lines, one wide photo — so they share this component.
export function BannerBlock({
  heading,
  lines,
  imageUrl,
  imageAlt,
  textPosition = "above",
  altBackground = false,
}: {
  heading?: string;
  lines: string[];
  imageUrl: string | null;
  imageAlt: string;
  textPosition?: "above" | "below";
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
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-5 sm:gap-6 lg:gap-8">
        {textPosition === "above" && text}
        {imageUrl && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:aspect-[16/9] lg:aspect-[1216/540]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1216px) 1216px, 100vw"
            />
          </div>
        )}
        {textPosition === "below" && text}
      </div>
    </section>
  );
}
