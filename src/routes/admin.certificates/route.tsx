import { motion } from "framer-motion";
import CertificatesManager from "./components/certificates-manager";

export default function AdminCertificates() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CertificatesManager />
    </motion.div>
  );
}
