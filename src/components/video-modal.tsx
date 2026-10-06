"use client";

import { useEffect } from "react";
import { useScrollLock } from "@/lib/use-scroll-lock";

export function VideoModal({
  videoId,
  title,
  closeLabel,
  onClose,
}: {
  videoId: string;
  title: string;
  closeLabel: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useScrollLock();

  const embedId = videoId.split("?")[0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="relative flex w-auto max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute -top-10 right-0 flex size-8 items-center justify-center text-white hover:opacity-80"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-6">
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div
          className="relative overflow-hidden rounded-xl bg-black"
          style={{
            height: "min(70dvh, 700px)",
            width: "min(90vw, calc(min(70dvh, 700px) * 9 / 16))",
          }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        </div>
      </div>
    </div>
  );
}
