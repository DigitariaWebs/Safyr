"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="faq"
      ref={ref}
      className="relative py-28 bg-[#1e293b] overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-[#22d3ee]/20 to-transparent" />

      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 flex flex-col items-center gap-4"
        >
          <Badge variant="cyan">FAQ</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#f1f5f9]">
            Questions fréquemment posées
          </h2>
          <p className="text-[#94a3b8] text-lg">
            Tout ce que vous devez savoir avant de prendre une décision.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="flex flex-col gap-2">
          {siteConfig.faq.map((item, i) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={cn(
                "rounded-xl border transition-all duration-200 overflow-hidden",
                openIndex === i
                  ? "border-[#22d3ee]/40 bg-[#0f172a]/80"
                  : "border-[#2d4160]/60 bg-[#1a2d45]/30 hover:border-[#2d4160]",
              )}
            >
              {/* Question */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group cursor-pointer"
                aria-expanded={openIndex === i}
              >
                <span
                  className={cn(
                    "font-medium text-base transition-colors",
                    openIndex === i
                      ? "text-[#f1f5f9]"
                      : "text-[#94a3b8] group-hover:text-[#f1f5f9]",
                  )}
                >
                  {item.question}
                </span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "shrink-0 transition-all duration-300",
                    openIndex === i
                      ? "text-[#22d3ee] rotate-180"
                      : "text-[#64748b] group-hover:text-[#94a3b8]",
                  )}
                />
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm text-[#94a3b8] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
