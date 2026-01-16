 'use client';

 import { Canvas, useFrame } from '@react-three/fiber';
 import { useMemo, useRef } from 'react';
 import * as THREE from 'three';

 type ParticleField = {
   positions: Float32Array;
   colors: Float32Array;
   baseY: Float32Array;
 };

 const COLORS = ['#f8fafc', '#60a5fa', '#22c55e', '#f59e0b', '#a78bfa', '#f97316'];

 function ParticleStream({ count = 2600 }: { count?: number }) {
   const points = useRef<THREE.Points>(null);
   const glowPoints = useRef<THREE.Points>(null);
   const boxParticles = useRef<THREE.Points>(null);
   const dummy = useMemo(() => new THREE.Object3D(), []);
   const bounds = useMemo(
     () => ({ minX: -520, maxX: 520, minY: -110, maxY: 110, minZ: -120, maxZ: 120 }),
     []
   );
   const speed = 110;

   const { positions, colors, baseY } = useMemo<ParticleField>(() => {
     const positions = new Float32Array(count * 3);
     const colors = new Float32Array(count * 3);
     const baseY = new Float32Array(count);
     const color = new THREE.Color();

     for (let i = 0; i < count; i += 1) {
       const x = THREE.MathUtils.randFloat(bounds.minX, bounds.maxX);
       const band = Math.sin((x / bounds.maxX) * Math.PI) * 90;
       const y = THREE.MathUtils.randFloat(-35, 35) + band * 0.25;
       const z = THREE.MathUtils.randFloat(bounds.minZ, bounds.maxZ);
       const palette = COLORS[Math.floor(Math.random() * COLORS.length)];
       color.set(palette);

       positions[i * 3] = x;
       positions[i * 3 + 1] = y;
       positions[i * 3 + 2] = z;

       colors[i * 3] = color.r;
       colors[i * 3 + 1] = color.g;
       colors[i * 3 + 2] = color.b;

       baseY[i] = y;
     }

     return { positions, colors, baseY };
   }, [bounds, count]);

   const glowData = useMemo(() => {
     const glowCount = Math.floor(count * 0.5);
     const positions = new Float32Array(glowCount * 3);
     const colors = new Float32Array(glowCount * 3);
     const baseY = new Float32Array(glowCount);
     const color = new THREE.Color('#f8fafc');

     for (let i = 0; i < glowCount; i += 1) {
       const x = THREE.MathUtils.randFloat(bounds.minX, bounds.maxX);
       const y = THREE.MathUtils.randFloat(bounds.minY, bounds.minY + 40);
       const z = THREE.MathUtils.randFloat(bounds.minZ, bounds.maxZ);
       positions[i * 3] = x;
       positions[i * 3 + 1] = y;
       positions[i * 3 + 2] = z;
       colors[i * 3] = color.r;
       colors[i * 3 + 1] = color.g;
       colors[i * 3 + 2] = color.b;
       baseY[i] = y;
     }

     return { positions, colors, baseY, count: glowCount };
   }, [bounds, count]);

   const boxData = useMemo(() => {
     const boxes = Array.from({ length: 14 }).map(() => ({
       x: THREE.MathUtils.randFloat(bounds.minX, bounds.maxX),
       y: THREE.MathUtils.randFloat(-15, 15),
       z: THREE.MathUtils.randFloat(-35, 35),
       speed: THREE.MathUtils.randFloat(0.7, 1.2),
     }));
     return boxes;
   }, [bounds]);

   const boxField = useMemo(() => {
     const positions = new Float32Array(boxData.length * 3);
     const colors = new Float32Array(boxData.length * 3);
     const color = new THREE.Color('#f8fafc');
     boxData.forEach((box, index) => {
       positions[index * 3] = box.x;
       positions[index * 3 + 1] = box.y;
       positions[index * 3 + 2] = box.z;
       colors[index * 3] = color.r;
       colors[index * 3 + 1] = color.g;
       colors[index * 3 + 2] = color.b;
     });
     return { positions, colors };
   }, [boxData]);

   useFrame((state, delta) => {
     if (!points.current) return;
     const time = state.clock.getElapsedTime();
     const positionAttr = points.current.geometry.attributes.position as THREE.BufferAttribute;

     for (let i = 0; i < count; i += 1) {
       const idx = i * 3;
       let x = positionAttr.getX(i);
       x += speed * delta;
       if (x > bounds.maxX) {
         x = bounds.minX + (x - bounds.maxX);
       }
       const y = baseY[i] + Math.sin(time * 1.2 + x * 0.02) * 8;
       positionAttr.setXYZ(i, x, y, positionAttr.getZ(i));
     }

     positionAttr.needsUpdate = true;

     if (glowPoints.current) {
       const glowAttr = glowPoints.current.geometry.attributes.position as THREE.BufferAttribute;
       for (let i = 0; i < glowData.count; i += 1) {
         let x = glowAttr.getX(i);
         x += speed * delta * 0.8;
         if (x > bounds.maxX) {
           x = bounds.minX + (x - bounds.maxX);
         }
         const y = glowData.baseY[i] + Math.sin(time * 1.6 + x * 0.02) * 5;
         glowAttr.setXYZ(i, x, y, glowAttr.getZ(i));
       }
       glowAttr.needsUpdate = true;
     }

     if (boxParticles.current) {
       const boxAttr = boxParticles.current.geometry.attributes.position as THREE.BufferAttribute;
       boxData.forEach((box, index) => {
         box.x += speed * delta * box.speed;
         if (box.x > bounds.maxX) {
           box.x = bounds.minX;
         }
         const sway = Math.sin(time * 1.4 + index) * 8;
         boxAttr.setXYZ(index, box.x, box.y + sway, box.z);
       });
       boxAttr.needsUpdate = true;
     }
   });

   return (
     <group rotation={[-0.35, -0.6, 0.08]} position={[0, -20, 0]}>
       <points ref={points}>
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
           size={2.4}
           vertexColors
           transparent
           opacity={0.85}
           depthWrite={false}
           blending={THREE.AdditiveBlending}
         />
       </points>
       <points ref={glowPoints}>
         <bufferGeometry>
           <bufferAttribute
             attach="attributes-position"
             array={glowData.positions}
             count={glowData.positions.length / 3}
             itemSize={3}
           />
           <bufferAttribute
             attach="attributes-color"
             array={glowData.colors}
             count={glowData.colors.length / 3}
             itemSize={3}
           />
         </bufferGeometry>
         <pointsMaterial
           size={1.8}
           vertexColors
           transparent
           opacity={0.7}
           depthWrite={false}
           blending={THREE.AdditiveBlending}
         />
       </points>
       <points ref={boxParticles}>
         <bufferGeometry>
           <bufferAttribute
             attach="attributes-position"
             array={boxField.positions}
             count={boxField.positions.length / 3}
             itemSize={3}
           />
           <bufferAttribute
             attach="attributes-color"
             array={boxField.colors}
             count={boxField.colors.length / 3}
             itemSize={3}
           />
         </bufferGeometry>
         <pointsMaterial
           size={4.6}
           vertexColors
           transparent
           opacity={0.9}
           depthWrite={false}
           blending={THREE.AdditiveBlending}
         />
       </points>
     </group>
   );
 }

export default function ParticleRoad() {
  return (
    <div className="absolute inset-0 z-0">
       <Canvas
        camera={{ position: [-240, 140, 280], fov: 55 }}
         gl={{ alpha: true, antialias: true }}
       >
        <color attach="background" args={['#05070c']} />
        <ambientLight intensity={0.6} />
        <pointLight position={[200, 200, 200]} intensity={1.4} color="#60a5fa" />
        <pointLight position={[-200, -100, 120]} intensity={0.7} color="#f59e0b" />
         <ParticleStream />
       </Canvas>
     </div>
   );
 }
