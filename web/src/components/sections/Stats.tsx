"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-20 bg-[#0f172a] overflow-hidden">
      {/* Accent line top */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#22d3ee]/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#22d3ee]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#2d4160]">
          {siteConfig.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center px-6 py-4 group"
            >
              <span
                className="text-4xl sm:text-5xl font-bold text-[#22d3ee] tabular-nums tracking-tight"
                style={{
                  textShadow: "0 0 24px rgba(34,211,238,0.35)",
                }}
              >
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-[#64748b] group-hover:text-[#94a3b8] transition-colors">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
