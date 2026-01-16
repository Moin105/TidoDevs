'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OrganicParticles from './OrganicParticles';
import GradientText from './GradientText';
import RevealAnimation from './RevealAnimation';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark"
    >
      <OrganicParticles />
      
      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 text-center"
      >
        <RevealAnimation delay={0}>
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 100,
              duration: 1.2,
            }}
          >
            Building Decentralized Futures
            <br />
            <GradientText className="gradient-text">
              & Intelligent Web Solutions
            </GradientText>
          </motion.h1>
        </RevealAnimation>
        
        <RevealAnimation delay={0.2}>
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-16 max-w-5xl mx-auto leading-relaxed font-normal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 100,
              delay: 0.4,
              duration: 1.2,
            }}
          >
            Tidodevs delivers bespoke blockchain, AI, and full-stack web solutions. Incorporated with industry leaders to bring enterprise-grade technology to your business.
          </motion.p>
        </RevealAnimation>
        
        <RevealAnimation delay={0.4}>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 100,
              delay: 0.6,
              duration: 1.2,
            }}
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-to-r from-indigo via-violet to-blue text-white rounded-xl font-medium text-lg glow-indigo relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue via-indigo to-violet opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
              />
              <span className="relative z-10">View Our Work</span>
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, y: -2, borderColor: 'rgba(99, 102, 241, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 glass border border-white/20 text-white rounded-xl font-medium text-lg glass-hover"
            >
              Contact Us
            </motion.a>
          </motion.div>
        </RevealAnimation>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center cursor-pointer"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
