"use client";

import { useEffect } from "react";

/**
 * Freezes the page behind a full-screen overlay. Pass nothing from a component that only renders
 * while its overlay is open, or `useScrollLock(open)` from one that stays mounted.
 *
 * Two details every caller used to get wrong on its own:
 *
 * - `overflow: hidden` alone doesn't block touch-driven scroll on iOS Safari, so the body is pinned
 *   with `position: fixed` and restored to its scroll offset on release.
 * - A pinned body no longer overflows, so a classic scrollbar disappears and the viewport widens by
 *   its width — which slides the centred layout sideways the moment the overlay opens. The gutter is
 *   measured before pinning and padded back. It is 0 where scrollbars overlay the content
 *   (macOS, iOS), so nothing is added there.
 *
 * Only the open/closed boundary may drive this. A caller that re-runs it on anything else — the
 * index of the image being viewed, say — unpins and re-pins the page mid-interaction, which reads
 * as a jump.
 */
export function useScrollLock(locked = true) {
  useEffect(() => {
    if (!locked) return;

    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const scrollY = window.scrollY;
    const { style } = document.body;

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    if (gutter > 0) style.paddingRight = `${gutter}px`;

    return () => {
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.paddingRight = "";
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
