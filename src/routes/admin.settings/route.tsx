import { motion } from "framer-motion";
import CVManager from "./components/cv-manager";

export default function AdminSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CVManager />
    </motion.div>
  );
}
