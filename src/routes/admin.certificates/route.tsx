import { motion } from "framer-motion";
import CertificatesManager from "./components/certificates-manager";

/**
 * Renders the admin certificates management UI inside an animated container.
 *
 * @returns A JSX element containing a Framer Motion `div` that animates into view and hosts the `CertificatesManager` component.
 */
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
