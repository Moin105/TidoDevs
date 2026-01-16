 'use client';
 
 import { Canvas, useFrame } from '@react-three/fiber';
 import { useMemo, useRef } from 'react';
 import * as THREE from 'three';
 
 type StreamLayer = {
   positions: Float32Array;
   speeds: Float32Array;
 };
 
 function ParticleStreams({ layers = 2, count = 700 }: { layers?: number; count?: number }) {
   const streams = useRef<THREE.Points[]>([]);
   const data = useMemo<StreamLayer[]>(() => {
     return Array.from({ length: layers }).map((_, layerIndex) => {
       const positions = new Float32Array(count * 3);
       const speeds = new Float32Array(count);
       for (let i = 0; i < count; i += 1) {
         const x = THREE.MathUtils.randFloat(-520, 520);
        const y = THREE.MathUtils.randFloat(-90, 90) + layerIndex * 14;
        const z = THREE.MathUtils.randFloat(-130, 130) - layerIndex * 30;
         positions[i * 3] = x;
         positions[i * 3 + 1] = y;
         positions[i * 3 + 2] = z;
        speeds[i] = THREE.MathUtils.randFloat(30, 55) + layerIndex * 10;
       }
       return { positions, speeds };
     });
   }, [count, layers]);
 
   useFrame((_, delta) => {
     data.forEach((layer, layerIndex) => {
       const points = streams.current[layerIndex];
       if (!points) return;
       const attr = points.geometry.attributes.position as THREE.BufferAttribute;
       for (let i = 0; i < count; i += 1) {
         let x = attr.getX(i);
         x -= layer.speeds[i] * delta;
         if (x < -520) {
           x = 520;
         }
         const y = attr.getY(i) + Math.sin((x + i) * 0.015) * 0.3;
         attr.setXYZ(i, x, y, attr.getZ(i));
       }
       attr.needsUpdate = true;
     });
   });
 
   return (
    <group rotation={[-0.25, 0.35, 0.05]} position={[0, 0, -100]}>
       {data.map((layer, index) => (
         <points
           key={`stream-${index}`}
           ref={(el) => {
             if (el) streams.current[index] = el;
           }}
         >
           <bufferGeometry>
             <bufferAttribute
               attach="attributes-position"
               array={layer.positions}
               count={layer.positions.length / 3}
               itemSize={3}
             />
           </bufferGeometry>
          <pointsMaterial
            size={1.4}
             color={index % 2 === 0 ? '#93c5fd' : '#f8fafc'}
             transparent
            opacity={0.3}
             depthWrite={false}
             blending={THREE.AdditiveBlending}
           />
         </points>
       ))}
     </group>
   );
 }
 
 export default function WorkflowParticleBackground() {
   return (
     <div className="absolute inset-0 z-0 pointer-events-none">
       <Canvas camera={{ position: [0, 0, 380], fov: 55 }} gl={{ alpha: true, antialias: true }}>
         <color attach="background" args={['#02040a']} />
         <ambientLight intensity={0.6} />
         <pointLight position={[200, 200, 200]} intensity={1.2} color="#60a5fa" />
         <ParticleStreams />
       </Canvas>
     </div>
   );
 }
