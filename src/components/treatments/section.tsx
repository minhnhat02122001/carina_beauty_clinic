import type { ReactNode } from "react";

export function Section({
  title,
  children,
  variant = "bordered",
}: {
  title: string;
  children: ReactNode;
  variant?: "bordered" | "alt-a" | "alt-b" | "plain";
}) {
  const variantClasses = {
    bordered: "rounded-2xl border border-[var(--color-border)] p-5 sm:p-6 lg:p-8",
    "alt-a": "-mx-4 bg-[var(--color-background-alt)] p-5 sm:mx-0 sm:rounded-2xl sm:p-6 lg:p-8",
    "alt-b": "-mx-4 bg-white p-5 sm:mx-0 sm:rounded-2xl sm:p-6 lg:p-8",
    plain: "py-5 sm:py-6 lg:py-8",
  }[variant];

  return (
    <section className={`flex flex-col gap-4 ${variantClasses}`}>
      <h2 className="text-xl font-semibold text-[var(--color-accent)] lg:text-2xl">{title}</h2>
      {children}
    </section>
  );
}
