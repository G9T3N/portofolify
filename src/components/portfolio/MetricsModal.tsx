import { motion, AnimatePresence } from "framer-motion";

export interface Metric {
  label: string;
  value: number | string;
  unit: string;
  max?: number;
}

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: Metric[];
}

export const MetricsModal = ({ isOpen, onClose, metrics }: MetricsModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50  flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute  inset-0 backdrop-blur-md bg-background/80"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-4xl border border-border p-6  shadow-2xl max-w-2xl w-full z-10 glass-card"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">All Metrics</h2>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-[var(--color-text-primary)] cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {metrics.map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-border/50 hover:bg-white/10 transition-colors">
                  <span className="text-3xl font-bold text-[var(--color-text-primary)] flex items-baseline">
                    {stat.value}
                    {stat.unit && <span className="text-xl ml-1">{stat.unit}</span>}
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)] mt-1 text-center">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
