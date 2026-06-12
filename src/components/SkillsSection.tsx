import { motion } from "framer-motion";
import { Code, Layout, Globe } from "lucide-react";

const SKILLS_DATA = [
  {
    label: "Web",
    icon: Code,
    suffix: "development",
  },
  {
    label: "Interface",
    icon: Layout,
    suffix: "design",
  },
  {
    label: "Full-stack",
    icon: Globe,
    suffix: "engineering",
  },
] as const;

const SkillsSection = () => {
  return (
    <section id="skills" className="px-4 md:px-8 lg:px-12 py-24 md:py-32 overflow-hidden">
      {/* Section label */}
      <motion.div
        className="flex justify-end mb-20 max-w-[1400px] mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="section-label">Skills & Services</span>
      </motion.div>

      {/* Massive typography rows */}
      <div className="max-w-[1400px] mx-auto space-y-12 md:space-y-20">
        {SKILLS_DATA.map((skill, index) => (
          <motion.div
            key={skill.label}
            className="flex items-center justify-center flex-wrap gap-4 md:gap-8"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.8,
              delay: index * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* First word */}
            <span className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {skill.label}
            </span>

            {/* Icon container */}
            <motion.div
              className="w-16 h-16 md:w-24 md:h-24 rounded-4xl border border-[var(--color-border-default)] bg-[var(--color-bg-card)] flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <skill.icon className="w-8 h-8 md:w-12 md:h-12 text-[var(--color-text-secondary)]" />
            </motion.div>

            {/* Second word */}
            <span className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {skill.suffix}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
