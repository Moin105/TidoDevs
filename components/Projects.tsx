'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from './ProjectCard';
import RevealAnimation from './RevealAnimation';
import StaggerContainer from './StaggerContainer';
import ProjectsParticleBackground from './ProjectsParticleBackground';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const projects = [
  {
    title: 'SmartWhales AI',
    description: 'AI-driven crypto copy-trading platform supporting 12+ blockchains.',
    category: 'Blockchain / AI / Fintech',
    tags: ['Web3', 'AI Agents', 'Blockchain', 'Fintech'],
    link: 'https://smartwhales-lac.vercel.app/',
    image: '/images/smartwhales.jpg', // Replace with actual image
  },
  {
    title: 'PickleButt.io',
    description: 'NFT Minting & Gaming Ecosystem with pixelated aesthetics.',
    category: 'NFT / Web3 / Gaming',
    tags: ['NFT Minting', 'Tokenization', 'GameFi', 'Smart Contracts'],
    image: '/images/picklebutt.jpg', // Replace with actual image
  },
  {
    title: 'Enterprise Labs',
    description: 'Open Source & Production grade architectures.',
    category: 'Open Source & Production',
    tags: ['Open Source', 'Production', 'Full-Stack', 'Scalable'],
    github: 'https://github.com/moin105',
    image: '/images/enterprise.jpg', // Replace with actual image
  },
  {
    title: 'AI Module Integration',
    description: 'Integrated AI modules into an existing MERN app with budget-optimized delivery.',
    category: 'Upwork / MERN',
    tags: ['AI Integration', 'MERN', 'Optimization', 'Delivery'],
  },
  {
    title: 'Landing Page',
    description: 'Responsive landing page optimized for all devices and fast performance.',
    category: 'Upwork / Frontend',
    tags: ['Responsive', 'UI', 'Performance', 'SEO'],
  },
  {
    title: 'Web Page Amendments',
    description: 'Additional pages and enhancements with creative UI improvements.',
    category: 'Upwork / Web',
    tags: ['Enhancements', 'UI/UX', 'Delivery', 'Iteration'],
  },
  {
    title: 'Crypto Project Landing',
    description: 'Professional crypto landing page built from scratch with strong branding.',
    category: 'Upwork / Crypto',
    tags: ['Landing Page', 'Branding', 'Web3', 'Design'],
  },
  {
    title: 'NestJS Encoding Fix',
    description: 'Resolved Arabic encoding issue quickly and reliably in NestJS.',
    category: 'Upwork / Backend',
    tags: ['NestJS', 'Encoding', 'Bug Fix', 'Backend'],
  },
  {
    title: 'Firebase Realtime Help',
    description: 'Solved realtime database issues and performance blockers fast.',
    category: 'Upwork / Firebase',
    tags: ['Firebase', 'Debugging', 'Realtime', 'Support'],
  },
  {
    title: 'HTML Frontend Build',
    description: 'Delivered a polished frontend rapidly with clean UI.',
    category: 'Upwork / Frontend',
    tags: ['HTML', 'CSS', 'UI', 'Fast Delivery'],
  },
  {
    title: 'Frogger Mini-Game',
    description: 'Built a beta arcade game with leaderboard integration.',
    category: 'Upwork / Game',
    tags: ['Game Dev', 'Leaderboard', 'Canvas', 'Backend'],
  },
];

export default function Projects() {
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
      id="projects"
      className="py-32 relative overflow-hidden"
    >
      <ProjectsParticleBackground />
      <div className="relative z-10 max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div style={{ opacity, y }}>
          <RevealAnimation>
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-6 tracking-tight"
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
              Featured Projects
            </motion.h2>
          </RevealAnimation>
          
          <RevealAnimation delay={0.1}>
            <motion.p
              className="text-center text-gray-400 mb-20 text-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                delay: 0.2,
                duration: 0.8,
              }}
            >
              Showcasing our latest innovations in blockchain and web development
            </motion.p>
          </RevealAnimation>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.2}>
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 200,
                  delay: index * 0.2,
                }}
                whileHover={{ y: -12, rotateX: 2, rotateY: 2 }}
                className={index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </StaggerContainer>
        </motion.div>
      </div>
    </section>
  );
}
