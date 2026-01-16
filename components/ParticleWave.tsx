'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WaveParticles({ count = 500 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 10 + Math.random() * 50;
      const speed = 0.01 + Math.random() / 500;
      const x = (Math.random() - 0.5) * 2000;
      const y = Math.sin((i / count) * Math.PI * 2) * 300 + Math.random() * 200 - 100;
      const z = (Math.random() - 0.5) * 1000;

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state: any) => {
    if (!mesh.current) return;
    const meshRef = mesh.current;

    const time = state.clock.getElapsedTime();

    particles.forEach((particle: any, i: number) => {
      let { factor, speed, x, z } = particle;
      const t = (particle.time += speed) + time * 0.5;

      // Create wave motion
      const waveY = Math.sin((i / particles.length) * Math.PI * 4 + time * 2) * 100;
      const waveX = Math.cos(t * 0.5) * 50;
      
      dummy.position.set(
        x + waveX,
        particle.y + waveY,
        z + Math.sin(t * 0.3) * 30
      );

      const s = 0.5 + Math.sin(t) * 0.3;
      dummy.scale.set(s, s, s);
      dummy.rotation.set(t * 0.5, t * 0.3, t * 0.2);
      dummy.updateMatrix();

      meshRef.setMatrixAt(i, dummy.matrix);
    });

    meshRef.instanceMatrix.needsUpdate = true;

    if (light.current) {
      light.current.position.x = Math.sin(time) * 500;
      light.current.position.y = Math.cos(time * 0.5) * 500;
    }
  });

  return (
    <>
      <pointLight ref={light} distance={2000} intensity={1.5} color="#9D4EDD" />
      <ambientLight intensity={0.4} />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <sphereGeometry args={[3, 8, 8]} />
        <meshPhongMaterial color="#4361EE" emissive="#9D4EDD" emissiveIntensity={0.3} />
      </instancedMesh>
    </>
  );
}

export default function ParticleWave() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 800], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <WaveParticles count={500} />
      </Canvas>
    </div>
  );
}
