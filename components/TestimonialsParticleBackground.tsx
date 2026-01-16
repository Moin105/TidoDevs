 'use client';
 
 import { Canvas, useFrame } from '@react-three/fiber';
 import { useMemo, useRef } from 'react';
 import * as THREE from 'three';
 
 type VortexConfig = {
   count: number;
   height: number;
   maxRadius: number;
   baseX: number;
   drift: number;
   spin: number;
   colors: [string, string, string];
   arms: number;
 };
 
 function VortexParticles({ config }: { config: VortexConfig }) {
   const group = useRef<THREE.Group>(null);
 
   const { positions, colors } = useMemo(() => {
     const positions = new Float32Array(config.count * 3);
     const colors = new Float32Array(config.count * 3);
     const color = new THREE.Color();
 
     for (let i = 0; i < config.count; i += 1) {
       const y = THREE.MathUtils.randFloat(-config.height, config.height);
       const t = 1 - Math.abs(y) / config.height;
       const spiralT = Math.pow(t, 0.5);
       const radius = THREE.MathUtils.lerp(10, config.maxRadius, spiralT);
       const arm = i % config.arms;
       const twist = radius * 0.045;
       const angle = arm * (Math.PI * 2 / config.arms) + twist + THREE.MathUtils.randFloat(-0.18, 0.18);
       const x = Math.cos(angle) * (radius + Math.random() * 4);
       const z = Math.sin(angle) * (radius + Math.random() * 4);
 
       positions[i * 3] = x;
       positions[i * 3 + 1] = y;
       positions[i * 3 + 2] = z;
 
       const blend = t > 0.7 ? 0.2 : t;
       color.set(config.colors[0]).lerp(new THREE.Color(config.colors[1]), blend);
       if (t > 0.85) {
         color.lerp(new THREE.Color(config.colors[2]), 0.8);
       }
       colors[i * 3] = color.r;
       colors[i * 3 + 1] = color.g;
       colors[i * 3 + 2] = color.b;
     }
 
     return { positions, colors };
   }, [config]);
 
   useFrame((state, delta) => {
     if (!group.current) return;
     const time = state.clock.getElapsedTime();
     group.current.rotation.y += delta * config.spin;
     group.current.rotation.z += delta * 0.03;
     group.current.position.x = config.baseX + Math.sin(time * 0.2) * config.drift;
   });
 
   return (
     <group ref={group} position={[config.baseX, 0, -80]}>
       <points>
         <bufferGeometry>
           <bufferAttribute
             attach="attributes-position"
             array={positions}
             count={positions.length / 3}
             itemSize={3}
           />
           <bufferAttribute
             attach="attributes-color"
             array={colors}
             count={colors.length / 3}
             itemSize={3}
           />
         </bufferGeometry>
         <pointsMaterial
         size={0.85}
           vertexColors
           transparent
         opacity={0.8}
           depthWrite={false}
           blending={THREE.AdditiveBlending}
         />
       </points>
     </group>
   );
 }
 
 function StarField({ count = 220 }: { count?: number }) {
   const points = useRef<THREE.Points>(null);
   const { positions } = useMemo(() => {
     const positions = new Float32Array(count * 3);
     for (let i = 0; i < count; i += 1) {
       positions[i * 3] = THREE.MathUtils.randFloat(-700, 700);
       positions[i * 3 + 1] = THREE.MathUtils.randFloat(-280, 280);
       positions[i * 3 + 2] = THREE.MathUtils.randFloat(-220, 120);
     }
     return { positions };
   }, [count]);
 
   return (
     <points ref={points}>
       <bufferGeometry>
         <bufferAttribute
           attach="attributes-position"
           array={positions}
           count={positions.length / 3}
           itemSize={3}
         />
       </bufferGeometry>
       <pointsMaterial
         size={0.7}
         color="#f8fafc"
         transparent
         opacity={0.25}
         depthWrite={false}
       />
     </points>
   );
 }
 
 export default function TestimonialsParticleBackground() {
   return (
     <div className="absolute inset-0 z-0 pointer-events-none">
       <Canvas camera={{ position: [0, 0, 420], fov: 55 }} gl={{ alpha: true, antialias: true }}>
         <color attach="background" args={['#05070c']} />
         <ambientLight intensity={0.5} />
         <pointLight position={[200, 200, 120]} intensity={1.1} color="#f8fafc" />
         <pointLight position={[-180, -120, 120]} intensity={0.6} color="#f8fafc" />
         <StarField />
         <VortexParticles
           config={{
             count: 5200,
             height: 240,
             maxRadius: 200,
             baseX: 20,
             drift: 25,
             spin: 0.35,
             arms: 3,
             colors: ['#f8fafc', '#e2e8f0', '#ffffff'],
           }}
         />
       </Canvas>
     </div>
   );
 }
