'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Organic particle shape with fluid motion
function OrganicParticle({ position, index }: { position: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  // Create organic shape using torus knot or custom geometry
  const geometry = useMemo(() => {
    const geo = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();
    const t = time * 0.5 + index * 0.1;

    // Organic fluid motion using Lissajous curves
    const x = position[0] + Math.sin(t * 0.7) * 2;
    const y = position[1] + Math.cos(t * 0.5) * 2;
    const z = position[2] + Math.sin(t * 0.3) * 1.5;

    meshRef.current.position.set(x, y, z);

    // Slow, organic rotation
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.z += delta * 0.1;

    // Subtle scale pulsing
    const scale = 1 + Math.sin(t * 2) * 0.1;
    meshRef.current.scale.setScalar(scale);

    // Glow intensity variation
    const glow = 0.3 + Math.sin(t * 1.5) * 0.2;
    materialRef.current.emissiveIntensity = glow;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        color="#6366F1"
        emissive="#8B5CF6"
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

// Fluid blob particles
function FluidBlob({ position, index }: { position: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(0.4, 1);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.getElapsedTime();
    const t = time * 0.3 + index * 0.15;

    // Perlin noise-like movement
    const x = position[0] + Math.sin(t) * Math.cos(t * 0.7) * 3;
    const y = position[1] + Math.cos(t * 0.8) * Math.sin(t * 0.5) * 3;
    const z = position[2] + Math.sin(t * 0.6) * 2;

    meshRef.current.position.set(x, y, z);

    // Smooth rotation
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.25;

    // Organic scale
    const scale = 0.8 + Math.sin(t * 1.2) * 0.15;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        color="#3B82F6"
        emissive="#6366F1"
        emissiveIntensity={0.25}
        metalness={0.7}
        roughness={0.3}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Main particle scene with mouse interaction
function ParticleScene() {
  const { viewport } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate organic particle positions
  const particles = useMemo(() => {
    const count = 30;
    const positions: [number, number, number][] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 8 + Math.random() * 4;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 10;
      positions.push([x, y, z]);
    }
    return positions;
  }, []);

  const blobPositions = useMemo(() => {
    const count = 20;
    const positions: [number, number, number][] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 6 + Math.random() * 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 8;
      positions.push([x, y, z]);
    }
    return positions;
  }, []);

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Dynamic point lights that follow mouse */}
      <pointLight
        position={[mouse.x * 5, mouse.y * 5, 5]}
        intensity={1.5}
        color="#6366F1"
        distance={20}
      />
      <pointLight
        position={[-mouse.x * 5, -mouse.y * 5, -5]}
        intensity={1}
        color="#8B5CF6"
        distance={20}
      />

      {/* Organic particles */}
      {particles.map((pos, i) => (
        <OrganicParticle key={`particle-${i}`} position={pos} index={i} />
      ))}

      {/* Fluid blobs */}
      {blobPositions.map((pos, i) => (
        <FluidBlob key={`blob-${i}`} position={pos} index={i} />
      ))}
    </>
  );
}

export default function OrganicParticles() {
  return (
    <div className="absolute inset-0  opacity-40">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ParticleScene />
      </Canvas>
    </div>
  );
}
