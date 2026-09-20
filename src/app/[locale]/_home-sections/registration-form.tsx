"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { SendIcon } from "@/components/icons/send";
import { ServiceCombobox } from "./service-combobox";
import { ScheduleDateField, displayDateToIso, todayIsoDate } from "./schedule-date-field";
import { SuccessDialog } from "./success-dialog";

const CONTACT_ITEMS = [
  { icon: "/images/registration/icon-address.svg", labelKey: "addressLabel", valueKey: "addressValue" },
  { icon: "/images/registration/icon-phone.svg", labelKey: "phoneLabel", valueKey: "phoneValue" },
  { icon: "/images/registration/icon-email.svg", labelKey: "emailLabel", valueKey: "emailValue" },
  { icon: "/images/registration/icon-hours.svg", labelKey: "hoursLabel", valueKey: "hoursValue" },
] as const;

const inputClasses =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-black/40 focus:border-[var(--color-accent)] focus:outline-none";

const errorInputClasses = "border-[var(--color-error)] focus:border-[var(--color-error)]";

type SubmitStatus = "idle" | "submitting" | "success" | "error";
type FieldName = "name" | "phone" | "email" | "scheduleDate";
type FieldErrors = Partial<
  Record<
    FieldName,
    "nameRequired" | "phoneRequired" | "phoneInvalid" | "emailInvalid" | "scheduleDateInvalid" | "scheduleDatePast"
  >
>;

const FIELD_ORDER: FieldName[] = ["name", "phone", "email", "scheduleDate"];

function validate(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(data.get("name") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const scheduleDateText = String(data.get("scheduleDate") ?? "").trim();

  if (scheduleDateText) {
    const scheduleDate = displayDateToIso(scheduleDateText);
    if (!scheduleDate) errors.scheduleDate = "scheduleDateInvalid";
    // Same-format YYYY-MM-DD strings compare correctly as plain strings.
    else if (scheduleDate < todayIsoDate()) errors.scheduleDate = "scheduleDatePast";
  }

  if (!name) errors.name = "nameRequired";

  const phoneDigits = phone.replace(/[\s.\-()+]/g, "");
  if (!phone) errors.phone = "phoneRequired";
  else if (!/^\d{8,15}$/.test(phoneDigits)) errors.phone = "phoneInvalid";

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "emailInvalid";

  return errors;
}

export function RegistrationForm() {
  const t = useTranslations("RegistrationForm");
  const locale = useLocale();
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [services, setServices] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const serviceLabelId = useId();
  const fieldIdPrefix = useId();
  const fieldId = (field: FieldName) => `${fieldIdPrefix}-${field}`;
  const errorId = (field: FieldName) => `${fieldIdPrefix}-${field}-error`;
  const mountedAtRef = useRef(0);

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  function clearError(field: FieldName) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function fieldProps(field: FieldName) {
    const hasError = Boolean(errors[field]);
    return {
      id: fieldId(field),
      name: field,
      "aria-invalid": hasError,
      "aria-describedby": hasError ? errorId(field) : undefined,
      onChange: () => clearError(field),
      className: `${inputClasses} ${hasError ? errorInputClasses : ""}`,
    };
  }

  function fieldError(field: FieldName) {
    const error = errors[field];
    return error ? (
      <p id={errorId(field)} className="text-xs font-medium text-[var(--color-error)]">
        {t(error)}
      </p>
    ) : null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const validationErrors = validate(data);
    setErrors(validationErrors);
    const firstInvalid = FIELD_ORDER.find((field) => validationErrors[field]);
    if (firstInvalid) {
      const input = document.getElementById(fieldId(firstInvalid));
      input?.scrollIntoView({ behavior: "smooth", block: "center" });
      input?.focus({ preventScroll: true });
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          services,
          email: data.get("email") || undefined,
          note: data.get("note") || undefined,
          scheduleDate: displayDateToIso(String(data.get("scheduleDate") ?? "")) ?? undefined,
          locale,
          hp_field: data.get("hp_field") || undefined,
          elapsed_ms: Date.now() - mountedAtRef.current,
        }),
      });
      if (!response.ok) throw new Error("request_failed");
      form.reset();
      setServices([]);
      setErrors({});
      setStatus("success");
      mountedAtRef.current = Date.now();
    } catch {
      setStatus("error");
    }
  }

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
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-sm font-semibold text-[var(--color-accent)] lg:text-base">{t(item.labelKey)}</p>
                  <p className="text-sm break-words text-[rgba(99,43,14,0.7)]">{t(item.valueKey)}</p>
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
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4 rounded-3xl border border-[var(--color-accent)] bg-[var(--color-background-alt)] p-5 shadow-lg lg:p-8"
          >
            <input
              type="text"
              // Must stay `hidden` (not rendered), not just visually hidden: browser autofill and autofill
              // extensions fill invisible-but-rendered inputs regardless of name, which dropped real leads.
              name="hp_field"
              hidden
              tabIndex={-1}
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor={fieldId("name")} className="text-sm font-semibold text-[var(--color-accent)]">
                  {t("nameLabel")}
                </label>
                <input type="text" autoComplete="name" required placeholder={t("namePlaceholder")} {...fieldProps("name")} />
                {fieldError("name")}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor={fieldId("phone")} className="text-sm font-semibold text-[var(--color-accent)]">
                  {t("phoneFieldLabel")}
                </label>
                <input type="tel" autoComplete="tel" required placeholder={t("phoneFieldPlaceholder")} {...fieldProps("phone")} />
                {fieldError("phone")}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span id={serviceLabelId} className="text-sm font-semibold text-[var(--color-accent)]">
                {t("serviceLabel")}
              </span>
              <ServiceCombobox
                value={services}
                onChange={setServices}
                labelId={serviceLabelId}
                triggerClassName={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor={fieldId("email")} className="text-sm font-semibold text-[var(--color-accent)]">
                  {t("emailFieldLabel")}
                </label>
                <input type="email" autoComplete="email" placeholder={t("emailFieldPlaceholder")} {...fieldProps("email")} />
                {fieldError("email")}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor={fieldId("scheduleDate")} className="text-sm font-semibold text-[var(--color-accent)]">
                  {t("scheduleDateLabel")}
                </label>
                <ScheduleDateField
                  {...fieldProps("scheduleDate")}
                  placeholder={t("scheduleDatePlaceholder")}
                  pickerLabel={t("scheduleDatePickerLabel")}
                />
                {fieldError("scheduleDate")}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[var(--color-accent)]">{t("noteLabel")}</label>
              <textarea rows={3} name="note" placeholder={t("notePlaceholder")} className={`${inputClasses} resize-none`} />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-2 flex items-center justify-center gap-2 rounded-full border-2 border-transparent bg-[var(--color-accent)] px-4 py-3 text-sm font-bold tracking-[0.16px] text-white transition-colors hover:border-[var(--color-accent)] hover:bg-transparent hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[var(--color-accent)] disabled:hover:text-white"
            >
              {status === "submitting" ? t("submittingCta") : t("submitCta")}
              <SendIcon size={20} className="size-5" />
            </button>

            {status === "error" && (
              <p className="text-center text-sm font-semibold text-[var(--color-error)]">{t("errorMessage")}</p>
            )}

            <p className="pt-2 text-center text-[11px] text-[rgba(99,43,14,0.6)]">{t("disclaimer")}</p>
          </form>
          <SuccessDialog
            open={status === "success"}
            onClose={() => setStatus("idle")}
            title={t("successTitle")}
            message={t("successMessage")}
            closeLabel={t("successClose")}
          />
        </div>
      </div>
    </section>
  );
}
