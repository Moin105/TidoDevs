'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealAnimation from './RevealAnimation';
import PartnerCubeParticles from './PartnerCubeParticles';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Partner {
  name: string;
  description: string;
  logo?: string;
}

const partners: Partner[] = [
  {
    name: 'BCD Apps',
    description: 'A world-class bespoke software development company building invulnerable software for global businesses.',
  },
  {
    name: 'Techbookers SMC-PVT LTD',
    description: 'Premier technology consulting firm specializing in Finance, Hospitality, and Travel sectors.',
  },
  {
    name: 'Codivo Technologies',
    description: 'Delivering next-gen web and mobile solutions with a focus on scalable architecture.',
  },
];

const cubePatterns = [
  {
    gradient: 'from-indigo-500/15 via-violet-500/10 to-blue-500/10',
    cubes: [
      { x: '12%', y: '18%', size: 8, opacity: 0.45 },
      { x: '26%', y: '32%', size: 6, opacity: 0.35 },
      { x: '68%', y: '22%', size: 10, opacity: 0.4 },
      { x: '78%', y: '44%', size: 6, opacity: 0.3 },
      { x: '18%', y: '68%', size: 7, opacity: 0.28 },
      { x: '52%', y: '70%', size: 9, opacity: 0.35 },
    ],
  },
  {
    gradient: 'from-emerald-500/15 via-cyan-500/10 to-blue-500/10',
    cubes: [
      { x: '16%', y: '20%', size: 7, opacity: 0.4 },
      { x: '34%', y: '46%', size: 9, opacity: 0.35 },
      { x: '62%', y: '18%', size: 6, opacity: 0.3 },
      { x: '74%', y: '52%', size: 10, opacity: 0.38 },
      { x: '28%', y: '74%', size: 6, opacity: 0.28 },
      { x: '58%', y: '68%', size: 8, opacity: 0.32 },
    ],
  },
  {
    gradient: 'from-fuchsia-500/15 via-purple-500/10 to-indigo-500/10',
    cubes: [
      { x: '20%', y: '24%', size: 9, opacity: 0.4 },
      { x: '40%', y: '34%', size: 6, opacity: 0.3 },
      { x: '66%', y: '30%', size: 8, opacity: 0.36 },
      { x: '74%', y: '58%', size: 7, opacity: 0.3 },
      { x: '24%', y: '68%', size: 10, opacity: 0.38 },
      { x: '50%', y: '78%', size: 6, opacity: 0.28 },
    ],
  },
];

export default function Partners() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const focusContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  // Auto-cycle through partners
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % partners.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // GSAP animation for focus container entrance
  useEffect(() => {
    if (focusContainerRef.current) {
      gsap.fromTo(
        focusContainerRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: focusContainerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const handleCardInteraction = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const activePartner = partners[activeIndex];

  return (
    <section
      ref={ref}
      id="partners"
      className="py-32 bg-dark relative overflow-hidden min-h-screen flex items-center"
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 w-full">
        <motion.div style={{ opacity, y }} className="w-full">
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
              Strategic Partners & Incorporations
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
              Trusted partnerships that drive innovation
            </motion.p>
          </RevealAnimation>

          {/* Main Focus Container */}
          <div className="mb-16">
            <motion.div
              ref={focusContainerRef}
              className="glass glass-hover rounded-3xl p-12 lg:p-16 relative overflow-hidden"
              style={{
                minHeight: '400px',
              }}
            >
              {/* Animated background glow */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)',
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Soft border glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={{
                  boxShadow: [
                    '0 0 60px rgba(99, 102, 241, 0.2), inset 0 0 60px rgba(99, 102, 241, 0.05)',
                    '0 0 80px rgba(139, 92, 246, 0.3), inset 0 0 80px rgba(139, 92, 246, 0.08)',
                    '0 0 60px rgba(99, 102, 241, 0.2), inset 0 0 60px rgba(99, 102, 241, 0.05)',
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1], // Custom easing
                  }}
                  className="relative z-10"
                >
                  {/* Logo/Icon Area */}
                  <motion.div
                    className="mb-8 flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.6,
                      ease: [0.34, 1.56, 0.64, 1], // Custom back-out easing
                    }}
                  >
                    <div className="w-32 h-32 rounded-2xl glass border border-indigo/30 flex items-center justify-center relative overflow-hidden group">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-indigo/20 via-violet/20 to-blue/20"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                      <span className="text-6xl font-bold gradient-text relative z-10">
                        {activePartner.name.charAt(0)}
                      </span>
                    </div>
                  </motion.div>

                  {/* Company Name */}
                  <motion.h3
                    className="text-4xl lg:text-5xl font-bold text-white mb-6 text-center tracking-tight"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.3,
                      duration: 0.6,
                      ease: [0.4, 0, 0.2, 1], // Custom power3.out equivalent
                    }}
                  >
                    {activePartner.name}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    className="text-xl lg:text-2xl text-gray-300 leading-relaxed text-center max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4,
                      duration: 0.6,
                      ease: [0.4, 0, 0.2, 1], // Custom power3.out equivalent
                    }}
                  >
                    {activePartner.description}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Partner Cards Grid - Orbit Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {partners.map((partner, index) => {
              const isActive = index === activeIndex;
              const pattern = cubePatterns[index % cubePatterns.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 200,
                    delay: index * 0.15,
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  onMouseEnter={() => handleCardInteraction(index)}
                  onTap={() => handleCardInteraction(index)}
                  whileHover={{ 
                    y: -8, 
                    scale: isActive ? 1.05 : 1.05,
                    zIndex: 10,
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0.5,
                    scale: isActive ? 1.05 : 1,
                    y: isActive ? -8 : 0,
                  }}
                  className="glass glass-hover rounded-2xl p-8 cursor-pointer relative overflow-hidden group"
                >
                  <PartnerCubeParticles variant={index} />
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl" />
                  {/* Active indicator glow */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        boxShadow: '0 0 40px rgba(99, 102, 241, 0.4), inset 0 0 40px rgba(99, 102, 246, 0.1)',
                      }}
                    />
                  )}

                  {/* Logo placeholder */}
                  <motion.div
                    className="mb-6 h-20 flex items-center justify-center"
                    animate={{
                      scale: isActive ? 1.15 : 1,
                    }}
                    transition={{
                      type: 'spring',
                      damping: 20,
                      stiffness: 300,
                    }}
                  >
                    <div className={`w-20 h-20 rounded-xl glass border flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'border-indigo/50' : 'border-white/10'
                    }`}>
                      <span className={`text-3xl font-bold transition-all duration-500 ${
                        isActive ? 'gradient-text' : 'text-gray-400'
                      }`}>
                        {partner.name.charAt(0)}
                      </span>
                    </div>
                  </motion.div>
                  
                  <h3 className={`text-xl lg:text-2xl font-semibold text-center tracking-tight transition-colors duration-500 ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}>
                    {partner.name}
                  </h3>

                  {/* Active indicator line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo via-violet to-blue"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Navigation dots indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {partners.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleCardInteraction(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-indigo-400' : 'bg-gray-600'
                }`}
                animate={{
                  scale: index === activeIndex ? 1.5 : 1,
                  opacity: index === activeIndex ? 1 : 0.5,
                }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
