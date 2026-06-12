import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Logo from "../assets/LogoHqNoBG.svg";
const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { window.removeEventListener("scroll", handleScroll); };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (

    <motion.header
      className="absolute top-5  z-1   "
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav
        className={cn(
          "glass-nav flex items-center gap-1 rounded-4xl px-2 py-2 transition-all duration-500",
          scrolled && "shadow-lg shadow-black/20"
        )}
      >


        {/* Nav links */}
        <div className="flex items-center">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { handleNavClick(e, link.href); }}
              className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] rounded-4xl transition-colors hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Theme dot pattern (decorative, like davidhaz.com) */}
        <button
          className="ml-1 w-10 h-10 rounded-4xl flex items-center justify-center transition-colors hover:bg-[var(--color-bg-elevated)]"
          aria-label="Theme toggle"
        >
          <div className="grid grid-cols-3 gap-[3px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-[3px] h-[3px] rounded-4xl bg-[var(--color-text-secondary)]"
              />
            ))}
          </div>
        </button>
      </nav>
    </motion.header>

  );
};

export default Navbar;
