"use client";

import { HTMLMotionProps, motion, useReducedMotion } from "framer-motion";
import { PropsWithChildren } from "react";

export function Reveal({ children, className = "", delay = 0 }: PropsWithChildren<{ className?: string; delay?: number }>) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? undefined : { opacity: [0.72, 1], y: [16, 0] }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const reduced = useReducedMotion();
  return <motion.article className={className} whileHover={reduced ? undefined : { y: -5 }} transition={{ duration: 0.24 }}>{children}</motion.article>;
}

export function RippleButton({ children, className = "", ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button whileTap={{ scale: 0.975 }} className={`ripple ${className}`} {...props}>
      {children}
    </motion.button>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}
