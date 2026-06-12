import { motion } from "framer-motion";
import { ArrowUpRight, GitBranch, ExternalLink, ArrowRight } from "lucide-react";

export interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    thumbnail_url: string | null;
    tech_stack: string[] | null;
    live_url: string | null;
    code_url: string | null;
  };
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      className=" lg:w-[30vw] w-[80vw] h-[80vh] mt-12 md:mt-0 relative"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="group rounded-4xl h-full p-4 border space-y-2 shadow-2xl overflow-hidden flex flex-col bg-card border-border">
        {/* Thumbnail */}
        <span className="px-2 py-1 text-xs w-fit font-medium rounded-md bg-[var(--color-bg-elevated)] border border-border text-[var(--color-text-muted)] group-hover:border-[var(--color-mp-primary)]/30 group-hover:text-[var(--color-text-primary)] transition-colors">
          {project.category}
        </span>

        <div className="flex-1 flex flex-col rounded-xl ">
          <div className="flex-1 w-full flex items-center justify-center overflow-hidden border rounded-4xl pointer-events-none border-border">
            {project.thumbnail_url ? (
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <img
                src="/favicon.svg"
                alt="Mr.Err"
                className="w-24 h-24  md:w-32 md:h-32 opacity-30 group-hover:opacity-70 transition-opacity duration-300"
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1  bg-card relative z-10">
          <h3 className="text-2xl font-bold tracking-tight text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition-colors duration-300 mb-2">
            {project.title}
          </h3>

          <p className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors duration-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-4 flex-1">
            {project.description}
          </p>

          {/* Tech stack pills */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech_stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 text-xs font-medium rounded-md bg-[var(--color-bg-elevated)] border border-border text-[var(--color-text-muted)] group-hover:border-[var(--color-mp-primary)]/30 group-hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          {project.code_url && (
            <div className="flex items-center gap-4 mt-auto pt-3 border-t border-border">
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-mp-primary)] transition-colors"
              >
                <ExternalLink size={16} /> Live Demo
              </a>
              <a
                href={project.code_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <GitBranch size={16} /> Source
              </a>
              <a
                href={project.live_url ?? project.code_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto w-9 h-9 rounded-full bg-card flex items-center justify-center border border-border group-hover:bg-[var(--color-text-primary)] group-hover:text-[var(--color-bg-primary)] transition-colors"
              >
                <ArrowRight className="group-hover:rotate-[-45deg] transition-all duration-300" size={16} />
              </a>
            </div>
          )}

        </div>
      </div>
      <div className="absolute inset-0 border rounded-4xl pointer-events-none border-border" />
    </motion.div >
  );
}
