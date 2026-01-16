'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.6,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between h-20">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="text-2xl font-bold text-white cursor-pointer"
          >
            Tidodevs
          </motion.div>
          <div className="hidden md:flex space-x-8">
            {['Home', 'Partners', 'Projects', 'Services', 'Testimonials', 'Contact'].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-300 hover:text-white transition-colors font-medium relative group"
                >
                  {item}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo via-violet to-blue group-hover:w-full transition-all duration-300"
                    initial={false}
                  />
                </button>
              )
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('contact')}
            className="px-6 py-2 bg-gradient-to-r from-indigo via-violet to-blue text-white rounded-xl font-medium glow-indigo relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue via-indigo to-violet opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={false}
            />
            <span className="relative z-10">Get Started</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
