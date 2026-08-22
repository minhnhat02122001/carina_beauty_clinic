import Image from "next/image";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { groupTreatmentsBySubgroup, type TreatmentSummary } from "@/sanity/lib/service";

type LinkHref = ComponentProps<typeof Link>["href"];

export function TreatmentList({
  treatments,
  emptyLabel,
  getHref,
}: {
  treatments: TreatmentSummary[];
  emptyLabel: string;
  getHref: (slug: string) => LinkHref;
}) {
  if (treatments.length === 0) {
    return <p className="py-16 text-center text-sm text-[var(--color-muted)]">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-10">
      {groupTreatmentsBySubgroup(treatments).map((group) => (
        <div key={group.subgroup ?? "_"} className="flex flex-col gap-4">
          {group.subgroup && (
            <h2 className="text-lg font-semibold text-[var(--color-accent)] lg:text-xl">{group.subgroup}</h2>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {group.items.map((item) => (
              <Link key={item.id} href={getHref(item.slug)} className="group flex flex-col gap-2">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[var(--color-background-alt)]">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(min-width: 1024px) 220px, 45vw"
                    />
                  )}
                </div>
                <p className="text-sm font-bold text-[var(--color-accent)] lg:text-base">{item.name}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
