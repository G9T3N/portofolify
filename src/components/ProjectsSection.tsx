import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useProjects } from "@/queries";
import { ProjectCard } from "./portfolio/ProjectCard";

const ProjectsSection = () => {
  const { data: projects, isLoading } = useProjects();
  const targetRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const displayProjects = projects ?? [];

  useEffect(() => {
    if (carouselRef.current) {
      const updateRange = () => {
        if (carouselRef.current) {
          const scrollWidth = carouselRef.current.scrollWidth;
          const clientWidth = carouselRef.current.clientWidth;
          setScrollRange(Math.max(0, scrollWidth - clientWidth));
        }
      };

      updateRange();
      window.addEventListener("resize", updateRange);
      return () => window.removeEventListener("resize", updateRange);
    }
  }, [displayProjects]);

  const totalSections = displayProjects.length > 0 ? displayProjects.length + 1 : 2;
  const pauseRatio = 1 / totalSections;
  const endRatio = 1 - pauseRatio;

  const x = useTransform(
    scrollYProgress,
    [0, pauseRatio, endRatio, 1],
    [0, 0, -scrollRange, -scrollRange]
  );

  return (
    <section
      ref={targetRef}
      id="projects"
      style={{ height: isLoading ? "100vh" : `calc(${displayProjects.length * 100}vh + 100vh)` }}
      className="relative bg-[var(--color-bg-primary)]"
    >
      <div className="sticky  top-0 flex flex-col h-screen items-center overflow-hidden ">

        {/* Section label */}
        <div className=" m-10 z-10">
          <motion.span
            className="section-label "
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Selected Work
          </motion.span>
        </div>

        {/* Projects list */}
        <div className="w-full mt-12 md:mt-0 overflow-hidden" ref={carouselRef}>
          {isLoading ? (
            <div className="flex gap-6 overflow-hidden">
              {[0, 1, 2].map((i) => (
                <div key={i} className="shrink-0 w-[85vw]  h-[70vh] bg-[var(--color-bg-card)] rounded-4xl animate-pulse border border-[var(--color-border-default)]" />
              ))}
            </div>
          ) : (
            <motion.div
              style={{ x }}
              className="flex gap-6 items-center w-max"
            >
              {displayProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
