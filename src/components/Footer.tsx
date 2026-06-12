import { GitMerge, Dock, Mail } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: GitMerge, href: "https://github.com/mrerr", label: "GitHub" },
  { icon: Dock, href: "https://linkedin.com/in/mrerr", label: "LinkedIn" },
  { icon: Mail, href: "mailto:contact@mrerr.dev", label: "Email" },
] as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 md:px-8 lg:px-12 py-12 border-t border-[var(--color-border-default)]">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Copyright */}
        <p className="text-sm text-[var(--color-text-muted)]">
          © {currentYear} Mr.Err. All rights reserved.
        </p>

        {/* Social links */}
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="w-10 h-10 rounded-4xl border border-[var(--color-border-default)] flex items-center justify-center text-[var(--color-text-muted)] transition-all hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)] hover:scale-110"
            >
              <link.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
