'use client';

import { motion } from 'framer-motion';
import { useState, useRef, MouseEvent } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  category: string;
  tags: string[];
  link?: string;
  github?: string;
  image?: string;
  className?: string;
}

export default function ProjectCard({
  title,
  description,
  category,
  tags,
  link,
  github,
  image,
  className = '',
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 50, y: 50 });
      }}
      className={`glass glass-hover rounded-2xl p-8 lg:p-10 overflow-hidden relative ${className}`}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      } as React.CSSProperties}
    >
      {/* Image background with blur effect */}
      {image && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <div className="w-full h-full bg-gradient-to-br from-indigo/20 via-violet/20 to-blue/20 blur-2xl" />
        </div>
      )}

      {/* Spotlight glow effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.2) 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Glow border on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: isHovered ? '0 0 40px rgba(99, 102, 241, 0.3), inset 0 0 40px rgba(99, 102, 241, 0.1)' : 'none',
        }}
      />
      
      <div className="relative z-10">
        <div className="inline-block px-4 py-2 glass border border-indigo/30 text-indigo-300 rounded-full text-sm font-semibold mb-4">
          {category}
        </div>
        
        <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-4 tracking-tight">
          {title}
        </h3>
        
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 glass border border-white/10 text-gray-300 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex gap-4">
          {link && (
            <motion.a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo via-violet to-blue text-white rounded-xl font-medium glow-indigo relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue via-indigo to-violet opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
              />
              <span className="relative z-10 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View Live
              </span>
            </motion.a>
          )}
          {github && (
            <motion.a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 glass border border-white/20 text-white rounded-xl font-medium glass-hover"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              View GitHub
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
