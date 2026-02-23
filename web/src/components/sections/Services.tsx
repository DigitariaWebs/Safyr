"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  Receipt,
  Landmark,
  CalendarDays,
  MapPin,
  Package,
  ScanLine,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

const iconMap: Record<string, React.ElementType> = {
  Users,
  BookOpen,
  DollarSign,
  BarChart3,
  Receipt,
  Landmark,
  CalendarDays,
  MapPin,
  Package,
  ScanLine,
};

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE },
  },
};

function ServiceCard({
  service,
  index,
}: {
  service: (typeof siteConfig.services)[number];
  index: number;
}) {
  const shouldReduce = useReducedMotion();
  const Icon = iconMap[service.icon] || Users;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={
        shouldReduce
          ? {}
          : {
              y: -6,
              transition: { duration: 0.22, ease: "easeOut" },
            }
      }
      className="group relative p-6 rounded-2xl border border-[#2d4160]/60 bg-[#1a2d45]/40 hover:border-[#22d3ee]/40 hover:bg-[#1a2d45]/80 transition-colors duration-300 overflow-hidden flex flex-col gap-4 cursor-default"
    >
      {/* Corner glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(34,211,238,0.07) 0%, transparent 55%)",
        }}
      />

      {/* Icon with animated pulse ring */}
      <div className="relative w-11 h-11 shrink-0">
        <motion.div
          className="absolute inset-0 rounded-xl border border-[#22d3ee]/0 group-hover:border-[#22d3ee]/30"
          animate={
            shouldReduce
              ? {}
              : {
                  scale: [1, 1.28, 1],
                  opacity: [0, 0.5, 0],
                }
          }
          transition={{
            duration: 2.2,
            delay: index * 0.15,
            repeat: Infinity,
            repeatDelay: 1.8,
            ease: "easeOut",
          }}
        />
        <div className="w-11 h-11 rounded-xl bg-[#22d3ee]/10 flex items-center justify-center group-hover:bg-[#22d3ee]/20 transition-colors duration-300">
          <Icon
            size={20}
            className="text-[#22d3ee] group-hover:scale-110 transition-transform duration-200"
          />
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[#f1f5f9] font-semibold text-sm leading-snug">
          {service.title}
        </h3>
        <p className="text-sm text-[#64748b] group-hover:text-[#94a3b8] transition-colors duration-200 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Bottom sliding accent */}
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-[#22d3ee]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-center" />
    </motion.div>
  );
}

export default function Services() {
  return (
    <section
      id="services"
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
          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mb-16 flex flex-col items-center gap-4"
        >
          <Badge variant="cyan">Fonctionnalités de la plateforme</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f1f5f9] max-w-2xl leading-tight">
            Tout ce dont votre société de gardiennage a besoin
          </h2>
          <p className="text-lg text-[#94a3b8] max-w-2xl">
            De la gestion RH à la comptabilité, en passant par la planification,
            la géolocalisation, la facturation, le stock et la main courante
            digitale, Safyr couvre chaque flux de travail dans une plateforme
            unique et unifiée.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {siteConfig.services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
