import { motion } from "framer-motion";

export const FeaturedCard = () => {
  return (
    <motion.div
      className="md:col-span-4  mt-12 md:mt-0 relative"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 backdrop-blur-3xl rounded-4xl transform translate-x-4 translate-y-4 border bg-primary/10 border-border h-[40vh] " />
      <div className="relative rounded-4xl p-4 border shadow-2xl overflow-hidden flex flex-col h-[40vh] bg-card border-border">
        <div className="flex items-center justify-between mb-4 px-2">
          <span className="mp-label-caps text-muted-foreground"></span>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-4xl bg-border" />
            <div className="w-2 h-2 rounded-4xl bg-border" />
            <div className="w-2 h-2 rounded-4xl bg-primary" />
          </div>
        </div>
        <div className="flex-grow rounded-4xl overflow-hidden relative">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/favicon.svg"
              alt="Mr.Err"
              className="w-24 h-24 md:w-32 md:h-32 opacity-30"
            />
          </div>
          <div className="absolute inset-0 border rounded-4xl pointer-events-none border-border" />
        </div>
        <div className="mt-4 px-2 flex justify-between items-center mp-label-mono">
          <span className="text-muted-foreground">EST. 2014</span>
          <span className="text-primary">ONLINE</span>
        </div>
      </div>
    </motion.div>
  );
};
