'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 2000 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;

      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state: any) => {
    if (!mesh.current) return;
    const meshRef = mesh.current;

    particles.forEach((particle: any, i: number) => {
      let { factor, speed, x, y, z } = particle;
      const t = (particle.time += speed);

      dummy.position.set(
        x + Math.cos((t / 10) * factor) + (Math.sin(t * factor) * factor) / 10,
        y + Math.sin((t / 10) * factor) + (Math.cos(t * factor) * factor) / 10,
        z + Math.cos((t / 10) * factor) + (Math.sin(t * factor) * factor) / 10
      );

      const s = Math.cos(t);
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();

      meshRef.setMatrixAt(i, dummy.matrix);
    });

    meshRef.instanceMatrix.needsUpdate = true;

    if (light.current) {
      light.current.position.x = state.mouse.x * 1000;
      light.current.position.y = state.mouse.y * 1000;
    }
  });

  return (
    <>
      <pointLight ref={light} distance={2000} intensity={2} color="#9D4EDD" />
      <ambientLight intensity={0.5} />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[2, 0]} />
        <meshPhongMaterial color="#4361EE" />
      </instancedMesh>
    </>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1000], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <Particles count={2000} />
      </Canvas>
    </div>
  );
}
