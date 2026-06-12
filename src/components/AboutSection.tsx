import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Lanyard from "./Lanyard";

const AboutSection = () => {
  return (
    <section id="about" className="px-4 md:px-8 lg:px-12 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center ">
          {/* Photo */}
          <div className="flex-1">

            <Lanyard />
          </div>

          {/* Text */}
          <motion.div
            className=" flex-1"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-2xl sm:text-3xl md:text-4xl leading-[1.3] font-light text-[var(--color-text-secondary)]">
              I&apos;m a{" "}
              <strong className="font-bold text-[var(--color-text-primary)]">
                Full Stack Developer
              </strong>{" "}
              &{" "}
              <strong className="font-bold text-[var(--color-text-primary)]">
                designer
              </strong>{" "}
              specializing in{" "}
              <strong className="font-bold text-[var(--color-text-primary)]">
                Frontend Engineering,
              </strong>{" "}
              focusing on building high quality web experiences through{" "}
              <strong className="font-bold text-[var(--color-text-primary)]">
                clean code
              </strong>{" "}
              and{" "}
              <strong className="font-bold text-[var(--color-text-primary)]">
                thoughtful design.
              </strong>
            </p>

            {/* CTA button */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-pill"
              >
                <Sparkles className="w-4 h-4" />
                Get in touch
                <Sparkles className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
