"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { assets } from "@/config/assets";

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative py-28 bg-[#0f172a] overflow-hidden"
    >
      {/* Background radial */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100"
          style={{
            background:
              "radial-gradient(ellipse at bottom, rgba(34,211,238,0.05) 0%, transparent 70%)",
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
          <Badge variant="cyan">Témoignages</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f1f5f9]">
            Ce que disent nos clients
          </h2>
          <p className="text-lg text-[#94a3b8] max-w-xl">
            Des centaines de sociétés de gardiennage font confiance à Safyr pour
            gérer leurs équipes d&apos;agents de sécurité au quotidien.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {siteConfig.testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="relative p-6 rounded-2xl border border-[#2d4160]/60 bg-[#1a2d45]/40 hover:border-[#22d3ee]/30 hover:bg-[#1a2d45]/70 transition-all duration-300 flex flex-col group"
            >
              {/* Quote icon */}
              <Quote
                size={20}
                className="text-[#22d3ee]/40 mb-4 shrink-0 group-hover:text-[#22d3ee]/70 transition-colors"
              />

              {/* Quote text */}
              <p className="text-sm text-[#94a3b8] leading-relaxed flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#2d4160]/60">
                <Image
                  src={assets.avatars[t.avatar]}
                  alt={t.name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover border border-[#2d4160] shrink-0"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-[#f1f5f9]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#64748b]">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
