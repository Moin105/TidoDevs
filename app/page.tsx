import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import PartnersShowcase from '@/components/PartnersShowcase';
import WorkflowAnimation from '@/components/WorkflowAnimation';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#02040A] relative">
      <Navigation />
      <Hero />
      <PartnersShowcase />
      <WorkflowAnimation />
      <Projects />
      <Services />
      <Testimonials />
      <Footer />
    </main>
  );
}
