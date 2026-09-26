"use client";

import { ElementType, Fragment } from "react";
import { motion, Transition, useReducedMotion, Variants } from "motion/react";

import { cn } from "@/lib/utils";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The content to be displayed and animated
   */
  children: React.ReactNode;

  /**
   * HTML Tag to render the component as
   */
  as?: ElementType;

  /**
   * Initial font variation settings
   */
  fromFontVariationSettings: string;

  /**
   * Target font variation settings to animate to
   */
  toFontVariationSettings: string;

  /**
   * Animation transition configuration
   * @default { duration: 1.5, ease: "easeInOut" }
   */
  transition?: Transition;

  /**
   * Duration of stagger delay between elements in seconds
   * @default 0.1
   */
  staggerDuration?: number;

  /**
   * Direction to stagger animations from
   * @default "first"
   */
  staggerFrom?: "first" | "last" | "center" | number;

  /**
   * Delay between animation repeats in seconds
   * @default 0.1
   */
  repeatDelay?: number;
}

const BreathingText = ({
  children,
  as = "span",
  fromFontVariationSettings,
  toFontVariationSettings,
  transition = {
    duration: 1.5,
    ease: "easeInOut",
  },
  staggerDuration = 0.1,
  staggerFrom = "first",
  repeatDelay = 0.1,
  className,
  ...props
}: TextProps) => {
  const shouldReduceMotion = useReducedMotion();

  const letterVariants: Variants = {
    initial: { fontVariationSettings: fromFontVariationSettings },
    animate: (i) => ({
      fontVariationSettings: toFontVariationSettings,
      transition: {
        ...transition,
        repeat: Infinity,
        repeatType: "mirror",
        delay: i * staggerDuration,
        repeatDelay: repeatDelay,
      },
    }),
  };

  const getCustomIndex = (index: number, total: number) => {
    if (typeof staggerFrom === "number") {
      return Math.abs(index - staggerFrom);
    }
    switch (staggerFrom) {
      case "first":
        return index;
      case "last":
        return total - 1 - index;
      case "center":
      default:
        return Math.abs(index - Math.floor(total / 2));
    }
  };

  const ElementTag = as;

  // The animation loops forever, which WCAG 2.2.2 treats as moving content, so
  // opt out entirely rather than shipping something a reader cannot stop.
  if (shouldReduceMotion) {
    return (
      <ElementTag className={className} {...props}>
        {children}
      </ElementTag>
    );
  }

  // Grouped per word, not per character: each letter is an inline-block, which
  // opens a line-break opportunity beside it, so splitting the whole string at
  // once lets a long heading break in the middle of a word.
  const words = String(children).split(" ");
  const totalLetters = words.join("").length;
  // Character index each word starts at, so the stagger still sweeps across the
  // whole string instead of restarting inside every word.
  const wordStarts = words.map((_, i) => words.slice(0, i).reduce((sum, word) => sum + word.length, 0));

  return (
    <ElementTag
      className={cn(
        className,
        // an after pseudo element is used to create a container large enough to hold the text with full weight. Helps avoid layout shifts
        "after:pointer-none relative after:invisible after:absolute after:h-0 after:overflow-hidden after:font-black after:content-[attr(data-text)] after:select-none",
      )}
      {...props}
      data-text={children}
    >
      {words.map((word, wordIndex) => {
        const start = wordStarts[wordIndex];

        return (
          <Fragment key={wordIndex}>
            <span className="inline-block whitespace-nowrap" aria-hidden="true">
              {word.split("").map((letter: string, i: number) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  custom={getCustomIndex(start + i, totalLetters)}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
            {wordIndex < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
      <span className="sr-only">{children}</span>
    </ElementTag>
  );
};

export default BreathingText;
