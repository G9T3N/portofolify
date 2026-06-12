import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Gauge } from "./portfolio/Gauge";
import { FeaturedCard } from "./portfolio/FeaturedCard";
import LogoCarousel from "./LogoCarousel";

const HeroSection = () => {



  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col">
      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 pt-5 pb-8">
        {/* Left — Gradient mesh hero image */}
        <motion.div
          className="relative flex-1 gradient-mesh rounded-4xl rounded-ee-none overflow-hidden min-h-[50vh] lg:min-h-0 "
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex flex-col justify-start h-full">
            {/* Bottom text overlay */}
            <motion.div
              className="inverted-border-card ps-0 p-7 md:pt-16"
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-3xl word-break sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
                Equal parts creative
                <br />
                developer & designer
              </h1>
            </motion.div>
          </div>

          <motion.div
            className="absolute end-0 bottom-0   ;
 "
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="inverted-border-button rounded-ss-4xl rounded-ee-none! flex flex-col justify-start h-full">

              <motion.button
                className="bg-[var(--color-mp-text-primary)] cursor-pointer text-[var(--color-bg-primary)] px-10 h-12 m-5 mb-1 me-0 rounded-xl border flex items-center gap-2   "
                onClick={scrollToProjects}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <p>Let's Build</p> <ArrowRight />
              </motion.button>
            </div>
          </motion.div>

        </motion.div>

        {/* Right sidebar */}
        <div className="flex lg:flex-col gap-10 lg:w-[320px]">
          {/* Featured card */}
          <FeaturedCard />

          {/* Stat circle */}

          <Gauge />
        </div>


      </div>
      <LogoCarousel />


    </section>
  );
};

export default HeroSection;
