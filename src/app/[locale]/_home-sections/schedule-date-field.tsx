"use client";

import { useRef, type InputHTMLAttributes } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** Local calendar date as YYYY-MM-DD; toISOString() would use UTC and could be yesterday in Vietnam. */
export function todayIsoDate() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** "dd/mm/yyyy" → "yyyy-mm-dd", or null when incomplete or not a real calendar date (e.g. 31/02/2027). */
export function displayDateToIso(text: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!match) return null;
  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return `${year}-${pad(month)}-${pad(day)}`;
}

function isoToDisplayDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function maskDigits(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/");
}

export function ScheduleDateField({
  pickerLabel,
  className,
  onChange,
  ...inputProps
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  pickerLabel: string;
  className: string;
  onChange: () => void;
}) {
  const textRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    const picker = pickerRef.current;
    if (!picker) return;
    picker.min = todayIsoDate();
    picker.value = displayDateToIso(textRef.current?.value ?? "") ?? "";
    try {
      picker.showPicker();
    } catch {
      // Older browsers without showPicker(): the transparent date input under the tap opens natively.
    }
  }

  return (
    <div className="relative">
      <input
        ref={textRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={10}
        {...inputProps}
        onInput={(event) => {
          event.currentTarget.value = maskDigits(event.currentTarget.value);
          onChange();
        }}
        className={`${className} pr-12`}
      />
      <span className="absolute inset-y-0 right-1 flex items-center">
        <span className="relative flex size-10 items-center justify-center rounded-lg text-[var(--color-accent)] hover:bg-[var(--color-background-alt)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-5"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {/* No `name`, so it never reaches FormData; it only exists to open the device's native date picker. */}
          <input
            ref={pickerRef}
            type="date"
            tabIndex={-1}
            aria-label={pickerLabel}
            onClick={openPicker}
            onChange={(event) => {
              if (!event.currentTarget.value || !textRef.current) return;
              textRef.current.value = isoToDisplayDate(event.currentTarget.value);
              onChange();
            }}
            className="absolute inset-0 size-full cursor-pointer opacity-0 [color-scheme:light]"
          />
        </span>
      </span>
    </div>
  );
}
