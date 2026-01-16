'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RevealAnimation from './RevealAnimation';
import StaggerContainer from './StaggerContainer';
import TestimonialsParticleBackground from './TestimonialsParticleBackground';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Testimonial {
  id: number;
  clientName: string;
  rating: number;
  review: string;
  project: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    clientName: 'Upwork Client',
    rating: 5,
    review:
      'Working with Moin has been a positive experience. Moin worked with me to provide a solution and finished product that fits the budget I’m looking for. He worked streamlining or adapting the work to fit my budget and what needed to be developed. I’m looking forward to working with him on future projects.',
    project: 'AI Module Integration in Existing MERN Application',
    date: 'Sep 10, 2024 - Jan 5, 2025',
  },
  {
    id: 2,
    clientName: 'Upwork Client',
    rating: 5,
    review:
      'Moin did an excellent job making the landing page for my site responsive, and looking great on all devices (mobile/desktop). I highly recommend him to anyone looking for high quality front end design.',
    project: 'Landing Page',
    date: 'Feb 24, 2024 - Apr 15, 2024',
  },
  {
    id: 3,
    clientName: 'Upwork Client',
    rating: 5,
    review:
      'Moin went above and beyond to deliver an amazing job within the agreed timeframe. He listened and understood exactly what was required and even made creative and innovative suggestions. He is highly recommended.',
    project: 'Additional Page and Amendments on Existing Web Page',
    date: 'Apr 9, 2024 - Apr 10, 2024',
  },
  {
    id: 4,
    clientName: 'Upwork Client',
    rating: 5,
    review:
      'Moin delivered excellent work on this project and I enjoyed working with him. He understood what I wanted and built from the scratch. His communication was top-notch, and he possessed the requisite skills. He listened attentively and carried out all requested amendments without complaints. I enjoyed working with him and will most likely have additional jobs for him in the future.',
    project: 'Build Professional Crypto Project Landing Page',
    date: 'Mar 17, 2024 - Mar 25, 2024',
  },
  {
    id: 5,
    clientName: 'Upwork Client',
    rating: 5,
    review:
      'Moin proved to be a highly capable and skilled developer who swiftly resolved my project’s issue in a short span of time. I am extremely satisfied with his work and look forward to working with him again in the future. I would definitely recommend him without any reservations.',
    project: 'NestJs Arabic Encoding Issue',
    date: 'Feb 12, 2024 - Feb 13, 2024',
  },
  {
    id: 6,
    clientName: 'Upwork Client',
    rating: 5,
    review:
      'Moin diagnosed my issue immediately and helped resolve a technically complex problem in a couple hours (on a few hours rest no less). He is an excellent developer I would recommend.',
    project: 'Firebase RealTime Database Help',
    date: 'Jan 14, 2024 - Jan 15, 2024',
  },
  {
    id: 7,
    clientName: 'Upwork Client',
    rating: 5,
    review:
      'Moin created a beautiful front-end for my website in a very very short time. Super quick and efficient — excellent work!',
    project: 'HTML Frontend Build',
    date: 'Jan 21, 2024 - Jan 21, 2024',
  },
  {
    id: 8,
    clientName: 'Upwork Client',
    rating: 5,
    review:
      'Moin did an excellent job creating my beta arcade game — he went above and beyond to make the game fun, and visually pleasing for players.',
    project: 'Frogger Mini-Game + Leaderboard Database Build',
    date: 'Jan 28, 2024 - Feb 7, 2024',
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [100, 0]);

  return (
    <section
      ref={ref}
      id="testimonials"
      className="py-32 relative overflow-hidden"
    >
      <TestimonialsParticleBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div style={{ opacity, y }}>
          <RevealAnimation>
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                duration: 0.8,
              }}
            >
              What Clients Are Saying
            </motion.h2>
          </RevealAnimation>
          
          <RevealAnimation delay={0.1}>
            <motion.p
              className="text-xl text-gray-400 mb-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                delay: 0.2,
                duration: 0.8,
              }}
            >
              Real feedback from Upwork clients
            </motion.p>
          </RevealAnimation>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10" staggerDelay={0.12}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 200,
                  delay: index * 0.15,
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="rounded-2xl p-8 lg:p-10 cursor-pointer relative overflow-hidden border border-white/20 bg-white/5 backdrop-blur-2xl shadow-[0_25px_60px_rgba(2,6,23,0.65)]"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    boxShadow: '0 0 50px rgba(14, 165, 233, 0.25), inset 0 0 60px rgba(224, 242, 254, 0.08)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-70" />
                <div className="flex items-center justify-between mb-6 relative">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-400/80">
                      {testimonial.clientName}
                    </p>
                    <h3 className="text-2xl text-white font-semibold mt-2">
                      {testimonial.project}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                    <span className="text-xs text-white/40">{testimonial.date}</span>
                  </div>
                </div>

                <p className="text-gray-100 leading-relaxed text-lg">
                  “{testimonial.review}”
                </p>
              </motion.div>
            ))}
          </StaggerContainer>

          {/* Upwork link */}
          <RevealAnimation delay={0.4}>
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                delay: 0.5,
              }}
            >
              <motion.a
                href="https://www.upwork.com/freelancers/moinlatif?mp_source=share"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo via-violet to-blue text-white rounded-xl font-medium glow-indigo relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue via-indigo to-violet opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <span className="relative z-10 flex items-center gap-2">
                  View All Reviews on Upwork
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </span>
              </motion.a>
            </motion.div>
          </RevealAnimation>
        </motion.div>
      </div>
    </section>
  );
}
