 'use client';
 
 import { Canvas, useFrame } from '@react-three/fiber';
 import { useMemo, useRef } from 'react';
 import * as THREE from 'three';
 
 function RingParticles({ count, radius, spread, speed, tilt, height }: { count: number; radius: number; spread: number; speed: number; tilt: number; height: number }) {
   const points = useRef<THREE.Points>(null);
   const base = useMemo(() => {
     const positions = new Float32Array(count * 3);
     for (let i = 0; i < count; i += 1) {
       const angle = (i / count) * Math.PI * 2;
       const jitter = THREE.MathUtils.randFloat(-spread, spread);
       const r = radius + jitter;
       positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = THREE.MathUtils.randFloat(-height, height);
       positions[i * 3 + 2] = Math.sin(angle) * r;
     }
     return positions;
  }, [count, radius, spread, height]);
 
   useFrame((state, delta) => {
     if (!points.current) return;
     points.current.rotation.y += delta * speed;
     points.current.rotation.x = tilt;
     const attr = points.current.geometry.attributes.position as THREE.BufferAttribute;
     for (let i = 0; i < count; i += 1) {
       const x = base[i * 3];
       const z = base[i * 3 + 2];
       const wave = Math.sin(state.clock.elapsedTime * 1.2 + i * 0.05) * 3;
       attr.setXYZ(i, x, base[i * 3 + 1] + wave, z);
     }
     attr.needsUpdate = true;
   });
 
   return (
     <points ref={points}>
       <bufferGeometry>
         <bufferAttribute attach="attributes-position" array={base} count={base.length / 3} itemSize={3} />
       </bufferGeometry>
       <pointsMaterial size={1.1} color="#e2e8f0" transparent opacity={0.38} depthWrite={false} />
     </points>
   );
 }
 
 function StarField({ count = 380 }: { count?: number }) {
   const positions = useMemo(() => {
     const arr = new Float32Array(count * 3);
     for (let i = 0; i < count; i += 1) {
      arr[i * 3] = THREE.MathUtils.randFloatSpread(1600);
      arr[i * 3 + 1] = THREE.MathUtils.randFloatSpread(900);
      arr[i * 3 + 2] = THREE.MathUtils.randFloat(-700, 200);
     }
     return arr;
   }, [count]);
 
   return (
     <points>
       <bufferGeometry>
         <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
       </bufferGeometry>
       <pointsMaterial size={0.6} color="#e2e8f0" transparent opacity={0.22} depthWrite={false} />
     </points>
   );
 }
 
 export default function ProjectsParticleBackground() {
   return (
     <div className="absolute inset-0 z-0 pointer-events-none">
       <Canvas camera={{ position: [0, 0, 420], fov: 55 }} gl={{ alpha: true, antialias: true }}>
         <color attach="background" args={['#02040a']} />
         <ambientLight intensity={0.4} />
         <pointLight position={[200, 200, 120]} intensity={0.9} color="#ffffff" />
         <StarField />
         <group position={[0, -20, -160]}>
           <RingParticles count={980} radius={260} spread={32} height={44} speed={0.08} tilt={-0.18} />
           <RingParticles count={760} radius={190} spread={26} height={38} speed={-0.12} tilt={0.12} />
           <RingParticles count={620} radius={320} spread={38} height={52} speed={0.06} tilt={-0.12} />
         </group>
       </Canvas>
     </div>
   );
 }
