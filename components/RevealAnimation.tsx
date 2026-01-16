'use client';

import { motion } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { useInView } from 'framer-motion';

interface RevealAnimationProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export default function RevealAnimation({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: RevealAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const directions = {
    up: { y: 60, opacity: 0 },
    down: { y: -60, opacity: 0 },
    left: { x: 60, opacity: 0 },
    right: { x: -60, opacity: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={directions[direction]}
      animate={isInView ? { x: 0, y: 0, opacity: 1 } : directions[direction]}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 200,
        delay,
        duration: 0.8,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
