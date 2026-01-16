'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import RevealAnimation from './RevealAnimation';
import StaggerContainer from './StaggerContainer';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Subtle 3D background shapes for footer
function FooterShapes() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    meshRef.current.rotation.y = Math.cos(time * 0.15) * 0.1;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#6366F1" />
      <mesh ref={meshRef} position={[0, 0, -5]}>
        <icosahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          color="#6366F1"
          emissive="#8B5CF6"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.1}
        />
      </mesh>
    </>
  );
}

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  return (
    <footer
      ref={ref}
      id="contact"
      className="bg-dark border-t border-white/10 text-white py-32 relative overflow-hidden"
    >
      {/* Subtle 3D background */}
      <div className="absolute inset-0 opacity-20">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <FooterShapes />
        </Canvas>
      </div>

      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <motion.div style={{ opacity, y }}>
          <RevealAnimation>
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 tracking-tight"
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
              Ready to Scale?
            </motion.h2>
          </RevealAnimation>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" staggerDelay={0.1}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
              }}
              whileHover={{ y: -5 }}
              className="flex items-start gap-4 glass glass-hover rounded-xl p-6"
            >
              <div className="w-12 h-12 rounded-lg glass border border-indigo/30 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">Email</h3>
                <a
                  href="mailto:contact@tidodevs.com"
                  className="text-gray-300 hover:text-indigo-300 transition-colors"
                >
                  contact@tidodevs.com
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
              }}
              whileHover={{ y: -5 }}
              className="flex items-start gap-4 glass glass-hover rounded-xl p-6"
            >
              <div className="w-12 h-12 rounded-lg glass border border-indigo/30 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">WhatsApp (Techbookers)</h3>
                <a
                  href="https://wa.me/923225004942"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-indigo-300 transition-colors"
                >
                  +92 322 5004942
                </a>
                <p className="text-gray-500 text-sm mt-1">Aamir Razzaque - Consultant</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
              }}
              whileHover={{ y: -5 }}
              className="flex items-start gap-4 glass glass-hover rounded-xl p-6"
            >
              <div className="w-12 h-12 rounded-lg glass border border-indigo/30 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-white">Location</h3>
                <p className="text-gray-300">Rawalpindi, Pakistan</p>
                <p className="text-gray-500 text-sm">Bahria Town</p>
              </div>
            </motion.div>
          </StaggerContainer>
          
          <RevealAnimation delay={0.3}>
            <motion.div
              className="border-t border-white/10 pt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                delay: 0.4,
              }}
            >
              <p className="text-gray-400">
                © 2024 Tidodevs. In partnership with BCDApps & Techbookers SMC-PVT LTD.
              </p>
            </motion.div>
          </RevealAnimation>
        </motion.div>
      </div>
    </footer>
  );
}
