import Image from "next/image";
import { useTranslations } from "next-intl";

const CONTACT_ITEMS = [
  { icon: "/images/registration/icon-address.svg", labelKey: "addressLabel", valueKey: "addressValue" },
  { icon: "/images/registration/icon-phone.svg", labelKey: "phoneLabel", valueKey: "phoneValue" },
  { icon: "/images/registration/icon-email.svg", labelKey: "emailLabel", valueKey: "emailValue" },
  { icon: "/images/registration/icon-hours.svg", labelKey: "hoursLabel", valueKey: "hoursValue" },
] as const;

const inputClasses =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-black/40 focus:border-[var(--color-accent)] focus:outline-none";

export function RegistrationForm() {
  const t = useTranslations("RegistrationForm");

  return (
    <section id="registration-form" className="scroll-mt-20 bg-white px-4 py-8 sm:px-6 md:px-10 lg:px-28 lg:py-12">
      <div className="mx-auto flex max-w-[1216px] flex-col items-center gap-4 pb-6 text-center lg:gap-2 lg:pb-8">
        <p className="font-serif text-xs tracking-[2.4px] text-[var(--color-accent)] uppercase">{t("eyebrow")}</p>
        <h2 className="text-2xl font-medium text-[var(--color-accent)] lg:text-5xl">{t("heading")}</h2>
        <p className="text-sm text-[rgba(99,43,14,0.7)] lg:text-base">{t("description")}</p>
      </div>

      <div className="mx-auto flex max-w-[1216px] flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="order-2 flex flex-1 flex-col gap-6 lg:order-1">
          <h3 className="text-xl font-bold text-[var(--color-accent)] lg:text-[30px]">{t("companyName")}</h3>

          <div className="flex flex-col gap-6">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.labelKey} className="flex items-center gap-4">
                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]">
                  <span className="relative size-6">
                    <Image src={item.icon} alt="" fill className="object-contain" sizes="24px" />
                  </span>
                </span>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-[var(--color-accent)] lg:text-base">{t(item.labelKey)}</p>
                  <p className="text-sm text-[rgba(99,43,14,0.7)]">{t(item.valueKey)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[182px] overflow-hidden rounded-2xl lg:h-[338px]">
            <iframe
              src="https://www.google.com/maps?q=Carina+Beauty+Clinic%2C+09+%C4%90%C6%B0%E1%BB%9Dng+B4%2C+An+Kh%C3%A1nh%2C+Thu+Duc%2C+Ho+Chi+Minh+City%2C+Vietnam&output=embed"
              title={t("mapTitle")}
              loading="lazy"
              className="size-full border-0"
            />
          </div>
        </div>

        <div className="order-1 flex-1 lg:order-2">
          <form className="flex flex-col gap-4 rounded-3xl border border-[var(--color-accent)] bg-[var(--color-background-alt)] p-5 shadow-lg lg:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--color-accent)]">{t("nameLabel")}</label>
                <input type="text" placeholder={t("namePlaceholder")} className={inputClasses} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--color-accent)]">{t("phoneFieldLabel")}</label>
                <input type="tel" placeholder={t("phoneFieldPlaceholder")} className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--color-accent)]">{t("serviceLabel")}</label>
                <input type="text" placeholder={t("servicePlaceholder")} className={inputClasses} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[var(--color-accent)]">{t("emailFieldLabel")}</label>
                <input type="email" placeholder={t("emailFieldPlaceholder")} className={inputClasses} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--color-accent)]">{t("noteLabel")}</label>
              <textarea rows={3} placeholder={t("notePlaceholder")} className={`${inputClasses} resize-none`} />
            </div>

            <button
              type="button"
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-3 text-sm font-bold tracking-[0.16px] text-white hover:opacity-90"
            >
              {t("submitCta")}
              <span className="relative size-5">
                <Image src="/images/registration/icon-send.svg" alt="" fill className="object-contain" sizes="20px" />
              </span>
            </button>

            <p className="pt-2 text-center text-[11px] text-[rgba(99,43,14,0.6)]">{t("disclaimer")}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
