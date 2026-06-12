import { motion } from "framer-motion";
import ExperienceManager from "./components/experience-manager";

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
