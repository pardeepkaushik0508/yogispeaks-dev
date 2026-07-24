'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

type MotionSectionProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  once?: boolean;
  amount?: number;
  as?: 'div' | 'section' | 'ul' | 'li' | 'aside' | 'article';
  id?: string;
};

export function MotionReveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  once = true,
  amount = 0.2,
  as = 'div',
  id,
}: MotionSectionProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      id={id}
      className={className}
      variants={variants}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once, amount, margin: '-60px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
    >
      {children}
    </Component>
  );
}

export function MotionItem({
  children,
  className,
  variants = fadeUp,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: 'div' | 'li' | 'article';
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={variants}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {children}
    </Component>
  );
}
