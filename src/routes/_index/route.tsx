import { motion, useScroll } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function HomeRoute() {
  const { scrollYProgress } = useScroll();

  return (
    <div className=" relative min-h-screen max-w-[85vw] mx-auto bg-[var(--color-bg-primary)]">
      <motion.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
      />
      <Navbar />
      <main>
        <div className="snap-section"><HeroSection /></div>
        <div className="snap-section"><ProjectsSection /></div>
        <div className="snap-section"><AboutSection /></div>
        <div className="snap-section"><SkillsSection /></div>
        <div className="snap-section"><ContactSection /></div>
      </main>
      <div className="snap-section">
        <Footer />
      </div>
    </div>
  );
}
