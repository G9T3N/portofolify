import React from "react";
import {
  Code,
  Terminal,
  Database,
  Globe,
  Server,
  Cpu,
  Monitor,
  Smartphone,
  Cloud,
  Shield
} from "lucide-react";

const LOGOS = [
  { icon: Code, name: "React" },
  { icon: Terminal, name: "TypeScript" },
  { icon: Database, name: "Supabase" },
  { icon: Globe, name: "Next.js" },
  { icon: Server, name: "Node.js" },
  { icon: Cpu, name: "GraphQL" },
  { icon: Monitor, name: "Tailwind CSS" },
  { icon: Smartphone, name: "React Native" },
  { icon: Cloud, name: "AWS" },
  { icon: Shield, name: "Cybersecurity" },
];

export default function LogoCarousel() {
  return (
    <div className=" w-full bg-[var(--color-bg-elevated)] py-2 overflow-hidden border-y border-[var(--color-border-default)]">
      <div className="relative flex max-w-[100vw] overflow-hidden group">
        <div className="flex w-max gap-16 animate-marquee group-hover:[animation-play-state:paused]">
          {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, index) => (
            <div
              key={index}
              className="flex items-center gap-2  flex-1 w-fit  py-2   text-[var(--color-text-muted)] hover:text-[var(--color-mp-primary)] transition-colors duration-300"
            >
              <logo.icon size={24} />
              <span className="font-mono w-full break-keep whitespace-nowrap  text-sm uppercase tracking-wider font-semibold">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
