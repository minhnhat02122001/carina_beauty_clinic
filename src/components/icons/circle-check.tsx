"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

export interface CircleCheckIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CircleCheckIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  /** Keep redrawing the tick. Off when something else in the UI carries the ongoing motion. */
  loop?: boolean;
}

const CIRCLE_VARIANTS: Variants = {
  normal: { pathLength: 1, opacity: 1 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.5, ease: "easeOut", opacity: { duration: 0.1 } },
  },
};

// Repeat settings live on the variant itself: passing a transition to controls.start() would replace them.
const PATH_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: {
      duration: 0.3,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: {
      delay: 0.4,
      duration: 0.45,
      ease: "easeOut",
      repeat: Infinity,
      repeatDelay: 2.2,
      opacity: { duration: 0.1, delay: 0.4, repeat: Infinity, repeatDelay: 2.55 },
    },
  },
  animateOnce: {
    opacity: [0, 1],
    pathLength: [0, 1],
    transition: { delay: 0.4, duration: 0.55, ease: "easeOut", opacity: { duration: 0.1, delay: 0.4 } },
  },
};

const CircleCheckIcon = forwardRef<CircleCheckIconHandle, CircleCheckIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, loop = true, ...props }, ref) => {
    const tickVariant = loop ? "animate" : "animateOnce";
    const circleControls = useAnimation();
    const pathControls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => {
          circleControls.start("animate");
          pathControls.start(tickVariant);
        },
        stopAnimation: () => {
          circleControls.start("normal");
          pathControls.start("normal");
        },
      };
    });

    useEffect(() => {
      circleControls.start("animate");
      pathControls.start(tickVariant);
    }, [circleControls, pathControls, tickVariant]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          pathControls.start(tickVariant);
        }
      },
      [pathControls, onMouseEnter, tickVariant]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        }
      },
      [onMouseLeave]
    );

    return (
      <div
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            animate={circleControls}
            cx="12"
            cy="12"
            initial={{ pathLength: 0, opacity: 0 }}
            r="10"
            variants={CIRCLE_VARIANTS}
          />
          <motion.path
            animate={pathControls}
            d="m9 12 2 2 4-4"
            initial={{ pathLength: 0, opacity: 0 }}
            variants={PATH_VARIANTS}
          />
        </svg>
      </div>
    );
  }
);

CircleCheckIcon.displayName = "CircleCheckIcon";

export { CircleCheckIcon };
