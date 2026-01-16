'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealAnimation from './RevealAnimation';
import ParticleRoad from './ParticleRoad';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const heroHeading = {
  step: '001',
  lead: 'Rapid',
  title: 'Iteration',
  description:
    'Agile sprints. Modern tech stack. Your MVP takes shape through continuous development cycles.',
};

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  return (
    <section
      ref={ref}
      id="services"
      className="py-32 min-h-[80vh] relative overflow-hidden"
    >
      <ParticleRoad />
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div style={{ opacity, y }}>
          <RevealAnimation>
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-right mb-6 tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                duration: 0.8,
              }}
            >
              Our Services
            </motion.h2>
          </RevealAnimation>
          
          <motion.div
            className="text-right pt-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              type: 'spring',
              damping: 22,
              stiffness: 180,
              delay: 0.1,
            }}
          >
            <div className="text-xs tracking-[0.4em] text-white/40 mb-4">{heroHeading.step}</div>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="block text-white/90 uppercase">{heroHeading.lead}</span>
              <span className="block text-blue-500 uppercase">{heroHeading.title}</span>
            </h3>
            <p className="text-gray-300 text-lg md:text-xl max-w-xl ml-auto mt-6">
              {heroHeading.description}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
