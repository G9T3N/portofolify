import { motion } from "framer-motion";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Metric, MetricsModal } from "./MetricsModal";
import { useCertificates, useGithubStats, useProjects, useSkills, useWorkExperiences } from "@/queries";



export const Gauge = () => {
  const { data: githubData } = useGithubStats("G9t3n");

  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: certificates } = useCertificates();
  const { data: experiences } = useWorkExperiences();

  const [currentStat, setCurrentStat] = useState(0);

  const yearsExperience = experiences && experiences.length > 0
    ? Math.max(1, new Date().getFullYear() - new Date(Math.min(...experiences.map(e => new Date(e.start_date).getTime()))).getFullYear())
    : 0;
  const radius = 80;
  const circumference = Math.PI * radius;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const projectCount = projects?.length ?? 0;
  const skillCount = skills?.length ?? 0;
  const certificateCount = certificates?.length ?? 0;
  const coreStats: Metric[] = [
    { label: "Projects Delivered", value: projectCount > 0 ? projectCount : 25, unit: "+", max: 100 },
    { label: "Years Experience", value: yearsExperience > 0 ? yearsExperience : 10, unit: "+", max: 20 },
    { label: "Skills Mastered", value: skillCount > 0 ? skillCount : 40, unit: "+", max: 100 },
    { label: "Certificates Earned", value: certificateCount > 0 ? certificateCount : 5, unit: "", max: 20 },
  ];
  const percentage = Math.max(0, Math.min(Number(coreStats[currentStat].value) / (coreStats[currentStat].max || 1), 1));
  const strokeDashoffset = circumference - percentage * circumference;

  const allMetrics: Metric[] = [
    ...coreStats,
    { label: "Code Commits", value: githubData?.commits ?? 3200, unit: "+", max: 5000 },
    { label: "Lines of Code", value: githubData?.linesOfCode ?? 5000, unit: "", max: 10000 },
    { label: "Hours Debugging", value: githubData?.hoursDebugging ?? 999, unit: "h+", max: 1000 },
    { label: "Coffee Cups", value: githubData?.coffeeCups ?? 1250, unit: "", max: 2000 },
    { label: "Happy Clients", value: projectCount > 0 ? Math.max(1, Math.floor(projectCount * 0.9)) : 24, unit: "", max: 50 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % coreStats.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [coreStats.length]);
  return (
    <motion.div
      className="relative rounded-4xl p-4 border shadow-2xl overflow-hidden flex flex-col h-[35vh] bg-card border-border"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >

      <div className="flex items-center justify-between mb-4 ">
        <span className="text-sm text-[var(--color-text-secondary)] mt-0 font-medium">
          {"Metrics"}
        </span>
        <div className="flex gap-2">
          <EllipsisVertical className="text-[var(--color-text-muted)] cursor-pointer" onClick={() => setIsModalOpen(true)} />
        </div>
      </div>
      <div className="flex-grow rounded-4xl overflow-hidden relative">
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-full max-w-[240px] drop-shadow-2xl overflow-visible" viewBox="0 0 200 120">
            {/* Background Arc */}

            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="var(--color-border-default, rgba(255,255,255,0.1))"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Foreground Arc */}
            <motion.path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="var(--color-primary, #008000)"
              strokeWidth="22"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ strokeDasharray: circumference }}
            />
          </svg>

          <div className="absolute bottom-6 start-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="flex items-baseline">
              <motion.span
                key={Number(coreStats[currentStat].value)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-[var(--color-text-primary)]"
              >
                {Number(coreStats[currentStat].value)}
              </motion.span>
              <span className="text-4xl text-[var(--color-text-primary)]">{coreStats[currentStat].unit}</span>
            </div>
            <span className="text-sm text-[var(--color-text-secondary)] mt-0 font-medium">
              {coreStats[currentStat].label}
            </span>
          </div>
        </div>
        <div className="absolute inset-0 border rounded-4xl pointer-events-none border-border" />
      </div>
      <div className="mt-4 px-1 flex justify-center items-center mp-label-mono">
        {/* Dot indicators */}
        <div className="flex gap-2 ">
          {coreStats.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-4xl transition-colors cursor-pointer ${i === currentStat
                ? "bg-[var(--color-primary)]"
                : "bg-[var(--color-border-default)]"
                }`}
              onClick={() => setCurrentStat(i)}
            />
          ))}
        </div>
      </div>
      <MetricsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        metrics={allMetrics}
      />
    </motion.div >
  );
};
