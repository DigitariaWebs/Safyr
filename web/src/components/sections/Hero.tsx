"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BeamsBackground } from "@/components/ui/beams-background";
import { siteConfig } from "@/config/site";

import type { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }, // Réduit les délais
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 }, // Réduit le déplacement
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }, // Réduit la durée
  },
};

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f172a]"
    >
      {/* Beams background - optimisé pour les performances */}
      <BeamsBackground className="absolute inset-0" intensity="subtle" />

      {/* Radial gradient center glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(34,211,238,0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(to right, #22d3ee 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <Badge variant="cyan" className="gap-1.5">
                <Sparkles size={11} className="text-[#22d3ee]" />
                {siteConfig.hero.badge}
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f1f5f9] leading-[1.1]"
            >
              {siteConfig.hero.headline
                .split(" ")
                .reduce<React.ReactNode[]>((acc, word, i, arr) => {
                  // Highlight "RH" and "Main courante digitale"
                  const highlighted = [
                    "RH",
                    "Main",
                    "courante",
                    "digitale",
                    "Gardiennage",
                  ];
                  const el =
                    highlighted.includes(word) ||
                    highlighted.some((h) => word.startsWith(h)) ? (
                      <span key={i} className="text-[#22d3ee]">
                        {word}
                        {i < arr.length - 1 ? " " : ""}
                      </span>
                    ) : (
                      <span key={i}>
                        {word}
                        {i < arr.length - 1 ? " " : ""}
                      </span>
                    );
                  acc.push(el);
                  return acc;
                }, [])}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-[#94a3b8] leading-relaxed"
            >
              {siteConfig.hero.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mt-2"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleScroll(siteConfig.hero.ctaHref)}
                className="group"
              >
                {siteConfig.hero.cta}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleScroll(siteConfig.hero.secondaryCtaHref)}
                className="group"
              >
                <Play size={16} className="fill-current" />
                {siteConfig.hero.secondaryCta}
              </Button>
            </motion.div>

            {/* Social proof count */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mt-4"
            >
              <div className="flex -space-x-2.5">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#1e293b] bg-linear-to-br from-[#22d3ee]/30 to-[#0f172a] flex items-center justify-center text-xs text-[#94a3b8] font-medium"
                    style={{
                      backgroundImage: `url(https://i.pravatar.cc/32?img=${10 + i})`,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-[#94a3b8]">
                Approuvé par{" "}
                <span className="text-[#f1f5f9] font-semibold">
                  plus de 200 sociétés de gardiennage
                </span>{" "}
                en France
              </p>
            </motion.div>
          </motion.div>

          {/* Right column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }} // Réduit les valeurs
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }} // Animation plus rapide
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg">
              <Image
                src="https://res.cloudinary.com/dpo7sqgyg/image/upload/v1771874865/hero_s0w0ue.png"
                alt="Safyr Plateforme"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                priority
                loading="eager"
                quality={85}
              />
              {/* Gradient en bas de l'image */}
              <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-[#0f172a] to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-[#0f172a] to-transparent pointer-events-none" />
    </section>
  );
}
