'use client';

import { useEffect, useRef } from 'react';

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Wave configuration
    const pixelSize = 4; // Smaller pixels for more detail
    const waveAmplitude = 100;
    const waveSpeed = 0.02;
    let time = 0;

    // Colors for the waves - matching the theme
    const colors = [
      { r: 67, g: 97, b: 238, alpha: 0.5 },   // Blue (#4361EE)
      { r: 20, g: 184, b: 166, alpha: 0.45 }, // Teal (#14B8A6)
      { r: 157, g: 78, b: 221, alpha: 0.5 },  // Purple (#9D4EDD)
    ];

    // Generate many wave configurations
    const waveConfigs: Array<{
      yOffset: number;
      frequency: number;
      amplitude: number;
      colorIndex: number;
      phase: number;
      speed: number;
    }> = [];

    // Create dense wave pattern covering the entire screen
    for (let i = -300; i <= 300; i += 25) {
      waveConfigs.push({
        yOffset: i,
        frequency: 0.3 + Math.random() * 0.4,
        amplitude: waveAmplitude * (0.6 + Math.random() * 0.4),
        colorIndex: Math.floor(Math.random() * colors.length),
        phase: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.01,
      });
    }

    const drawWave = (
      yOffset: number,
      frequency: number,
      amplitude: number,
      color: { r: number; g: number; b: number; alpha: number },
      phase: number = 0,
      speed: number = 1
    ) => {
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2 + yOffset;

      // Draw wave as pixelated squares
      for (let x = 0; x < width; x += pixelSize) {
        // Calculate wave position with multiple frequencies for complexity
        const waveX1 = (x * frequency + time * 200 * speed + phase * 100) * 0.01;
        const waveX2 = (x * frequency * 1.5 + time * 150 * speed + phase * 50) * 0.015;
        const wave = (Math.sin(waveX1) * 0.7 + Math.sin(waveX2) * 0.3) * amplitude;
        const y = centerY + wave;

        // Draw pixelated blocks with some thickness
        const pixelY = Math.floor(y / pixelSize) * pixelSize;
        const thickness = 2; // Make lines thicker
        
        // Calculate opacity based on distance from center and wave intensity
        const distanceFromCenter = Math.abs(pixelY - centerY);
        const waveIntensity = (Math.sin(waveX1) + 1) / 2; // 0 to 1
        const opacity = color.alpha * (1 - distanceFromCenter / (amplitude * 4)) * (0.4 + waveIntensity * 0.6);
        
        if (opacity > 0.08 && pixelY >= -50 && pixelY < height + 50) {
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
          // Draw thicker lines
          for (let t = 0; t < thickness; t++) {
            ctx.fillRect(x, pixelY + t * pixelSize, pixelSize, pixelSize);
          }
        }
      }
    };

    const animate = () => {
      // Clear with dark background
      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += waveSpeed;

      // Draw all waves
      waveConfigs.forEach((config) => {
        drawWave(
          config.yOffset,
          config.frequency,
          config.amplitude,
          colors[config.colorIndex],
          config.phase,
          config.speed
        );
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
