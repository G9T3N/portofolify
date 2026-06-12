import { motion } from "framer-motion";
import StacksManager from "./components/stacks-manager";

export default function AdminStacks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StacksManager />
    </motion.div>
  );
}
