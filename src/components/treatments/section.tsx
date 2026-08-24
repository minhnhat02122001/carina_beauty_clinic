import type { ReactNode } from "react";

export function Section({
  title,
  children,
  variant = "bordered",
}: {
  title: string;
  children: ReactNode;
  variant?: "bordered" | "alt-a" | "alt-b";
}) {
  const variantClasses =
    variant === "bordered"
      ? "rounded-2xl border border-[var(--color-border)]"
      : `-mx-4 sm:mx-0 sm:rounded-2xl ${variant === "alt-a" ? "bg-[var(--color-background-alt)]" : "bg-white"}`;

  return (
    <section className={`flex flex-col gap-4 p-5 sm:p-6 lg:p-8 ${variantClasses}`}>
      <h2 className="text-xl font-semibold text-[var(--color-accent)] lg:text-2xl">{title}</h2>
      {children}
    </section>
  );
}
