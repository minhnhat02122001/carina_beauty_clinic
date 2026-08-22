"use client";

import { Children, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const EDGE_TOLERANCE_PX = 2;
const AUTO_SCROLL_INTERVAL_MS = 3000;
const GAP_PX = 16;

function CarouselControl({
  direction,
  onClick,
  label,
  edgeOffset,
  backgroundClassName,
  borderClassName,
  iconColorClassName,
}: {
  direction: "left" | "right";
  onClick: () => void;
  label: string;
  edgeOffset: "inset" | "flush";
  backgroundClassName: string;
  borderClassName: string;
  iconColorClassName: string;
}) {
  const offsetClassName =
    edgeOffset === "flush"
      ? direction === "left"
        ? "-left-4"
        : "-right-4"
      : direction === "left"
        ? "left-2"
        : "right-2";
  const iconSrc = direction === "left" ? "/images/services/icon-chevron-left.svg" : "/images/services/icon-chevron-right.svg";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-[0px_2px_16px_0px_rgba(0,17,45,0.06),0px_2px_6px_0px_rgba(0,17,45,0.03)] backdrop-blur-[10px] lg:flex ${backgroundClassName} ${borderClassName} ${offsetClassName}`}
    >
      {/* Recolored via mask instead of next/image, since the source SVG has a
          single baked-in fill and iconColorClassName needs to override it. */}
      <span
        aria-hidden="true"
        className={`size-6 shrink-0 ${iconColorClassName}`}
        style={{
          maskImage: `url(${iconSrc})`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: `url(${iconSrc})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
        }}
      />
    </button>
  );
}

export function Carousel({
  children,
  prevLabel,
  nextLabel,
  edgeOffset = "inset",
  itemsPerView = 1,
  controlBackgroundClassName = "bg-white",
  controlBorderClassName = "border-[#eaeffa]",
  controlIconColorClassName = "bg-[var(--color-accent)]",
}: {
  children: ReactNode;
  prevLabel: string;
  nextLabel: string;
  /** "inset" (default) keeps controls within the carousel's own bounds — safe in any container.
   * "flush" pushes controls 16px outward, for use inside a box with matching 16px padding. */
  edgeOffset?: "inset" | "flush";
  /** How many items should evenly fill the row by default, before there are too many to fit and
   * the carousel starts scrolling. A number applies at every breakpoint; `{ base, lg }` lets the
   * default on small screens differ from the default at `lg` and up. */
  itemsPerView?: number | { base: number; lg: number };
  /** Tailwind background class for the prev/next control buttons. */
  controlBackgroundClassName?: string;
  /** Tailwind border class for the prev/next control buttons. */
  controlBorderClassName?: string;
  /** Tailwind background class for the chevron icon (it's mask-rendered, so its color comes from `background-color`). */
  controlIconColorClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const count = Children.count(children);

  const perView = typeof itemsPerView === "number" ? { base: itemsPerView, lg: itemsPerView } : itemsPerView;
  const itemMinWidth = (n: number) => `calc((100% - ${(n - 1) * GAP_PX}px) / ${n})`;
  const trackStyle = {
    "--carousel-item-min-base": itemMinWidth(perView.base),
    "--carousel-item-min-lg": itemMinWidth(perView.lg),
  } as CSSProperties;

  const goTo = useCallback((direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;
    const items = Array.from(track.children) as HTMLElement[];
    const maxScrollLeft = track.scrollWidth - track.clientWidth;

    if (direction === "right") {
      const atEnd = track.scrollLeft >= maxScrollLeft - EDGE_TOLERANCE_PX;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "auto" });
        return;
      }
      const nextItem = items.find((item) => item.offsetLeft > track.scrollLeft + EDGE_TOLERANCE_PX);
      track.scrollTo({
        left: Math.min(nextItem ? nextItem.offsetLeft : maxScrollLeft, maxScrollLeft),
        behavior: "smooth",
      });
    } else {
      const atStart = track.scrollLeft <= EDGE_TOLERANCE_PX;
      if (atStart) {
        track.scrollTo({ left: maxScrollLeft, behavior: "auto" });
        return;
      }
      const prevItem = [...items].reverse().find((item) => item.offsetLeft < track.scrollLeft - EDGE_TOLERANCE_PX);
      track.scrollTo({ left: prevItem ? prevItem.offsetLeft : 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function checkOverflow() {
      if (!track) return;
      setHasOverflow(track.scrollWidth > track.clientWidth + EDGE_TOLERANCE_PX);
    }

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(track);
    return () => observer.disconnect();
  }, [count]);

  const showControls = count > 1 && hasOverflow;

  useEffect(() => {
    if (!showControls || isPaused) return;
    const id = setInterval(() => goTo("right"), AUTO_SCROLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [showControls, isPaused, goTo]);

  return (
    <div
      className="relative w-full min-w-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={() => setIsPaused(true)}
      onPointerUp={() => setIsPaused(false)}
      onPointerCancel={() => setIsPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex w-full snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={trackStyle}
      >
        {Children.map(children, (child) => (
          <div className="w-[var(--carousel-item-min-base)] shrink-0 snap-start lg:w-[var(--carousel-item-min-lg)]">
            {child}
          </div>
        ))}
      </div>
      {showControls && (
        <>
          <CarouselControl
            direction="left"
            onClick={() => goTo("left")}
            label={prevLabel}
            edgeOffset={edgeOffset}
            backgroundClassName={controlBackgroundClassName}
            borderClassName={controlBorderClassName}
            iconColorClassName={controlIconColorClassName}
          />
          <CarouselControl
            direction="right"
            onClick={() => goTo("right")}
            label={nextLabel}
            edgeOffset={edgeOffset}
            backgroundClassName={controlBackgroundClassName}
            borderClassName={controlBorderClassName}
            iconColorClassName={controlIconColorClassName}
          />
        </>
      )}
    </div>
  );
}
