 'use client';
 
 import { Canvas, useFrame } from '@react-three/fiber';
 import { useMemo, useRef } from 'react';
 import * as THREE from 'three';
 
 const PATTERNS = [
   { color: '#818cf8', emissive: '#4f46e5', rotation: [0.2, 0.35, 0], drift: 0.12 },
   { color: '#34d399', emissive: '#10b981', rotation: [-0.15, 0.25, 0], drift: 0.1 },
   { color: '#c084fc', emissive: '#7c3aed', rotation: [0.1, -0.3, 0], drift: 0.14 },
 ];
 
 function CubeCloud({ variant = 0 }: { variant?: number }) {
   const mesh = useRef<THREE.InstancedMesh>(null);
   const dummy = useMemo(() => new THREE.Object3D(), []);
   const config = PATTERNS[variant % PATTERNS.length];
 
   const cubes = useMemo(() => {
     return Array.from({ length: 40 }).map(() => ({
       x: THREE.MathUtils.randFloat(-12, 12),
       y: THREE.MathUtils.randFloat(-8, 8),
       z: THREE.MathUtils.randFloat(-14, 10),
       size: THREE.MathUtils.randFloat(0.6, 1.4),
       speed: THREE.MathUtils.randFloat(0.4, 1.0),
     }));
   }, []);
 
   useFrame((state, delta) => {
     if (!mesh.current) return;
     const time = state.clock.getElapsedTime();
 
     cubes.forEach((cube, index) => {
       const sway = Math.sin(time * cube.speed + index) * 0.6;
       dummy.position.set(cube.x, cube.y + sway, cube.z);
       dummy.rotation.set(
         config.rotation[0] + time * 0.12,
         config.rotation[1] + time * 0.18,
         config.rotation[2] + sway * 0.2
       );
       dummy.scale.setScalar(cube.size);
       dummy.updateMatrix();
       mesh.current?.setMatrixAt(index, dummy.matrix);
     });
 
     mesh.current.instanceMatrix.needsUpdate = true;
   });
 
   return (
     <instancedMesh ref={mesh} args={[undefined, undefined, cubes.length]}>
       <boxGeometry args={[1, 1, 1]} />
       <meshStandardMaterial color={config.color} emissive={config.emissive} emissiveIntensity={0.35} />
     </instancedMesh>
   );
 }
 
 export default function PartnerCubeParticles({ variant = 0 }: { variant?: number }) {
   return (
     <div className="absolute inset-0 pointer-events-none">
       <Canvas camera={{ position: [0, 0, 30], fov: 45 }} gl={{ alpha: true, antialias: true }}>
         <ambientLight intensity={0.6} />
         <pointLight position={[10, 12, 10]} intensity={0.9} />
         <CubeCloud variant={variant} />
       </Canvas>
     </div>
   );
 }
