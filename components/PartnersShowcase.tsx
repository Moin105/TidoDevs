'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState, useEffect } from 'react';
import type { BufferGeometry, Points } from 'three';

interface Partner {
  id: string;
  name: string;
  logo: string;
  title: string;
  subtitle: string;
  stats: {
    label: string;
    value: string;
  }[];
  products: {
    name: string;
    icon: string;
  }[];
}

type ParticlePattern = 'spiral' | 'gridWave' | 'orbitalSphere';

type ParticleConfig = {
  pattern: ParticlePattern;
  color: string;
  size: number;
  seed: number;
  morphSpeed: number;
  rotationSpeed: [number, number, number];
};

const particleCount = 700;

const partnerParticleConfigs: Record<string, ParticleConfig> = {
  bcd: {
    pattern: 'spiral',
    color: '#6366f1',
    size: 0.03,
    seed: 1.4,
    morphSpeed: 2.4,
    rotationSpeed: [0.05, 0.08, 0.02],
  },
  techbookers: {
    pattern: 'gridWave',
    color: '#8b5cf6',
    size: 0.028,
    seed: 2.2,
    morphSpeed: 2.1,
    rotationSpeed: [0.03, 0.06, 0.01],
  },
  codivo: {
    pattern: 'orbitalSphere',
    color: '#60a5fa',
    size: 0.032,
    seed: 3.1,
    morphSpeed: 2.6,
    rotationSpeed: [0.04, 0.05, 0.03],
  },
};

const pseudoRandom = (index: number, seed: number) => {
  const value = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const createPatternPositions = (
  pattern: ParticlePattern,
  count: number,
  seed: number
) => {
  const positions = new Float32Array(count * 3);

  if (pattern === 'spiral') {
    const turns = 8;
    for (let i = 0; i < count; i += 1) {
      const t = (i / count) * Math.PI * 2 * turns;
      const radius = 0.2 + (i / count) * 1.8;
      const y = (i / count - 0.5) * 1.5;
      const jitter = (pseudoRandom(i, seed) - 0.5) * 0.15;

      positions[i * 3] = Math.cos(t) * (radius + jitter);
      positions[i * 3 + 1] = y + jitter * 0.5;
      positions[i * 3 + 2] = Math.sin(t) * (radius + jitter);
    }
  } else if (pattern === 'gridWave') {
    const gridSize = Math.ceil(Math.sqrt(count));
    const spacing = 0.18;
    for (let i = 0; i < count; i += 1) {
      const xIndex = i % gridSize;
      const zIndex = Math.floor(i / gridSize);
      const x = (xIndex - gridSize / 2) * spacing;
      const z = (zIndex - gridSize / 2) * spacing;
      const wave =
        Math.sin(xIndex * 0.45 + seed) * 0.25 +
        Math.cos(zIndex * 0.35 + seed) * 0.25;
      const jitter = (pseudoRandom(i, seed) - 0.5) * 0.12;

      positions[i * 3] = x + jitter * 0.2;
      positions[i * 3 + 1] = wave + jitter * 0.4;
      positions[i * 3 + 2] = z + jitter * 0.2;
    }
  } else {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i += 1) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i + seed;
      const r = 1.6 + (pseudoRandom(i, seed) - 0.5) * 0.3;

      positions[i * 3] = Math.cos(theta) * radius * r;
      positions[i * 3 + 1] = y * r * 0.9;
      positions[i * 3 + 2] = Math.sin(theta) * radius * r;
    }
  }

  return positions;
};

