import { motion } from "framer-motion";
import ExperienceManager from "./components/experience-manager";

/**
 * Render the admin experience UI wrapped in a short fade-and-slide animation.
 *
 * @returns A React element containing `ExperienceManager` inside an animated `motion.div` that transitions from opacity 0 and y 20 to opacity 1 and y 0 over 0.3 seconds.
 */
export default function AdminExperience() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ExperienceManager />
    </motion.div>
  );
}
