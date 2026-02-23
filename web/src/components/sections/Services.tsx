"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  BookOpen,
  DollarSign,
  ShieldCheck,
  Settings2,
  BarChart3,
  FolderOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

const iconMap: Record<string, React.ElementType> = {
  Users,
  BookOpen,
  DollarSign,
  ShieldCheck,
  Settings2,
  BarChart3,
  FolderOpen,
};

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      ref={ref}
      className="relative py-28 bg-[#0f172a] overflow-hidden"
    >
      {/* Background radial */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-150"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(34,211,238,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 flex flex-col items-center gap-4"
        >
          <Badge variant="cyan">Fonctionnalités de la plateforme</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f1f5f9]">
            Tout ce dont votre société de gardiennage a besoin
          </h2>
          <p className="text-lg text-[#94a3b8] max-w-2xl">
            De la gestion RH à la paie, en passant par les registres de
            gardiennage, Safyr couvre chaque flux de travail RH et opérationnel
            dans une plateforme unique et unifiée.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {siteConfig.services.map((service, i) => {
            const Icon = iconMap[service.icon] || Users;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group relative p-6 rounded-2xl border border-[#2d4160]/60 bg-[#1a2d45]/40 hover:border-[#22d3ee]/40 hover:bg-[#1a2d45]/80 transition-all duration-300 overflow-hidden"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      background:
                        "radial-gradient(circle at top left, rgba(34,211,238,0.06) 0%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center mb-5 group-hover:bg-[#22d3ee]/20 transition-colors">
                  <Icon size={22} className="text-[#22d3ee]" />
                </div>

                {/* Content */}
                <h3 className="text-[#f1f5f9] font-semibold text-base mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-[#64748b] group-hover:text-[#94a3b8] transition-colors leading-relaxed">
                  {service.description}
                </p>

                {/* Bottom accent on hover */}
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-[#22d3ee]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