function ParticleField({ partnerId }: { partnerId: string }) {
  const config = useMemo(
    () => partnerParticleConfigs[partnerId] ?? partnerParticleConfigs.bcd,
    [partnerId]
  );
  const pointsRef = useRef<Points>(null);
  const geometryRef = useRef<BufferGeometry>(null);
  const positionsRef = useRef<Float32Array>(
    createPatternPositions(config.pattern, particleCount, config.seed)
  );
  const targetRef = useRef<Float32Array>(
    createPatternPositions(config.pattern, particleCount, config.seed)
  );

  useEffect(() => {
    targetRef.current = createPatternPositions(
      config.pattern,
      particleCount,
      config.seed
    );
  }, [config.pattern, config.seed]);

  useFrame((state, delta) => {
    const positions = positionsRef.current;
    const target = targetRef.current;
    const lerp = 1 - Math.exp(-delta * config.morphSpeed);

    for (let i = 0; i < positions.length; i += 1) {
      positions[i] += (target[i] - positions[i]) * lerp;
    }

    if (geometryRef.current) {
      geometryRef.current.attributes.position.needsUpdate = true;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * config.rotationSpeed[0];
      pointsRef.current.rotation.y += delta * config.rotationSpeed[1];
      pointsRef.current.rotation.z += delta * config.rotationSpeed[2];
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          array={positionsRef.current}
          itemSize={3}
          count={positionsRef.current.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={config.color}
        size={config.size}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function PartnerParticlesBackground({ partnerId }: { partnerId: string }) {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 4]} intensity={0.6} />
      <ParticleField partnerId={partnerId} />
    </Canvas>
  );
}

const partners: Partner[] = [
  {
    id: 'bcd',
    name: 'BCD Apps',
    logo: 'B',
    title: 'Global Software Solutions',
    subtitle: 'Verified Enterprise Partner',
    stats: [
      {
        label: 'Uplift from Enterprise Solutions',
        value: '+12%',
      },
      {
        label: 'Uplift from Custom Development',
        value: '+8%',
      },
    ],
    products: [
      { name: 'Blockchain Solutions', icon: '🔗' },
      { name: 'Enterprise Architecture', icon: '🏗️' },
    ],
  },
  {
    id: 'techbookers',
    name: 'Techbookers SMC-PVT LTD',
    logo: 'T',
    title: 'Finance & Travel Consulting',
    subtitle: 'Rawalpindi, Bahria Town',
    stats: [
      {
        label: 'Uplift from Finance Solutions',
        value: '+15%',
      },
      {
        label: 'Uplift from Travel Tech',
        value: '+10%',
      },
    ],
    products: [
      { name: 'Finance Consulting', icon: '💼' },
      { name: 'Travel Technology', icon: '✈️' },
    ],
  },
  {
    id: 'codivo',
    name: 'Codivo Technologies',
    logo: 'C',
    title: 'Scalable Web Architecture',
    subtitle: 'Next-Gen Solutions',
    stats: [
      {
        label: 'Uplift from Scalable Architecture',
        value: '+20%',
      },
      {
        label: 'Uplift from Performance Optimization',
        value: '+14%',
      },
    ],
    products: [
      { name: 'Web Development', icon: '🌐' },
      { name: 'Mobile Solutions', icon: '📱' },
    ],
  },
];

export default function PartnersShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-cycle timer
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % partners.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused]);

  const handlePartnerClick = (index: number) => {
    if (index === activeIndex) return;
    
    // Trigger border animation before content change
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveIndex(index);
      setIsPaused(true);
      setIsAutoPlaying(false);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setIsPaused(false);
        setIsAutoPlaying(true);
      }, 500);
    }, 300);
  };

  const activePartner = partners[activeIndex];

  return (
    <section
      id="partners"
      className="py-32 bg-dark relative overflow-hidden min-h-screen flex items-center"
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200,
            duration: 0.8,
          }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Strategic Partners & Incorporations
          </h2>
          <p className="text-xl text-gray-400">
            Trusted partnerships that drive innovation
          </p>
        </motion.div>

        {/* Main Split Layout - Stripe Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left Sidebar - Stats & Products */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Boxes */}
            <div className="space-y-6">
              {activePartner.stats.map((stat, statIndex) => (
                <div
                  key={`${activeIndex}-${statIndex}`}
                  className="border-l-[5px] p-6  border-l-white relative overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeIndex}-${statIndex}-value`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 300,
                        delay: statIndex * 0.1,
                      }}
                      className="text-4xl font-bold text-white mb-2"
                    >
                      {stat.value}
                    </motion.div>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeIndex}-${statIndex}-label`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 300,
                        delay: statIndex * 0.1 + 0.1,
                      }}
                      className="text-sm text-gray-400 leading-relaxed"
                    >
                      {stat.label}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ))}
            </div>

             {/* Products Used Box */}
             <div className="p-6 border-l-[5px] border-l-white relative overflow-hidden">
               <AnimatePresence mode="wait">
                <motion.div
                  key={`products-title-${activeIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 300,
                  }}
                  className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide"
                >
                  Services Used
                </motion.div>
              </AnimatePresence>
              <div className="space-y-3">
                {activePartner.products.map((product, productIndex) => (
                  <AnimatePresence mode="wait" key={productIndex}>
                    <motion.div
                      key={`${activeIndex}-${productIndex}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{
                        delay: productIndex * 0.1,
                        type: 'spring',
                        damping: 25,
                        stiffness: 300,
                      }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-2xl">{product.icon}</span>
                      <span className="text-white font-medium">{product.name}</span>
                     </motion.div>
                   </AnimatePresence>
                 ))}
               </div>
             </div>

            {/* Partner Navigation Dots */}
            <div className="flex gap-3 pt-4">
              {partners.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handlePartnerClick(index)}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'bg-indigo-400' : 'bg-gray-600'
                  }`}
                  animate={{
                    scale: index === activeIndex ? 1.1 : 1,
                    opacity: index === activeIndex ? 1 : 0.5,
                  }}
                  whileHover={{ scale: 1.15, opacity: 1 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
          </div>

          {/* Right Section - Large Visual Card */}
          <div className="lg:col-span-2 relative">
            <div className={`rotating-border rounded-3xl overflow-hidden relative ${
              isTransitioning ? 'active' : ''
            }`}>
                <div className="bg-[#1A1A1A] rounded-3xl h-full">
                {/* Background with gradient overlay */}
                <div className="relative h-[500px] lg:h-[600px] rounded-3xl">
                  {/* Animated particle background */}
                  <div className="absolute inset-0 opacity-70 pointer-events-none">
                    <PartnerParticlesBackground partnerId={activePartner.id} />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-12">
                    {/* Top Section - Logo */}
                    <div className="flex items-center justify-between">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`logo-${activeIndex}`}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                          }}
                          className="flex items-center gap-4"
                        >
                          <div className="w-16 h-16 rounded-xl bg-[#0F0F0F] border border-indigo/30 flex items-center justify-center">
                            <span className="text-3xl font-bold text-indigo-400">
                              {activePartner.logo}
                            </span>
                          </div>
                          <div>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={`name-${activeIndex}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{
                                  type: 'spring',
                                  damping: 25,
                                  stiffness: 300,
                                }}
                                className="text-white font-semibold text-lg"
                              >
                                {activePartner.name}
                              </motion.div>
                            </AnimatePresence>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={`subtitle-top-${activeIndex}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{
                                  type: 'spring',
                                  damping: 25,
                                  stiffness: 300,
                                  delay: 0.1,
                                }}
                                className="text-gray-400 text-sm"
                              >
                                {activePartner.subtitle}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                     {/* Bottom Section - Headline */}
                     <div className={`rotating-border rounded-2xl relative overflow-hidden ${
                       isTransitioning ? 'active' : ''
                     }`}>
                       <div className="bg-[#0F0F0F] rounded-2xl p-6 lg:p-8 h-full">
                      <AnimatePresence mode="wait">
                        <motion.h3
                          key={`title-${activeIndex}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                          }}
                          className="text-2xl lg:text-4xl font-bold text-white mb-3 tracking-tight"
                        >
                          {activePartner.title}
                        </motion.h3>
                      </AnimatePresence>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={`subtitle-bottom-${activeIndex}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 200,
                            delay: 0.1,
                          }}
                           className="text-lg text-gray-300"
                         >
                           {activePartner.subtitle}
                         </motion.p>
                       </AnimatePresence>
                       </div>
                     </div>
                  </div>
                </div>
                </div>
            </div>

            {/* Partner Icons - Floating on Right */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
              {partners.map((partner, index) => {
                const isActive = index === activeIndex;
                
                return (
                  <motion.button
                    key={partner.id}
                    onClick={() => handlePartnerClick(index)}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      type: 'spring',
                      damping: 20,
                      stiffness: 200,
                    }}
                    animate={{
                      opacity: isActive ? 1 : 0.4,
                      scale: isActive ? 1.1 : 1,
                    }}
                    whileHover={{
                      scale: 1.15,
                      opacity: 1,
                    }}
                    className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-white/10 flex items-center justify-center cursor-pointer relative overflow-hidden"
                  >
                    <motion.div
                      className={`absolute inset-0 rounded-xl ${
                        isActive
                          ? 'bg-gradient-to-br from-indigo/40 via-violet/40 to-blue/40'
                          : 'bg-white/5'
                      }`}
                      animate={{
                        opacity: isActive ? [0.6, 0.9, 0.6] : 0.3,
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <span
                      className={`text-lg font-bold relative z-10 ${
                        isActive ? 'text-indigo-300' : 'text-gray-400'
                      }`}
                    >
                      {partner.logo}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
