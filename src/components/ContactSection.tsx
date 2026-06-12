import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { useSendMessage } from "@/queries";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendMessage.mutateAsync(formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch {
      console.error("Failed to send message");
    }
  };

  return (
    <section id="contact" className="relative min-h-screen flex flex-col">
      {/* Card background */}
      <div className="relative flex-1 bg-[var(--color-bg-card)] border border-[var(--color-border-default)] rounded-4xl mx-4 md:mx-8 lg:mx-12 mb-4 md:mb-8 lg:mb-12 overflow-hidden">
        <div className="relative  flex flex-col justify-between h-full p-8 md:p-12 lg:p-20">
          {/* Main CTA text */}
          <motion.div
            className="max-w-3xl mt-8"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)]">
              Wanna create
              <br />
              something{" "}
              <span className="italic">awesome</span>
              <br />
              together?
            </h2>
          </motion.div>

          {/* Contact form */}
          <motion.div
            className="mt-12 max-w-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {submitted ? (
              <motion.div
                className="text-xl font-medium text-[var(--color-text-primary)]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ✨ Message sent! I&apos;ll get back to you soon.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => { setFormData((prev) => ({ ...prev, name: e.target.value })); }}
                    required
                    className="form-input flex-1 rounded-xl"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) => { setFormData((prev) => ({ ...prev, email: e.target.value })); }}
                    required
                    className="form-input flex-1 rounded-xl"
                  />
                </div>
                <textarea
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={(e) => { setFormData((prev) => ({ ...prev, message: e.target.value })); }}
                  required
                  rows={4}
                  className="form-input resize-none rounded-xl"
                />
                <button
                  type="submit"
                  disabled={sendMessage.isPending}
                  className="bg-[var(--color-mp-text-primary)] cursor-pointer text-[var(--color-bg-primary)] px-10 h-12 rounded-xl border flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {sendMessage.isPending ? "Sending..." : "Send message"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Bottom area */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-sm text-[var(--color-text-secondary)]">
              Don&apos;t like forms? Reach out at{" "}
              <a
                href="mailto:contact@mrerr.dev"
                className="font-semibold text-[var(--color-text-primary)] hover:underline"
              >
                contact@mrerr.dev
              </a>
            </p>

            <a
              href="mailto:contact@mrerr.dev"
              className="bg-[var(--color-mp-text-primary)] text-[var(--color-bg-primary)] px-10 h-12 rounded-xl border flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4" />
              Let&apos;s talk
              <Sparkles className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
