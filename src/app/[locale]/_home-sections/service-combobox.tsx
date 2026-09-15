"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { ServiceOption } from "@/sanity/lib/service";

// Lets Vietnamese visitors type without accents, e.g. "tre hoa" matches "trẻ hóa".
function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/đ/gi, "d").toLowerCase();
}

const tintedBorder = "border-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]";

export function ServiceCombobox({
  value,
  onChange,
  labelId,
  triggerClassName,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  labelId: string;
  triggerClassName: string;
}) {
  const t = useTranslations("RegistrationForm");
  const locale = useLocale();
  const listboxId = useId();
  const optionIdPrefix = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [options, setOptions] = useState<ServiceOption[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!isOpen || options !== null) return;
    let cancelled = false;
    fetch(`/api/services?locale=${locale}`)
      .then((response) => {
        if (!response.ok) throw new Error("request_failed");
        return response.json() as Promise<ServiceOption[]>;
      })
      .then((data) => {
        if (!cancelled) setOptions(data);
      })
      .catch(() => {
        if (!cancelled) {
          setLoadFailed(true);
          setOptions([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, options, locale]);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!options) return [];
    const needle = normalize(query.trim());
    if (!needle) return options;
    return options.filter((option) => normalize(`${option.label} ${option.value}`).includes(needle));
  }, [options, query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const labelFor = (optionValue: string) => options?.find((option) => option.value === optionValue)?.label ?? optionValue;

  function open() {
    setQuery("");
    setActiveIndex(0);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function toggle(optionValue: string) {
    onChange(value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      // Stops Enter from submitting the whole registration form.
      event.preventDefault();
      if (filtered[activeIndex]) toggle(filtered[activeIndex].value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative flex flex-col gap-2">
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={labelId}
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && !isOpen) {
              event.preventDefault();
              open();
            }
          }}
          className={`${triggerClassName} flex items-center text-left ${value.length ? "pr-16" : "pr-10"} ${
            isOpen ? "border-[var(--color-accent)]" : ""
          }`}
        >
          <span className={`min-w-0 flex-1 truncate ${value.length ? "" : "text-black/40"}`}>
            {value.length ? t("serviceSelectedCount", { count: value.length }) : t("servicePlaceholder")}
          </span>
        </button>

        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[var(--color-accent)]">
          <svg
            viewBox="0 0 12 8"
            fill="none"
            aria-hidden="true"
            className={`size-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            aria-label={t("serviceClearLabel")}
            className="absolute inset-y-0 right-9 flex items-center px-1 text-black/40 hover:text-[var(--color-accent)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {isOpen && (
          <div
            className={`absolute inset-x-0 top-full z-30 mt-2 flex flex-col overflow-hidden rounded-2xl border bg-white shadow-[0px_12px_32px_0px_rgba(99,43,14,0.14)] ${tintedBorder}`}
          >
            <div className="p-2">
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--color-muted)]"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="text"
                  role="combobox"
                  autoFocus
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={t("serviceSearchPlaceholder")}
                  aria-label={t("serviceSearchPlaceholder")}
                  aria-controls={listboxId}
                  aria-expanded
                  aria-autocomplete="list"
                  aria-activedescendant={filtered[activeIndex] ? `${optionIdPrefix}-${activeIndex}` : undefined}
                  className="w-full rounded-xl bg-[var(--color-background-alt)] py-2.5 pr-3 pl-9 text-base text-[var(--foreground)] placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] sm:text-sm"
                />
              </div>
            </div>

            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
              aria-labelledby={labelId}
              className="max-h-60 overflow-y-auto px-2 pb-2"
            >
              {options === null ? (
                <li className="px-3 py-3 text-sm text-[var(--color-muted)]">{t("serviceLoading")}</li>
              ) : filtered.length === 0 ? (
                <li className="px-3 py-3 text-sm text-[var(--color-muted)]">
                  {loadFailed ? t("serviceLoadError") : t("serviceNoResults")}
                </li>
              ) : (
                filtered.map((option, index) => {
                  const isSelected = value.includes(option.value);
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={option.value}
                      id={`${optionIdPrefix}-${index}`}
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      onPointerMove={() => setActiveIndex(index)}
                      onClick={() => toggle(option.value)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                        isActive ? "bg-[var(--color-background-alt)]" : ""
                      } ${isSelected ? "font-semibold text-[var(--color-accent)]" : "text-[var(--foreground)]"}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                          isSelected
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                            : "border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-white"
                        }`}
                      >
                        {isSelected && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">{option.label}</span>
                    </li>
                  );
                })
              )}
            </ul>

            <div className={`flex items-center justify-between gap-3 border-t bg-[var(--color-background-alt)] px-4 py-2.5 ${tintedBorder}`}>
              <span className="text-xs text-[var(--color-muted)]">
                {t("serviceSelectedCount", { count: value.length })}
              </span>
              <button
                type="button"
                onClick={close}
                className="rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-xs font-bold text-[var(--color-accent-foreground)] hover:opacity-90"
              >
                {t("serviceDone")}
              </button>
            </div>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((selected) => (
            <li
              key={selected}
              className={`flex max-w-full items-center gap-1 rounded-full border bg-[var(--color-background-alt)] py-1 pr-1 pl-3 text-xs font-medium text-[var(--color-accent)] ${tintedBorder}`}
            >
              <span className="truncate">{labelFor(selected)}</span>
              <button
                type="button"
                onClick={() => toggle(selected)}
                aria-label={t("serviceRemoveLabel", { service: labelFor(selected) })}
                className="flex size-5 shrink-0 items-center justify-center rounded-full hover:bg-[color-mix(in_srgb,var(--color-accent)_12%,transparent)]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" className="size-3">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
