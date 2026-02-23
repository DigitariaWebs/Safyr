"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Shield, Zap, Users, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { assets } from "@/config/assets";

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Zap,
  Users,
  BarChart3,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 bg-[#1e293b] overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute right-0 top-0 w-150 h-150"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, rgba(34,211,238,0.05) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-[#2d4160]/60 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
              <Image
                src={assets.images.team}
                alt="Équipe de gardiennage au travail"
                width={800}
                height={420}
                className="w-full h-105 object-cover"
                loading="lazy"
              />
              {/* overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#1e293b]/80 via-transparent to-transparent" />
              {/* floating stat badge */}
              <div className="absolute bottom-5 left-5 bg-[#0f172a]/90 backdrop-blur-sm border border-[#2d4160] rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#22d3ee]/10 flex items-center justify-center">
                  <Zap size={22} className="text-[#22d3ee]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#f1f5f9]">3×</p>
                  <p className="text-xs text-[#64748b]">
                    Traitement RH plus rapide
                  </p>
                </div>
              </div>
            </div>
            {/* Accent dot grid */}
            <div
              className="absolute -bottom-8 -left-8 w-40 h-40 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #22d3ee 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
          </motion.div>

          {/* Right — content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-6"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="cyan">{siteConfig.about.badge}</Badge>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl sm:text-5xl font-bold text-[#f1f5f9] leading-tight"
            >
              {siteConfig.about.headline}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-[#94a3b8] leading-relaxed"
            >
              {siteConfig.about.body}
            </motion.p>

            {/* Values grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-3 mt-2"
            >
              {siteConfig.about.values.map((v) => {
                const Icon = iconMap[v.icon] || Shield;
                return (
                  <div
                    key={v.label}
                    className="flex items-center gap-3 p-4 rounded-xl bg-[#0f172a]/60 border border-[#2d4160]/60 hover:border-[#22d3ee]/30 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#22d3ee]/10 flex items-center justify-center shrink-0 group-hover:bg-[#22d3ee]/20 transition-colors">
                      <Icon size={18} className="text-[#22d3ee]" />
                    </div>
                    <span className="text-sm text-[#94a3b8] group-hover:text-[#f1f5f9] transition-colors font-medium">
                      {v.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
