import { motion } from "framer-motion";
import CVManager from "./components/cv-manager";

/**
 * Renders the CVManager wrapped in a framer-motion container that fades in and slides up on mount.
 *
 * @returns A JSX element containing `CVManager` inside a `motion.div` with an entrance animation (opacity from 0 to 1 and `y` from 20 to 0, duration 0.3s).
 */
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
